import withSession from '@middlewares/session';
import { NextApiRequest, NextApiResponse } from 'next';
import AccountService from '@services/AccountService';

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

  await AccountService.updateAccountStatus(Number(id), payload.status);

  const accounts = await AccountService.getAccounts(undefined, { name: 'asc' });
  return response
    .status(200)
    .json({
      accounts,
      grouped: AccountService.groupAccounts(accounts)
    });

});
