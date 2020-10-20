import withSession from '../../lib/session';
import prisma from '../../prisma/prisma';
import { getOperationType, result } from '../../handlers/util/economy';

export default withSession(async (request, response) => {

  const { description, entries } : {
    description: string;
    entries : {
      account_id: number;
      assets: number;
      debit: number;
    }[]
  } = request.body;

  const accounts = await prisma.accounts.findMany({
    where: {
      account_id: {
        in: entries.map(entry => entry.account_id)
      }
    },
    include: {
      account_types: true
    }
  });

  const accountsIdsMap = new Map(accounts.map(account => ([account.account_id, account])));
  const operationType = getOperationType(accounts);

  const errors = [];
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

  if (errors.length !== 0) {
    response.status(400).json({
      msg: [...errors]
    });
    return;
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

  const create = await prisma.entry_seats.create({
    data: {
      description,
      creation_date: new Date(),
      operation_type: operationType,
      entry_seat_lines: {
        create: [...lines]
      },
    }
  });

  const updates = entries.map((entry) => {
    const account = accountsIdsMap.get(entry.account_id);
    const balance = result(account.account_types.name, entry.assets, entry.debit)(account.account_balance);
    return prisma.accounts.update({
      where: {
        account_id: entry.account_id
      },
      data: {
        account_balance: balance
      }
    });
  });

  await prisma.$transaction(updates);

  response.json({ msg: 'entry.success' });

});
