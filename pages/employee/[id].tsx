import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import Navbar from '@components/Navbar';
import Table from '@components/Table';
import FormSection from '@components/FormSection';

export default function AddEmployee({ tabs }) {
  return (
      <Navbar tabs={tabs} withHeader={<p>Luke Skywalker</p>}>
        <div className="py-5 flex border-b-2">
          <div className="w-1/3">
            <img className="h-48 w-48 rounded-full" src="https://i.insider.com/5682a0d9c08a8081028b56f8?width=500&format=jpeg&auto=webp" alt=""/>
          </div>
          <div className="w-1/3">
            <p><strong>CUIL:{' '}</strong>20-12345678-4</p>
            <p><strong>E-mail Laboral:{' '}</strong>luke.skywalker@b3000.com</p>
            <p><strong>E-mail Personal:{' '}</strong>lskywalker@gmail.com</p>
            <p><strong>Domicilio:{' '}</strong>Calle falsa 123</p>
            <br/>
            <p><strong>Puesto:{' '}</strong>Jefe de ventas</p>
            <p><strong>Categoria:{' '}</strong>Jefe</p>
            <p><strong>Departamento:{' '}</strong>Ventas</p>
          </div>
        </div>
        <div className="my-5 px-3 pb-5 border-b-2">
          <FormSection label={'Inasistencias'} fixedHeight={'full'}>
            <Table headers={['Fecha', 'Justificacion', 'Descripcion']}
                   values={[{
                     fecha: '01/09/2020 - 02/09/2020',
                     justificacion: 'Certificado Medico',
                     descripcion: '48hs Reposo, extraccion dental.'
                   }, {
                     fecha: '12/08/2020',
                     justificacion: 'Ninguna',
                     descripcion: 'No se presento a trabajar'
                   }]}
                   selectedFields={['fecha', 'justificacion', 'descripcion']}/>
          </FormSection>
        </div>
        <div className="mb-5 px-3 pb-5 border-b-2">
          <FormSection label={'Conceptos Excepcionales'} fixedHeight={'full'}>
            <p className="float-right">Agregar (+)</p>
            <Table headers={['Descripcion', 'A cobrar en', 'Monto', 'Estado']}
                   values={[
                     {
                       descripcion: 'Premio Noviembre',
                       aCobrarEn: '2020-11',
                       monto: '$ 1523.25',
                       estado: 'Pendiente'
                     }, {
                       descripcion: 'Viaticos Octubre',
                       aCobrarEn: '2020-11',
                       monto: '$ 8500.00',
                       estado: 'Pendiente'
                     }, {
                       descripcion: 'Viaticos Septiembre',
                       aCobrarEn: '2020-10',
                       monto: '$ 1200.00',
                       estado: 'Pagado'
                     }
                   ]}
                   selectedFields={['descripcion', 'aCobrarEn', 'monto', 'estado']}/>
          </FormSection>
        </div>
        <div className="mb-5 px-3 pb-5">
          <FormSection label={'Recibos de sueldo'} fixedHeight={'full'}>
            <Table headers={['Descripcion', 'Periodo', 'Fecha Emision', 'Estado', 'Acciones']}
                   values={[{
                     descripcion: 'Recibo Octubre 2020',
                     periodo: '2020-10',
                     fechaEmision: '02/11/2020',
                     estado: 'Recibido Conforme',
                     acciones: '(+)'
                   }, {
                     descripcion: 'Recibo Septiembre 2020',
                     periodo: '2020-09',
                     fechaEmision: '02/10/2020',
                     estado: 'Recibido Conforme',
                     acciones: '(+)'
                   }, {
                     descripcion: 'Recibo Agosto 2020',
                     periodo: '2020-08',
                     fechaEmision: '02/09/2020',
                     estado: 'Recibido Conforme',
                     acciones: '(+)'
                   }, {
                     descripcion: 'Recibo Julio 2020',
                     periodo: '2020-07',
                     fechaEmision: '02/08/2020',
                     estado: 'Recibido Conforme',
                     acciones: '(+)'
                   }
                   ]}
                   selectedFields={['descripcion', 'periodo', 'fechaEmision', 'estado', 'acciones']}/>
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
