// /////////////////////////////////////
// Authentication
// /////////////////////////////////////

import { PrimaryKey } from '../database/schemas.js';

export type AuthUser = {
  id: PrimaryKey;
  roleId: PrimaryKey;
  name: string;
  adminAccess: boolean;
  appAccess: boolean; // access from applications.
};
