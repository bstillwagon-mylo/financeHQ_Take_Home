import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    registrations: [Registration!]!
  }

  type Event {
    id: ID!
    title: String!
    description: String!
    date: String!
    capacity: Int!
    category: String!
    registrations: [Registration!]!
    availableSpots: Int!
  }

  type Registration {
    id: ID!
    user: User!
    event: Event!
    registrationDate: String!
    status: RegistrationStatus!
  }

  enum RegistrationStatus {
    CONFIRMED
    WAITLIST
    CANCELLED
  }

  type EventConnection {
    edges: [EventEdge!]!
    pageInfo: PageInfo!
  }

  type EventEdge {
    cursor: String!
    node: Event!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  input PaginationInput {
    first: Int!
    after: String
  }

  input EventFilterInput {
    category: String
    dateFrom: String
    dateTo: String
    searchTerm: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    events(
      pagination: PaginationInput!
      filter: EventFilterInput
    ): EventConnection!
    event(id: ID!): Event
    registrations: [Registration!]!
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  input CreateEventInput {
    title: String!
    description: String!
    date: String!
    capacity: Int!
    category: String!
  }

  input CreateRegistrationInput {
    userId: ID!
    eventId: ID!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    createEvent(input: CreateEventInput!): Event!
    createRegistration(input: CreateRegistrationInput!): Registration!
    cancelRegistration(id: ID!): Registration!
  }
`;
