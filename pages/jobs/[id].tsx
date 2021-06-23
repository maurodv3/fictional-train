import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import Navbar from '@components/Navbar';
import FormSection from '@components/FormSection';
import Table from '@components/Table';

export default function Jobs({ tabs }) {
  return (
    <Navbar tabs={tabs} withHeader={<p>Jefe Ventas</p>}>
      <div className="my-5 px-3 pb-5 border-b-2">
        <FormSection label="Informacion del puesto" fixedHeight={'full'}>
          <p><strong>Departamento:{' '}</strong>Ventas</p>
          <p><strong>Sueldo basico:{' '}</strong>$ 50.000,00</p>
          <p><strong>Descripcion:{' '}</strong></p>
          <p>Encargado del departamento Ventas.</p>
        </FormSection>
      </div>
      <div className="my-5 px-3 pb-5 border-b-2">
        <FormSection label="Categorias" fixedHeight={'full'}>
          <Table headers={['Nombre', 'Monto Fijo', 'Porcentual']}
                 selectedFields={['nombre', 'monto', 'porcentaje']}
                 values={[
                   {
                     nombre: 'Jefe',
                     monto: '$ 2500.00',
                     porcentaje: '0.0%'
                   }
                 ]}/>
        </FormSection>
      </div>
      <div className="my-5 px-3 pb-5 ">
        <FormSection label="Conceptos Basicos" fixedHeight={'full'}>
          <Table
            headers={['Concepto', 'Tipo', 'Periodicidad', 'Monto Fijo', 'Porcentual']}
            selectedFields={['concepto', 'tipo', 'periodicidad', 'monto', 'porcentaje']}
            values={[
              {
                concepto: 'Jubilacion',
                tipo: 'Descuento',
                porcentaje: '11%',
                periodicidad: 'Mensual'
              },
              {
                concepto: 'Ley 19032',
                tipo: 'Descuento',
                porcentaje: '3%',
                periodicidad: 'Mensual'
              },
              {
                concepto: 'Obra Social',
                tipo: 'Descuento',
                porcentaje: '3%',
                periodicidad: 'Mensual'
              },
              {
                concepto: 'Bono Participacion',
                tipo: 'Remunerativo',
                porcentaje: '15%',
                periodicidad: 'Semestral'
              }
            ]}/>
        </FormSection>
      </div>
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
