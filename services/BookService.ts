import { subMonths } from 'date-fns';
import { accountSummary } from '../utils/economy';
import DatabaseConnection from '@database/DatabaseConnection';
import { PrismaClient, department } from '@prisma/client';

export class BookService {

  constructor(private database: PrismaClient) {}

  async getDailyBook(from : Date = subMonths(new Date(), 1), to: Date = new Date()) {
    return await this.database.entry_seats.findMany({
      where: {
        AND: [
          {
            creation_date: {
              gte: from
            }
          },
          {
            creation_date: {
              lte: to
            }
          }
        ]
      },
      include: {
        entry_seat_lines: true
      }
    });

  }

  async getMasterBook(from : Date = subMonths(new Date(), 1), to: Date = new Date()) {
    const withMovement = await this.database.accounts.findMany({
      where: {
        entry_seat_lines: {
          some: {
            entry_seats: {
              AND: [
                {
                  creation_date: {
                    gte: from
                  }
                },
                {
                  creation_date: {
                    lte: to
                  }
                }
              ]
            }
          }

        }
      },
      include: {
        entry_seat_lines: {
          include: {
            entry_seats: true
          }
        },
        account_types: true
      }
    });
    const withoutMovement = await this.database.accounts.findMany({
      where: {
        entry_seat_lines: {
          none: {
            entry_seats: {
              AND: [
                {
                  creation_date: {
                    gte: from
                  }
                },
                {
                  creation_date: {
                    lte: to
                  }
                }
              ]
            }
          }
        }
      },
      include: {
        entry_seat_lines: true
      }
    });

    return {
      withoutMovement,
      withMovement: withMovement.map((account) => {
        account.entry_seat_lines.forEach(line => delete line.entry_seats.creation_date);
        return account;
      }),
      summary: withMovement.map((account) => {
        return {
          account,
          summary: accountSummary(account)
        };
      }).sort((a, b) => a.account.account_type_id > b.account.account_type_id ? 1 : -1)
    };
  }

}

export default new BookService(DatabaseConnection.getConnection());
