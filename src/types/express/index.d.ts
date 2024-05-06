declare namespace Express {
  export interface Response {
    tenantProjectId?: string;
    user: {
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
