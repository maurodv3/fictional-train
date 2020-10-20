import withSession from '../../../lib/session';
import { createAccount } from '../../../handlers/account/accountService';

export default withSession(async (request, response) => {
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
    await createAccount({
      name: payload.accountName,
      abstract_account: payload.abstractAccount,
      parent_account_id: payload.selectedAccount.account_id,
      account_balance: 0,
      enabled: true,
      account_type_id: payload.selectedAccount.account_type_id,
      account_id: 0,
      account_types: undefined,
    });
    response.json({});
  } else {
    response.json({});
  }
});
