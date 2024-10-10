export interface User {
    id?: string;
    name: string;
    email: string;
    password: string
  }
  
  export interface Event {
    id: string;
    title: String;
    description: string;
    date: string;
    capacity: number;
    category: string;
  }
  
  export interface Registration {
    id: string;
    userId: string;
    eventId: string;
    registrationDate: string;
    status: 'CONFIRMED' | 'WAITLIST' | 'CANCELLED';
  }
  
  export interface PaginationInput {
    first: number;
    after?: string;
  }
  
  export interface EventFilterInput {
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    searchTerm?: string;
  }
  
  export class ValidationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'ValidationError';
    }
  }
  
  export class NotFoundError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'NotFoundError';
    }
  }