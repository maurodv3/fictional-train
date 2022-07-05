import { NextApiRequest, NextApiResponse } from 'next';
import EmployeeService, { AddEmployee } from '@services/EmployeeService';
import nc from 'next-connect';

const handler = nc<NextApiRequest, NextApiResponse>({
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
}).get(async (request: NextApiRequest, response: NextApiResponse) => {
  return response
    .status(200)
    .json(await EmployeeService.getEmployees());
}).post(async (request: NextApiRequest, response: NextApiResponse) => {
  const employee: AddEmployee =  request.body;
  const created = await EmployeeService.addEmployee(employee);
  return response
    .status(201)
    .json(created);
});

export default handler;
