import { NextApiRequest, NextApiResponse } from 'next';
import DepartmentService from '@services/DepartmentService';

export default async function (request: NextApiRequest, response: NextApiResponse) {

  const newDepartment = await DepartmentService.addDepartment({
    name: 'Departamento Nuevo'
  });

  return response
    .status(200)
    .json(newDepartment);
}
