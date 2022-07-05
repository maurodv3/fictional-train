import { NextApiRequest, NextApiResponse } from 'next';
import EmployeeService, { AddEmployee } from '@services/EmployeeService';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>({

  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },

}).get(async (request: NextApiRequest, response: NextApiResponse) => {

  // @ts-ignore
  const id = Number.parseInt(request.query.id, 10);
  const found = await EmployeeService.getEmployee(id);
  if (found) {
    return response
      .status(200)
      .json(found);
  }
  return response
    .status(404)
    .json({ msg: 'Not Found.' });

}).put(async (request: NextApiRequest, response: NextApiResponse) => {

  // @ts-ignore
  const id = Number.parseInt(request.query.id, 10);
  const employee: AddEmployee =  request.body;
  const created = await EmployeeService.updateEmployee(id, employee);
  return response
    .status(200)
    .json(created);

});

export default handler;
