import { PrismaClient, users, financial_period, accounts, account_types } from '@prisma/client';
import DatabaseConnection from '@database/DatabaseConnection';
import { getOperationType, result } from '../utils/economy';
import AccountService from '@services/AccountService';

export interface AddEntry {
  description: string;
  entries: AddEntry[];
}

export interface AddEntry {
  account_id: number;
  debit?: number;
  assets?: number;
}

const EntryService = (database: PrismaClient) => {

  const accountBalanceAllowed = (entries, accounts) => {
    const errors = [];
    const accountsIdsMap = new Map(accounts.map(account => ([account.account_id, account])));
    for (const entry of entries) {
      const account = accountsIdsMap.get(entry.account_id);
      const r = result(account.account_types.name, entry.assets, entry.debit)(account.account_balance);
      if (r < 0) {
        errors.push({
          msg: 'entry.error.account',
          account_name: account.name,
          account_id: account.account_id
        });
      }
    }
    return {
      errors: errors.length !== 0,
      msg: errors
    };
  };

  const addEntry = async (entry: AddEntry, user: users, currentPeriod: financial_period) => {

    const { description, entries } = entry;
    const accounts = await AccountService.getAccountsByIDs(entries.map(entry => entry.account_id));
    const accountsIdsMap = new Map(accounts.map(account => ([account.account_id, account])));
    const operationType = getOperationType(accounts);

    const attempEntry = accountBalanceAllowed(entries, accounts);
    if (attempEntry.errors) {
      console.log(attempEntry.msg);
      return attempEntry;
    }

    const lines = entries.map((entry, index) => {
      return {
        position: index,
        assets: entry.assets ? entry.assets : null,
        debit: entry.debit ? entry.debit : null,
        accounts: {
          connect: {
            account_id: entry.account_id,
          }
        }
      };
    });

    const create = await database.entry_seats.create({
      data: {
        description,
        creation_date: new Date(),
        operation_type: operationType,
        entry_seat_lines: {
          create: [...lines]
        },
        financial_period: {
          connect: {
            financial_period_id: currentPeriod.financial_period_id
          }
        }
      }
    });

    const updates = entries.map((entry) => {
      const account = accountsIdsMap.get(entry.account_id);
      const balance = result(account.account_types.name, entry.assets, entry.debit)(account.account_balance);
      return database.accounts.update({
        where: {
          account_id: entry.account_id
        },
        data: {
          account_balance: balance
        }
      });
    });

    await database.$transaction(updates);

    return {
      msg: 'entry.success',
      errors: false,
    };

  };

  return {
    addEntry,
    accountBalanceAllowed
  };

};

export default EntryService(DatabaseConnection.getConnection());
