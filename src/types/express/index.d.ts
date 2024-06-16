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
      defaultLocale: string;
      role: {
        isAdmin: boolean;
        permissions: {
          action: string;
        }[];
      };
    };
  }
}
