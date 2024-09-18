import {
  ApiKey,
  Content,
  ContentHistory,
  File,
  Permission,
  Project,
  Review,
  Role,
} from '@prisma/client';

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

export type StatusHistory = {
  currentStatus: string;
  prevStatus: string | null;
};

export type LocalizedContentItem = {
  postId: string;
  contentId: string;
  title: string;
  slug: string;
  status: StatusHistory;
  language: string;
  updatedByName: string;
  updatedAt: Date;
};

export type SourceLanguagePostItem = LocalizedContentItem & {
  localizedContents: LocalizedContentItem[];
};

export type LocalizedPost = {
  id: string;
  slug: string;
  contentId: string;
  status: StatusHistory;
  updatedAt: Date;
  version: number;
  title: string;
  body: string;
  bodyJson: string;
  bodyHtml: string;
  coverUrl: string | null;
  language: string;
  usedLanguages: string[];
  canTranslate: boolean;
  sourceLanguageCode: string | null;
  targetLanguageCode: string | null;
  createdByName: string;
  updatedByName: string;
  histories: ContentHistory[];
};

export type PublishedContent = {
  id: string;
  slug: string;
  title: string;
  body: string;
  bodyHtml: string;
  language: string;
  version: number;
  coverUrl: string | null;
  publishedAt: Date;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
};

export type PublishedPost = {
  id: string;
  contents: {
    [language: string]: PublishedContent;
  };
};

export type UploadFile = {
  url: string;
} & File;

export type ApiKeyWithPermissions = {
  permissions: string[];
} & ApiKey;

export type RoleWithPermissions = {
  permissions: string[];
} & Role;

export type ProjectWithRole = Project & {
  isAdmin: boolean;
  permissions: {
    action: string;
  }[];
};

export type ReviewWithContentAndParticipant = Review & {
  content: Content;
  revieweeName: string;
  reviewerName: string | null;
};
