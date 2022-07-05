import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import ConceptService from '@services/ConceptService';

const handler = nc<NextApiRequest, NextApiResponse>({

  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },

}).get(async (request: NextApiRequest, response: NextApiResponse) => {
  // @ts-ignore
  const id = Number.parseInt(request.query.id, 10);
  const found = await ConceptService.getConcept(id);
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
  const updated = await ConceptService.updateConcept(id, request.body);
  return response
    .status(200)
    .json(updated);

});

export default handler;
