import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import EmployeeService, { AddFamiliar } from '@services/EmployeeService';

const handler = nc<NextApiRequest, NextApiResponse>({

  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },

}).post(async (request: NextApiRequest, response: NextApiResponse) => {

  // @ts-ignore
  const employeeId = Number.parseInt(request.query.id, 10);
  const familiar : AddFamiliar = request.body;
  const created = await EmployeeService.addFamiliar(employeeId, familiar);
  return response
    .status(200)
    .json(created);

});

export default handler;
