import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../lib/password-security';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // const password = '123456';
  // const hash = await hashPassword(password);
  // const created = await prisma.users.create({
  //   data: {
  //     username: 'New2',
  //     password_hash: hash,
  //     role: 'admin',
  //   },
  // });
  // res.statusCode = 200;
  // res.json(created);
};
