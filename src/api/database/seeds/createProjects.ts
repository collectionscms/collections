import { Project } from '@prisma/client';
import { BypassPrismaType } from '../prisma/client.js';

export const createProjects = async (
  prisma: BypassPrismaType,
  projects: Omit<Project, 'createdAt' | 'updatedAt'>[]
): Promise<void> => {
  await prisma.project.createMany({
    data: projects,
  });
};
