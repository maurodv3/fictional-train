import { PrismaClient, users } from '@prisma/client';
import DatabaseConnection from '@database/DatabaseConnection';
import prisma from '@database/prisma';

const FinancialPeriodService = (database: PrismaClient) => {

  const getCurrentPeriod = async (user: users) => {
    const now = new Date();
    const periods = await prisma.financial_period.findMany({
      where: {
        AND: [
          {
            financial_entity_id: {
              equals: user.financial_entity_id
            }
          },
          {
            period_start_date: {
              lte: now
            }
          },
          {
            period_end_date: {
              gte: now
            }
          }
        ]
      }
    });
    if (periods.length === 0) {
      // Start new period.
      throw new Error('Not supported yet.');
    }
    return periods[0];
  };

  return {
    getCurrentPeriod
  };

};

export default FinancialPeriodService(DatabaseConnection.getConnection());
