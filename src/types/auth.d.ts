import '@auth/express';

declare module '@auth/express' {
  interface Session {
    user?: {
      id: string;
      email: string;
    };
  }
}
