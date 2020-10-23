import withSession from '../../../lib/session';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccounts, groupAccounts, updateAccountStatus } from '../../../handlers/account/accountService';

export default withSession(async (request: NextApiRequest, response: NextApiResponse) => {

  if (!request) {
    response.status(400).json({ msg: 'Invalid request.' });
    return;
  }

  const {
    query : { id }
  } = request;

  const payload : {
    status: boolean
  } = request.body;

  await updateAccountStatus(Number(id), payload.status);

  const accounts = await getAccounts(undefined, { name: 'asc' });
  return response
    .status(200)
    .json({
      accounts,
      grouped: groupAccounts(accounts)
    });

});
