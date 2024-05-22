declare namespace Express {
  export interface Response {
    user: {
      id: string;
      email: string;
    };
    projectRole?: {
      id: string;
      subdomain: string;
      enabled: boolean;
      role: {
        isAdmin: boolean;
        permissions: {
          accessAction: string;
        }[];
      };
    };
  }
}
