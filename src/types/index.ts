import { Permission, Project, Role } from '@prisma/client';

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  role: Role;
};

export type Me = {
  id: string;
  email: string;
  name: string;
  apiKey: string | null;
  isAdmin: boolean;
  projects: Project[];
  roles: (Role & { permissions: Permission[] })[];
};

export type ApiError = {
  status: number;
  code: string;
  extensions?: {
    message?: string;
  };
};
