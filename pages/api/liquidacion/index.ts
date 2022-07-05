import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import ReciboService from '@services/ReciboService';

const handler = nc<NextApiRequest, NextApiResponse>({

  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },

}).post(async (request: NextApiRequest, response: NextApiResponse) => {
  const found = await ReciboService.buildRecibos();
  return response
    .status(201)
    .json(found);
});

export default handler;
