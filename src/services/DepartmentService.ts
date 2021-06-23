import prisma from '../../prisma/prisma';
import { department } from '@prisma/client';

class DepartmentService {

  async addDepartment(d: department): Promise<department> {
    return await prisma.department.create({
      data: d
    });
  }

  async getDepartment(departmentId: number): Promise<department> {
    return await prisma.department.findUnique({
      where: {
        department_id: departmentId
      }
    });
  }

  async getDepartments() : Promise<department[]> {
    return await prisma.department.findMany();
  }

}

export default new DepartmentService();
