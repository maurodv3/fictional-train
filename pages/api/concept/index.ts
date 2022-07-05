import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import ConceptService from '@services/ConceptService';

const handler = nc<NextApiRequest, NextApiResponse>({

  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },

}).get(async (request: NextApiRequest, response: NextApiResponse) => {

  const found = await ConceptService.getConcepts();
  return response
    .status(200)
    .json(found);

}).post(async (request: NextApiRequest, response: NextApiResponse) => {

  const created = await ConceptService.addConcept(request.body);
  return response
    .status(201)
    .json(created);

});

export default handler;
