import { Prisma, PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

function bypassRLS() {
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
}

export const forProject = (projectId: string) => {
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

export const bypassPrisma = () => prisma.$extends(bypassRLS());
export type BypassPrismaClient = ReturnType<typeof bypassPrisma>;

export const projectPrisma = (projectId: string) => prisma.$extends(forProject(projectId));
export type ProjectPrismaClient = ReturnType<typeof projectPrisma>;

// ref: https://github.com/prisma/prisma/issues/20738#issuecomment-1807917019
export type ProjectTransactionClient = Parameters<
  Parameters<ProjectPrismaClient['$transaction']>[0]
>[0];

export type ProjectPrismaType = ProjectPrismaClient | ProjectTransactionClient;

export type PrismaType = PrismaClient | Prisma.TransactionClient;
