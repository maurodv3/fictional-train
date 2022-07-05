import Account from '@model/Account';
import DatabaseConnection from '@database/DatabaseConnection';
import { PrismaClient } from '@prisma/client';

const AccountService = (database: PrismaClient) => {

  const createAccount = async (account: Account) => {
    const created = await database.accounts.create({
      data : {
        name: account.name,
        abstract_account: account.abstract_account,
        enabled: true,
        account_balance: 0,
        account_types: {
          connect: {
            account_type_id: account.account_type_id
          }
        },
        accounts: {
          connect: {
            account_id: account.parent_account_id
          }
        }
      }
    });
    const updateQuery = `UPDATE accounts SET account_id = ${account.parent_account_id}${created.account_id} WHERE account_id = ${created.account_id}`;
    await database.$executeRaw(updateQuery);
  };

  const updateAccountStatus = async (accountId: number, accountStatus: boolean) => {
    await database.accounts.update({
      where: {
        account_id: accountId
      },
      data: {
        enabled: accountStatus
      }
    });
  };

  const getAccounts = async (where?: object, orderBy?: object) : Promise<Account[]> => {
    return await database.accounts.findMany({
      where,
      orderBy,
      include: {
        account_types: true
      }
    });
  };

  const groupAccounts = (accounts: Account[]) => {
    return accounts.reduce((grouped, item) => {
      (grouped[item['account_types'].name] = grouped[item['account_types'].name] || []).push(item);
      return grouped;
    }, {});
  };

  const getGroupedAccounts = async (where?: object, orderBy?: object) => {
    return groupAccounts(await getAccounts(where, orderBy));
  };

  const getAccountsByIDs = async (ids: number[]) => {
    return await database.accounts.findMany({
      where: {
        account_id: {
          in: ids
        }
      },
      include: {
        account_types: true
      }
    });
  };

  const getAccountById = async (id: number) => {
    return await database.accounts.findUnique({
      where: {
        account_id: id
      },
      include: {
        account_types: true
      }
    });
  };

  return {
    createAccount,
    updateAccountStatus,
    getAccounts,
    getGroupedAccounts,
    getAccountsByIDs,
    getAccountById,
    groupAccounts
  };

};

export default AccountService(DatabaseConnection.getConnection());
