import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import JobService from '@services/JobService';

export interface JobAdd {
  name: string;
  description: string;
  base_salary: string;
  department_id: string;
  concepts: string[];
  categories: CategoryAdd[];
}

export interface CategoryAdd {
  category_id: string;
  name: string;
  percentage_raise: string;
  fixed_raise: string;
}

const handler = nc<NextApiRequest, NextApiResponse>({

  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },

}).get(async (request: NextApiRequest, response: NextApiResponse) => {

}).post(async (request: NextApiRequest, response: NextApiResponse) => {

  const job: JobAdd = request.body;
  const created = JobService.createJob(job);
  return response
    .status(201)
    .json(created);

});

export default handler;
