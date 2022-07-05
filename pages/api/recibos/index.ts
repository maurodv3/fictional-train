import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import ReciboService from '@services/ReciboService';

const handler = nc<NextApiRequest, NextApiResponse>({

  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },

}).get(async (request: NextApiRequest, response: NextApiResponse) => {



}).post(async (request: NextApiRequest, response: NextApiResponse) => {


});

export default handler;
