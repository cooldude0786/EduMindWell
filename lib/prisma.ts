import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const rawConnectionString = process.env.NEON_POSTGRES_URL ?? process.env.DATABASE_URL;

function normalizePostgresSslMode(value: string | undefined) {
  if (!value) return value;

  if (/[?&]sslmode=/i.test(value)) {
    return value.replace(
      /([?&]sslmode=)(prefer|require|verify-ca)/i,
      '$1verify-full',
    );
  }

  return `${value}${value.includes('?') ? '&' : '?'}sslmode=verify-full`;
}

const connectionString = normalizePostgresSslMode(rawConnectionString);
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
