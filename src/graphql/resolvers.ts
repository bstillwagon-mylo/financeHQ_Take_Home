import { Prisma, PrismaClient, RegistrationStatus } from '@prisma/client';
import { Context } from '../context';
import { 
  ValidationError, 
  NotFoundError,
  PaginationInput,
  EventFilterInput,
  Event
} from '../types';

export const resolvers = {
  Query: {
    users: (_: any, __: any, { prisma }: Context) => {
      return prisma.user.findMany();
    },
    user: (_: any, { id }: { id: string }, { prisma }: Context) => {
      return prisma.user.findUnique({
        where: { id },
        include: { registrations: true },
      });
    },
    events: async (_: any, { 
      pagination,
      filter 
    }: { 
      pagination: PaginationInput,
      filter?: EventFilterInput 
    }, { prisma }: Context) => {
      const where: Prisma.EventWhereInput = {
        AND: [
          ...(filter?.category ? [{ category: filter.category }] : []),
          ...(filter?.dateFrom ? [{ date: { gte: new Date(filter.dateFrom) } }] : []),
          ...(filter?.dateTo ? [{ date: { lte: new Date(filter.dateTo) } }] : []),
          ...(filter?.searchTerm ? [{
            OR: [
              { title: { contains: filter.searchTerm, mode: Prisma.QueryMode.insensitive } },
              { description: { contains: filter.searchTerm, mode: Prisma.QueryMode.insensitive } },
            ],
          }] : []),
        ],
      };

      const totalCount = await prisma.event.count({ where });
      
      const events = await prisma.event.findMany({
        where,
        take: pagination.first,
        skip: pagination.after ? 1 : 0,
        cursor: pagination.after ? { id: pagination.after } : undefined,
        orderBy: { date: 'asc' },
      });

      return {
        edges: events.map(event => ({
          cursor: event.id,
          node: event,
        })),
        pageInfo: {
          hasNextPage: events.length === pagination.first,
          endCursor: events[events.length - 1]?.id,
        },
      }},
    event: (_: any, { id }: { id: string }, { prisma }: Context) => {
      return prisma.event.findUnique({
        where: { id },
        include: { registrations: true },
      });
    },
  },
  Mutation: {
    createUser: async (_: any, { input }: { input: { name: string; email: string } }, { prisma }: Context) => {
      if (!input.email.includes('@')) {
        throw new ValidationError('Invalid email format');
      }

      try {
        return await prisma.user.create({
          data: input,
        });
      } catch (error: any) {
        if (error.code === 'P2002') {
          throw new ValidationError('Email already exists');
        }
        throw error;
      }
    },
    createEvent: (_: any, { input }: { 
      input: { 
        title: string; 
        description: string; 
        date: string; 
        capacity: number;
        category: string;
      } 
    }, { prisma }: Context) => {
      const eventDate = new Date(input.date);
      if (eventDate < new Date()) {
        throw new ValidationError('Event date must be in the future');
      }
      
      if (input.capacity < 1) {
        throw new ValidationError('Event capacity must be at least 1');
      }

      return prisma.event.create({
        data: {
          ...input,
          date: eventDate,
        },
      });
    },
    createRegistration: async (_: any, { input }: { input: { userId: string; eventId: string } }, { prisma }: Context) => {
      return await prisma.$transaction(async (tx) => {
        const event = await tx.event.findUnique({
          where: { id: input.eventId },
          include: { registrations: true },
        });

        if (!event) {
          throw new NotFoundError('Event not found');
        }

        const confirmedRegistrations = event.registrations.filter(
          r => r.status === RegistrationStatus.CONFIRMED
        );

        const status = confirmedRegistrations.length < event.capacity ? 
          RegistrationStatus.CONFIRMED : 
          RegistrationStatus.WAITLIST;

        try {
          return await tx.registration.create({
            data: {
              userId: input.userId,
              eventId: input.eventId,
              status,
            },
          });
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new ValidationError('User already registered for this event');
          }
          throw error;
        }
      });
    },

    cancelRegistration: async (_: any, { id }: { id: string }, { prisma }: Context) => {
      return await prisma.$transaction(async (tx) => {
        const registration = await tx.registration.findUnique({
          where: { id },
          include: { event: true },
        });

        if (!registration) {
          throw new NotFoundError('Registration not found');
        }

        const updatedRegistration = await tx.registration.update({
          where: { id },
          data: { status: RegistrationStatus.CANCELLED },
        });

        if (registration.status === RegistrationStatus.CONFIRMED) {
          const waitlistedRegistration = await tx.registration.findFirst({
            where: {
              eventId: registration.eventId,
              status: RegistrationStatus.WAITLIST,
            },
            orderBy: { registrationDate: 'asc' },
          });

          if (waitlistedRegistration) {
            await tx.registration.update({
              where: { id: waitlistedRegistration.id },
              data: { status: RegistrationStatus.CONFIRMED },
            });
          }
        }

        return updatedRegistration;
      });
    },
  },
  User: {
    registrations: (parent: any, _: any, { prisma }: Context) => {
      return prisma.registration.findMany({
        where: { userId: parent.id },
      });
    },
  },
  Event: {
    registrations: (parent: any, _: any, { prisma }: Context) => {
      return prisma.registration.findMany({
        where: { eventId: parent.id },
      });
    },
    availableSpots: async (parent: any, _: any, { prisma }: Context) => {
      const confirmedCount = await prisma.registration.count({
        where: {
          eventId: parent.id,
          status: 'CONFIRMED',
        },
      });
      return parent.capacity - confirmedCount;
    },
  },
  Registration: {
    user: (parent: any, _: any, { prisma }: Context) => {
      return prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
    event: (parent: any, _: any, { prisma }: Context) => {
      return prisma.event.findUnique({
        where: { id: parent.eventId },
      });
    },
  },
};