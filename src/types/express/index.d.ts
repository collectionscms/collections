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
      primaryLocale: string;
      role: {
        isAdmin: boolean;
        permissions: {
          action: string;
        }[];
      };
    };
  }
}
