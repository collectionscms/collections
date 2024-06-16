import { Content, ContentHistory, File, Permission, Project, Role } from '@prisma/client';

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  isRegistered: boolean;
  role: Role;
};

export type ProjectRole = {
  project: Project;
  role: Role;
  permissions: Permission[];
};

export type Me = {
  id: string;
  email: string;
};

export type ApiError = {
  status: number;
  code: string;
  extensions?: {
    message?: string;
  };
};

export type LocalizedPost = {
  id: string;
  slug: string;
  status: string;
  updatedAt: Date;
  publishedAt?: Date | null;
  contentLocale: string;
  title: string;
  body: string;
  bodyJson: string;
  bodyHtml: string;
  locales: string[];
  authorName: string;
  contents: (Content & { file: UploadFile | null })[];
  histories: ContentHistory[];
};

export type UploadFile = {
  url: string;
} & File;
