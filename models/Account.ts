import AccountType from '@model/AccountType';

export default interface Account {
  account_id: number;
  name: string;
  abstract_account: boolean;
  account_type_id: number;
  account_balance: number;
  parent_account_id: number;
  enabled: boolean;
  account_types: AccountType;
}
