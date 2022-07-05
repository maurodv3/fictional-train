import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import ReciboService from '@services/ReciboService';
import UserService from '@services/UserService';
import withSession from '@middlewares/session';

const handler = nc<NextApiRequest, NextApiResponse>({

  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },

}).patch(withSession(async (request: NextApiRequest, response: NextApiResponse) => {

  // @ts-ignore
  const id = Number.parseInt(request.query.id, 10);
  const user = await UserService.getExpandedUser(request);
  const confirmed = await ReciboService.confirmLiquidacion(id, user);
  return response
    .status(200)
    .json(confirmed);

})).delete(async (request: NextApiRequest, response: NextApiResponse) => {

  // @ts-ignore
  const id = Number.parseInt(request.query.id, 10);
  const deleted = await ReciboService.deleteLiquidacion(id);
  return response
    .status(200)
    .json({});

});

export default handler;
