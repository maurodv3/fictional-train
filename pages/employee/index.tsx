import Navbar from '@components/Navbar';
import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import Link from 'next/link';
import DepartmentService from '@services/DepartmentService';
import EmployeeService from '@services/EmployeeService';
import { useState } from 'react';

const EmployeeRow = ({ employee, added }) => {
  return (
    <tr className={added ? 'bg-green-100' : null}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {employee.name}{' '}{employee.lastname}
            </div>
            <div className="text-sm text-gray-500">
              {employee.email_work}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{employee.job_category.job.name}</div>
        <div className="text-sm text-gray-500">{employee.job_category.job.department.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Activo
                </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link href={`/employee/${employee.employee_id}`}>
          <a className="text-indigo-600 hover:text-indigo-900">Detalles</a>
        </Link>
        <span className="text-indigo-600">{' | '}</span>
        <Link href={`/employee/edit/${employee.employee_id}`}>
          <a className="text-indigo-600 hover:text-indigo-900">Editar</a>
        </Link>
      </td>
    </tr>
  );
};

export default function Index({ tabs, departments, employees, added_employee }) {

  const [displayedEmployees, setDisplayedEmployees] = useState(employees);

  const filterEmployees = (e) => {
    if (e.target.value === '-1') {
      setDisplayedEmployees(employees);
    } else {
      setDisplayedEmployees(employees.filter(employee => employee.job_category.job.department.department_id === Number.parseInt(e.target.value, 10)));
    }
  };

  return (
    <Navbar tabs={tabs}>
      <div className="mb-5 relative border border-gray-100 rounded-md shadow-md bg-white no-print">
        <div className="flex h-24 rounded-sm px-4 py-4">
          <div className="mx-5">
            <p className="text-sm text-gray-700 font-bold mb-2">Departamento</p>
            <select className="px-3 py-2 w-36 std-data-input capitalize text-md text-gray-700" onChange={filterEmployees}>
              <option value={-1}>- Todos</option>
              {departments.map(deps =>
                <option key={deps.department_id} value={deps.department_id}>{deps.name}</option>
              )}
            </select>
          </div>
        </div>
        <div className="absolute top-2 right-4 h-8 w-8 text-center">
          <Link href={'/employee/add'}>
            <button className="border border-gray-300 rounded-full bg-indigo-500 h-10 w-10 p-2 focus:outline-none focus:shadow-outline hover:bg-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="whitesmoke">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col mb-5">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            { displayedEmployees.length !== 0 ?
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empleado
                    </th>
                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Puesto
                    </th>
                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    </th>
                    <th scope="col" className="px-6 py-3 bg-gray-50">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  { displayedEmployees.map(employee =>
                    <EmployeeRow key={employee.employee_id} employee={employee} added={employee.employee_id === added_employee}/>) }
                  </tbody>
                </table>
              </div> : <p className="text-center"> No se encontraron empleados </p>
            }
          </div>
        </div>
      </div>
    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const addedEmployee = Number.parseInt(context.query.added, 10);

  const tabs = await UserService.getNavTabs(context);
  const departments = await DepartmentService.getDepartments();
  const employees = await EmployeeService.getEmployees();

  return {
    props: {
      tabs,
      departments,
      employees,
      added_employee: addedEmployee
    }
  };
}, null);
