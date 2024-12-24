import {
  ApiKey,
  Content,
  ContentRevision,
  File,
  Permission,
  Project,
  Review,
  Role,
  Tag,
} from '@prisma/client';

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  isRegistered: boolean;
  role: Role;
  updatedAt: Date;
};

export type ProjectRole = {
  project: Project;
  role: Role;
  permissions: Permission[];
};

export type Me = {
  id: string;
  email: string;
  provider: string;
  providerId: string;
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
  isReviewing: boolean;
  isPublished: boolean;
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

export type RevisedContent = {
  id: string;
  postId: string;
  slug: string;
  status: StatusHistory;
  updatedAt: Date;
  version: number;
  title: string;
  subtitle: string | null;
  body: string;
  bodyJson: string;
  bodyHtml: string;
  metaTitle: string | null;
  metaDescription: string | null;
  coverUrl: string | null;
  language: string;
  languageContents: { contentId: string; language: string }[];
  canTranslate: boolean;
  sourceLanguageCode: string | null;
  targetLanguageCode: string | null;
  revisions: ContentRevision[];
  tags: Tag[];
};

export type PublishedListContent = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  body: string;
  bodyHtml: string;
  status: string;
  language: string;
  version: number;
  coverUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: Date;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
};

export type PublishedContent = {
  tags: {
    id: string;
    name: string;
  }[];
} & PublishedListContent;

export type PublishedPost = {
  id: string;
  contents: PublishedContent[];
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
