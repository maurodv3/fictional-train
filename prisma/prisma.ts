import { PrismaClient } from '@prisma/client';

function build() {
  return new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
}

// add prisma to the NodeJS global type
interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || build();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;
