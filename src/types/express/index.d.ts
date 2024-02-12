declare namespace Express {
  export interface Response {
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
