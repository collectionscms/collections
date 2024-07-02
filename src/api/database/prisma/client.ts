import { Prisma, PrismaClient } from '@prisma/client';

const bypassRLS = () => {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      query: {
        $allModels: {
          async $allOperations({ args, query }) {
            const [, result] = await prisma.$transaction([
              prisma.$executeRaw`SELECT set_config('app.bypass_rls', 'on', TRUE)`,
              query(args),
            ]);
            return result;
          },
        },
      },
    })
  );
};

const forProject = (projectId: string) => {
  return Prisma.defineExtension((prisma) =>
    prisma.$extends({
      query: {
        $allModels: {
          async $allOperations({ args, query }) {
            const [, result] = await prisma.$transaction([
              prisma.$executeRaw`SELECT set_config('app.current_project_id', ${projectId}, TRUE)`,
              query(args),
            ]);
            return result;
          },
        },
      },
    })
  );
};

// Access to tables with row-level security
export const projectPrisma = (projectId: string) =>
  new PrismaClient().$extends(forProject(projectId));
export type ProjectPrismaClient = ReturnType<typeof projectPrisma>;
export type ProjectTransactionClient = Parameters<
  Parameters<ProjectPrismaClient['$transaction']>[0]
>[0];
export type ProjectPrismaType = ProjectPrismaClient | ProjectTransactionClient;

// Access bypassing row-level security
export const bypassPrisma = new PrismaClient().$extends(bypassRLS());
export type BypassPrismaClient = typeof bypassPrisma;
export type BypassTransactionClient = Parameters<
  Parameters<BypassPrismaClient['$transaction']>[0]
>[0];
export type BypassPrismaType = BypassPrismaClient | BypassTransactionClient;
