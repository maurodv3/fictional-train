import prisma  from '../../../prisma/prisma';
import withSession from '../../../lib/session';

export default withSession(async (request, response) => {
  console.log('patch');
  debugger;
  response.json({});
});
