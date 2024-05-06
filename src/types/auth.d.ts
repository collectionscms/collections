import '@auth/express';

declare module '@auth/express' {
  interface Session {
    user?: {
      id: string;
      email: string;
      name: string;
      isAdmin: boolean;
      projects: {
        id: string;
        subdomain: string;
        description: string | null;
        subdomain: string;
        iconUrl: string | null;
        enabled: boolean;
      }[];
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
