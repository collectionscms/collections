declare namespace Express {
  export interface Response {
    tenantProjectId?: string;
    user: {
      id: string;
      email: string;
      name: string;
      projects: {
        [key: string]: {
          id: string;
          subdomain: string;
          description: string | null;
          iconUrl: string | null;
          enabled: boolean;
          role: {
            id: string;
            projectId: string;
            name: string;
            description: string | null;
            isAdmin: boolean;
            createdAt: Date;
            updatedAt: Date;
            permissions: {
              id: string;
              roleId: string;
              name: string;
              description: string | null;
              createdAt: Date;
              updatedAt: Date;
            }[];
          };
        };
      };
    };
  }
}
