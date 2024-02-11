import { Prisma, PrismaClient } from '@prisma/client';

export type PrismaType = PrismaClient | Prisma.TransactionClient;
export const prisma = new PrismaClient({});
