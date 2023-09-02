// /////////////////////////////////////
// Authentication
// /////////////////////////////////////

export type AuthUser = {
  id: number;
  roleId: number;
  name: string;
  adminAccess: boolean;
  appAccess: boolean | null; // access from applications.
};
