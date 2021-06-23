import DatabaseConnection from '@database/DatabaseConnection';
import { PrismaClient } from '@prisma/client';

class PayrollService {

  constructor(private database: PrismaClient) {
  }

}

export default new PayrollService(DatabaseConnection.getConnection());
