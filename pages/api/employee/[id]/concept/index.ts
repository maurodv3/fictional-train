import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import ConceptService from '@services/ConceptService';

const handler = nc<NextApiRequest, NextApiResponse>({

  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },

}).get(async (request: NextApiRequest, response: NextApiResponse) => {

}).post(async (request: NextApiRequest, response: NextApiResponse) => {

  // @ts-ignore
  const id = Number.parseInt(request.query.id, 10);
  const created = await ConceptService.addPersonalConcept(id, request.body);
  return response
    .status(201)
    .json(created);

});

export default handler;
