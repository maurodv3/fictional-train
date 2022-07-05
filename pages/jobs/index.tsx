import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import Navbar from '@components/Navbar';
import Table from '@components/Table';
import Link from 'next/link';
import JobService from '@services/JobService';
import DepartmentService from '@services/DepartmentService';
import { useState } from 'react';

const buttons = (id) => {
  return (
    <div>
      <Link href={`/jobs/${id}`}>
        <button className="whitespace-nowrap text-right text-sm font-medium text-indigo-600 hover:text-indigo-900">
          <p>Detalles</p>
        </button>
      </Link>
      <span className="text-indigo-600">{' | '}</span>
      <Link href={`/jobs/edit/${id}`}>
        <button className="whitespace-nowrap text-right text-sm font-medium text-indigo-600 hover:text-indigo-900">
          <p>Editar</p>
        </button>
      </Link>
    </div>

  );
};

export default function Jobs({ tabs, jobs, departments, added }) {

  const formatter = Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });

  const [displayedJobs, setDisplayedJobs] = useState(jobs);

  const filterJobs = (e) => {
    if (e.target.value === '-1') {
      setDisplayedJobs(jobs);
    } else {
      setDisplayedJobs(jobs.filter(job => job.department.department_id === Number.parseInt(e.target.value, 10)));
    }
  };

  return (
    <Navbar tabs={tabs}>
      <div className="mb-5 relative border border-gray-100 rounded-md shadow-md bg-white no-print">
        <div className="flex h-24 rounded-sm px-4 py-4">
          <div className="mx-5">
            <p className="text-sm text-gray-700 font-bold mb-2">Departamento</p>
            <select className="px-3 py-2 w-36 std-data-input capitalize text-md text-gray-700" onChange={filterJobs}>
              <option value={-1}>- Todos</option>
              {departments.map(deps =>
                <option key={deps.department_id} value={deps.department_id}>{deps.name}</option>
              )}
            </select>
          </div>
        </div>
        <div className="absolute top-2 right-4 h-8 w-8 text-center">
          <Link href={'/jobs/add'}>
            <button className="border border-gray-300 rounded-full bg-indigo-500 h-10 w-10 p-2 focus:outline-none focus:shadow-outline hover:bg-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="whitesmoke">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
      { displayedJobs.length === 0 ? (
        <p className="text-center"> No se encontraron puestos </p>
      ) : (
        <Table
          headers={['Puesto', 'Departamento', 'Categorias', 'Sueldo Base', 'Acciones']}
          selectedFields={['name', 'department', 'categories', 'base_salary', 'actions']}
          values={
            displayedJobs.map((job) => {
              return {
                name: job.name,
                department: job.department.name,
                categories: <ul>{job.job_category.map(jc => <li key={jc.job_category_id}>{jc.name}</li>)}</ul>,
                base_salary: formatter.format(job.base_salary),
                actions: buttons(job.job_id)
              };
            })
          }
        />
      )}

    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const addedJob = Number.parseInt(context.query.added, 10);

  const tabs = await UserService.getNavTabs(context);
  const jobs = await JobService.getJobs();
  const departments = await DepartmentService.getDepartments();
  return {
    props: {
      tabs,
      jobs,
      departments,
      added: addedJob
    }
  };
}, null);
