import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import Navbar from '@components/Navbar';
import Table from '@components/Table';
import Link from 'next/link';

const buttons = () => {
  return (
    <Link href="/jobs/1">
      <button>
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
    </Link>
  );
};

export default function Jobs({ tabs }) {
  return (
    <Navbar tabs={tabs} withHeader={<p>Puestos</p>}>
      <Table
        headers={['Puesto', 'Departamento', 'Categorias', 'Sueldo Base', 'Acciones']}
        selectedFields={['puesto', 'departamento', 'categorias', 'sueldo', 'acciones']}
        values={[
          {
            puesto: 'Jefe ventas',
            departamento: 'Ventas',
            categorias: 'Jefe',
            sueldo: '$ 50.000,00',
            acciones: buttons()
          },
          {
            puesto: 'Jefe Compras',
            departamento: 'Compras',
            categorias: 'Jefe',
            sueldo: '$ 50.000,00',
            acciones: buttons()
          },
          {
            puesto: 'Vendedor',
            departamento: 'Ventas',
            categorias: '1, 2, 3',
            sueldo: '$ 35.000,00',
            acciones: buttons()
          },
          {
            puesto: 'Repartidor',
            departamento: 'Distribucion',
            categorias: '1, 2',
            sueldo: '$ 30.000,00',
            acciones: buttons()
          },
        ]}
      />
    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {
  const tabs = await UserService.getNavTabs(context);
  return {
    props: {
      tabs
    }
  };
}, null);
