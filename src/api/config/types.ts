// /////////////////////////////////////
// Authentication
// /////////////////////////////////////

export type AuthUser = {
  id: number;
  role_id: number;
  name: string;
  admin_access: boolean;
  app_access: boolean; // access from applications.
};
