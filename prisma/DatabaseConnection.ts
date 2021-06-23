import prisma from '../prisma/prisma';
import { PrismaClient } from '@prisma/client';

class DatabaseConnection {

  constructor(private connection: PrismaClient) {
  }

  getConnection() : PrismaClient {
    return this.connection;
  }

}

export default new DatabaseConnection(prisma);
