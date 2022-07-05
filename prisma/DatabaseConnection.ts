import prisma from '../prisma/prisma';
import { PrismaClient } from '@prisma/client';

const DatabaseConnection = (connection: PrismaClient) => {

  const getConnection = () : PrismaClient => {
    return connection;
  };

  return {
    getConnection
  };

};

export default DatabaseConnection(prisma);
