import prisma from '../../prisma/prisma';
import Account from './Account';

export async function createAccount(account: Account) {
  const created = await prisma.accounts.create({
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
  await prisma.$executeRaw(`UPDATE accounts SET account_id = ${account.parent_account_id}${created.account_id} WHERE account_id = ${created.account_id}`);
}

export async function updateAccountStatus(accountId: number, accountStatus: boolean) {
  await prisma.accounts.update({
    where: {
      account_id: accountId
    },
    data: {
      enabled: accountStatus
    }
  });
}

export async function getAccounts(where?: object, orderBy?: object) : Promise<Account[]> {
  return await prisma.accounts.findMany({
    where,
    orderBy,
    include: {
      account_types: true
    }
  });
}

export async function getGroupedAccounts(where?: object, orderBy?: object) {
  return groupAccounts(await getAccounts(where, orderBy));
}

export function groupAccounts(accounts: Account[]) {
  return accounts.reduce((grouped, item) => {
    (grouped[item['account_types'].name] = grouped[item['account_types'].name] || []).push(item);
    return grouped;
  }, {});
}
