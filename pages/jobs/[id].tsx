import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import Navbar from '@components/Navbar';
import FormSection from '@components/FormSection';
import Table from '@components/Table';
import JobService from '@services/JobService';

export default function Jobs({ tabs, job }) {

  const formatter = Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });

  const toColumna = (col) => {
    switch (col) {
      case 0: return 'Remunerativo';
      case 1: return 'No remunerativo';
      case 2: return 'Deduccion';
    }
  };

  return (
    <Navbar tabs={tabs} withHeader={<p>{job.name}</p>}>
      <div className="my-5 px-3 pb-5 border-b-2">
        <FormSection label="Informacion del puesto" fixedHeight={'full'}>
          <p><strong>Departamento:{' '}</strong>{job.department.name}</p>
          <p><strong>Sueldo basico:{' '}</strong>{formatter.format(job.base_salary)}</p>
          <p><strong>Descripcion:{' '}</strong></p>
          <p>{job.description}</p>
        </FormSection>
      </div>
      <div className="my-5 px-3 pb-5 border-b-2">
        <FormSection label="Categorias" fixedHeight={'full'}>
          <Table headers={['Nombre', 'Monto Fijo', 'Porcentual']}
                 selectedFields={['name', 'fixed_raise', 'percentage_raise']}
                 values={job.job_category.map((jc) => {
                   return {
                     name: jc.name,
                     fixed_raise: formatter.format(jc.fixed_raise),
                     percentage_raise: `${jc.percentage_raise} %`
                   };
                 })}/>
        </FormSection>
      </div>
      <div className="my-5 px-3 pb-5 ">
        <FormSection label="Conceptos Basicos" fixedHeight={'full'}>
          <Table
            headers={['Codigo', 'Concepto', 'Tipo']}
            selectedFields={['codigo', 'nombre', 'columna']}
            values={
              job.concepto_job
                .map(cj => cj.concepto)
                .sort((a, b) => a.codigo - b.codigo)
                .map((c) => {
                  return {
                    codigo: c.codigo,
                    nombre: c.nombre,
                    columna: toColumna(c.columna)
                  };
                })}/>
        </FormSection>
      </div>
    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const jobId = Number.parseInt(context.params.id, 10);
  const job = await JobService.getJob(jobId);

  const tabs = await UserService.getNavTabs(context);

  return {
    props: {
      tabs,
      job
    }
  };
}, null);
