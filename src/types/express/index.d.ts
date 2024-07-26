declare namespace Express {
  export interface Request {
    token: string | null;
  }

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
      isAdmin: boolean;
      permissions: {
        action: string;
      }[];
    };
  }
}
