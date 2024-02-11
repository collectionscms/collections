import { Prisma, PrismaClient } from '@prisma/client';

export type prismaType = PrismaClient | Prisma.TransactionClient;
export const prisma = new PrismaClient({});
