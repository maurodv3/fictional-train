import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import EmployeeService from '@services/EmployeeService';

const handler = nc<NextApiRequest, NextApiResponse>({

  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },

}).delete(async (request: NextApiRequest, response: NextApiResponse) => {

  // @ts-ignore
  const famId = Number.parseInt(request.query.famid, 10);
  const deleted = await EmployeeService.removeFamiliar(famId);
  return response
    .status(200)
    .json({ msg: 'deleted' });

});

export default handler;
