import Account from '@model/Account';
import DatabaseConnection from '@database/DatabaseConnection';
import { PrismaClient } from '@prisma/client';

export class AccountService {

  constructor(private database: PrismaClient) {}

  async createAccount(account: Account) {
    const created = await this.database.accounts.create({
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
    await this.database.$executeRaw(updateQuery);
  }

  async updateAccountStatus(accountId: number, accountStatus: boolean) {
    await this.database.accounts.update({
      where: {
        account_id: accountId
      },
      data: {
        enabled: accountStatus
      }
    });
  }

  async getAccounts(where?: object, orderBy?: object) : Promise<Account[]> {
    return await this.database.accounts.findMany({
      where,
      orderBy,
      include: {
        account_types: true
      }
    });
  }

  async getGroupedAccounts(where?: object, orderBy?: object) {
    return this.groupAccounts(await this.getAccounts(where, orderBy));
  }

  groupAccounts(accounts: Account[]) {
    return accounts.reduce((grouped, item) => {
      (grouped[item['account_types'].name] = grouped[item['account_types'].name] || []).push(item);
      return grouped;
    }, {});
  }

}

export default new AccountService(DatabaseConnection.getConnection());
