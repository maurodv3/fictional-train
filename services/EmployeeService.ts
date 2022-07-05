import DatabaseConnection from '@database/DatabaseConnection';
import {PrismaClient} from '@prisma/client';
import {parse} from 'date-fns';

export interface AddEmployee {
  id: number;
  name: string;
  lastname: string;
  identifier: string;
  birth: string;
  address: string;
  personal_email: string;
  job_category_id: string;
  work_email: string;
  hire_date: string;
  bank_name: string;
  bank_account_type: string;
  bank_number: string;
  familiars: AddFamiliar[];
}

export interface AddFamiliar {
  id: number;
  relationship: string;
  name: string;
  lastname: string;
  identifier: string;
  birth: string;
  annual_salary?: string;
  handicap: string;
}

const EmployeeService = (database: PrismaClient) => {

  const getEmployees = async () =>  {
    return await database.employee.findMany({
      include: {
        job_category: {
          include: {
            job: {
              include: {
                department: true
              }
            }
          }
        }
      },
      orderBy: {
        employee_id: 'desc'
      }
    });
  };

  const getEmployee = async (employeeId: number) => {
    return await database.employee.findUnique({
      where: {
        employee_id: employeeId
      },
      include: {
        bank_accounts: true,
        employee_familiar: true,
        job_category: {
          include: {
            job: {
              include: {
                department: true
              }
            }
          }
        }
      }
    });
  };

  function toFamiliar(employee: AddEmployee) {
    return employee.familiars.map(familiar =>
      ({
        familiar_id: familiar.id,
        identifier: familiar.identifier,
        name: familiar.name,
        lastname: familiar.lastname,
        relationship: familiar.relationship,
        birth_date: parse(familiar.birth, 'dd/MM/yyyy', new Date()),
        annual_salary: familiar.annual_salary ? Number.parseFloat(familiar.annual_salary) : 0,
        handicap: Boolean(familiar.handicap)
      })
    );
  }

  const addEmployee = async (employee: AddEmployee) => {
    return await database.employee.create({
      data: {
        name: employee.name,
        lastname: employee.lastname,
        identifier: employee.identifier,
        email_work: employee.work_email,
        email_personal: employee.personal_email,
        address: employee.address,
        start_date: parse(employee.hire_date, 'dd/MM/yyyy', new Date()),
        job_category: {
          connect: {
            job_category_id: Number.parseInt(employee.job_category_id, 10),
          }
        },
        employee_familiar: {
          create: toFamiliar(employee)
        },
        bank_accounts: {
          create: {
            bank_name: employee.bank_name,
            bank_account_type: Number.parseInt(employee.bank_account_type, 10),
            bank_number: employee.bank_number
          }
        }
      },
    }).catch(console.log);
  };

  const updateEmployee = async (employeeId : number, employee: AddEmployee) => {
    try {
      const found = await getEmployee(employeeId);
      if (!found) {
        throw new Error('Employee not found.');
      }
      return await database.employee.update({
        data: {
          name: employee.name,
          lastname: employee.lastname,
          identifier: employee.identifier,
          email_work: employee.work_email,
          email_personal: employee.personal_email,
          address: employee.address,
          start_date: new Date(),
          job_category: {
            connect: {
              job_category_id: Number.parseInt(employee.job_category_id, 10),
            }
          },
          bank_accounts: {
            updateMany: {
              where: {
                employee_id: employeeId
              },
              data: {
                bank_name: employee.bank_name,
                bank_account_type: Number.parseInt(employee.bank_account_type, 10),
                bank_number: employee.bank_number
              }
            }
          }
        },
        where: {
          employee_id: employeeId
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const addFamiliar = async (employeeId: number, familiar: AddFamiliar) => {
    try {
      const found = await getEmployee(employeeId);
      if (!found) {
        throw new Error('Employee not found.');
      }
      return await database.employee_familiar.create({
        data: {
          identifier: familiar.identifier,
          name: familiar.name,
          lastname: familiar.lastname,
          relationship: familiar.relationship,
          birth_date: parse(familiar.birth, 'dd/MM/yyyy', new Date()),
          annual_salary: familiar.annual_salary ? Number.parseFloat(familiar.annual_salary) : 0,
          handicap: Boolean(familiar.handicap),
          employee: {
            connect: {
              employee_id: employeeId
            }
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const removeFamiliar = async (familiarId: number) => {
    return await database.employee_familiar.delete({
      where: {
        familiar_id: familiarId
      }
    });
  };

  return {
    getEmployees,
    getEmployee,
    addEmployee,
    updateEmployee,
    addFamiliar,
    removeFamiliar
  };

};

export default EmployeeService(DatabaseConnection.getConnection());
