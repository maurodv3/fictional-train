import DatabaseConnection from '@database/DatabaseConnection';
import { PrismaClient, department } from '@prisma/client';

export interface DepartmentInput {
  name: string;
}

const DepartmentService = (database: PrismaClient) => {

  const addDepartment = async (d: DepartmentInput): Promise<department> => {
    return await database.department.create({
      data: d
    });
  };

  const getDepartment = async (departmentId: number): Promise<department> => {
    return await database.department.findUnique({
      where: {
        department_id: departmentId
      }
    });
  };

  const getDepartments = async () : Promise<department[]> => {
    return await database.department.findMany();
  };

  const getDepartmentsWithJobs = async () : Promise<any> => {
    return await database.department.findMany({
      include: {
        job: {
          include: {
            job_category: true
          }
        }
      }
    });
  };

  return {
    addDepartment,
    getDepartment,
    getDepartments,
    getDepartmentsWithJobs
  };

};

export default DepartmentService(DatabaseConnection.getConnection());
