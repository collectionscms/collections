// /////////////////////////////////////
// Authentication
// /////////////////////////////////////

export type AuthUser = {
  id: string;
  roleId: string;
  name: string;
  adminAccess: boolean;
  appAccess: boolean; // access from applications.
};
