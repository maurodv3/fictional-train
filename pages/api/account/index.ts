import withSession from '@middlewares/session';
import { NextApiRequest, NextApiResponse } from 'next';
import AccountService from '@services/AccountService';

const POST = async (request: NextApiRequest, response: NextApiResponse) => {

  const payload : {
    accountName: string;
    accountType: string;
    selectedAccount: {
      account_id: number;
      account_type_id: number;
    }
    abstractAccount: boolean;
  } = request.body;

  if (payload.selectedAccount) {
    await AccountService.createAccount({
      name: payload.accountName,
      abstract_account: payload.abstractAccount,
      parent_account_id: payload.selectedAccount.account_id,
      account_balance: 0,
      enabled: true,
      account_type_id: payload.selectedAccount.account_type_id,
      account_id: 0,
      account_types: undefined,
    });

    const accounts = await AccountService.getAccounts(undefined, { account_id: 'asc' });
    return response
      .status(201)
      .json({
        accounts,
        grouped: AccountService.groupAccounts(accounts)
      });

  }

  return response.status(400).json({ msg: 'Not allowed yet' });

};

const GET = async (request: NextApiRequest, response: NextApiResponse) => {
  return response
    .status(200)
    .json(await AccountService.getAccounts(undefined, { name: 'asc' }));
};

const method = {
  POST,
  GET,
};

export default withSession(async (request: NextApiRequest, response: NextApiResponse) => {

  if (!request) {
    response.status(400).json({ msg: 'Invalid request.' });
    return;
  }
  
  const handler = method[request.method];
  
  if (handler) {
    return handler(request, response);
  }

  return response.status(405).json({ msg: 'Not Allowed.' });

});
