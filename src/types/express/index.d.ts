declare namespace Express {
  export interface Response {
    user: {
      id: string;
      email: string;
    };
    tenantProjectId?: string;
    projects?: {
      [key: string]: {
        id: string;
        subdomain: string;
        enabled: boolean;
        role: {
          id: string;
          projectId: string;
          isAdmin: boolean;
          permissions: {
            id: string;
            name: string;
          }[];
        };
      };
    };
  }
}
