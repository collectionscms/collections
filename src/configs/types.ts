export type AuthUser = {
  id: string;
  roleId: string;
  name: string;
  adminAccess: boolean;
  appAccess: boolean; // access from applications.
};

export type Me = {
  user: AuthUser | null;
  email: string;
  apiKey: string | null;
  token: string;
};

export type ApiError = {
  status: number;
  code: string;
  extensions?: {
    message?: string;
  };
};
