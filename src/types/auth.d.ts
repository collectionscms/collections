import '@auth/express';

declare module '@auth/express' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      apiKey: string | null;
      isAdmin: boolean;
      projects: [
        {
          id: string;
        },
      ];
      roles: [
        {
          id: string;
          permissions: [
            {
              id: string;
            },
          ];
        },
      ];
    };
  }
}
