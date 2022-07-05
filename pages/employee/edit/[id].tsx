import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import DepartmentService from '@services/DepartmentService';
import AddEmployee from '../add';
import EmployeeService from '@services/EmployeeService';

export default function EditEmployee({ tabs, departments, employee, edit_mode }) {
  return AddEmployee({ tabs, departments, employee, edit_mode });
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const employeeId = Number.parseInt(context.params.id, 10);
  const employee = await EmployeeService.getEmployee(employeeId);

  const tabs = await UserService.getNavTabs(context);

  const departments = await DepartmentService.getDepartmentsWithJobs()
    .then(ds => ds.flatMap((d) => {
      return {
        id: d.department_id,
        name: d.name,
        jobs: d.job.map((j) => {
          return {
            id: j.job_id,
            name: j.name,
            categories: j.job_category.map((c) => {
              return {
                c_id: c.job_category_id,
                c_name: c.name
              };
            })
          };
        })
      };
    }));

  return {
    props: {
      tabs,
      departments,
      employee,
      edit_mode: true,
    }
  };
}, null);
