import DatabaseConnection from '@database/DatabaseConnection';
import { PrismaClient, department } from '@prisma/client';

export interface DepartmentInput {
  name: string;
}

export class DepartmentService {

  constructor(private database: PrismaClient) {}

  async addDepartment(d: DepartmentInput): Promise<department> {
    return await this.database.department.create({
      data: d
    });
  }

  async getDepartment(departmentId: number): Promise<department> {
    return await this.database.department.findUnique({
      where: {
        department_id: departmentId
      }
    });
  }

  async getDepartments() : Promise<department[]> {
    return await this.database.department.findMany();
  }

}

export default new DepartmentService(DatabaseConnection.getConnection());
