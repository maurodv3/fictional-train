import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import JobService from '@services/JobService';
import { JobAdd } from './index';

const handler = nc<NextApiRequest, NextApiResponse>({

  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },

}).get(async (request: NextApiRequest, response: NextApiResponse) => {

}).put(async (request: NextApiRequest, response: NextApiResponse) => {

  // @ts-ignore
  const jobId = Number.parseInt(request.query.id, 10);
  const job: JobAdd = request.body;
  const created = JobService.updateJob(jobId, job);
  return response
    .status(200)
    .json(created);

});

export default handler;
