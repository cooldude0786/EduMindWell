import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.NEON_POSTGRES_URL ?? process.env.DATABASE_URL;
const pool = connectionString ? new Pool({ connectionString }) : undefined;
const adapter = pool ? new PrismaPg(pool) : undefined;

const prismaClientSingleton = () =>
  new PrismaClient({
    ...(adapter ? { adapter } : {}),
    // log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrismaExtended = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma =
  globalForPrismaExtended.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrismaExtended.prisma = prisma;
}
