import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const allUsers = await prisma.users.findMany();
  res.statusCode = 200;
  res.json(allUsers);
};
