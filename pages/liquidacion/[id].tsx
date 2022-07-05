import Navbar from '@components/Navbar';
import Link from 'next/link';
import Table from '@components/Table';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import ReciboService from '@services/ReciboService';
import FormSection from '@components/FormSection';
import FormSubmit from '@components/FormSubmit';
import React from 'react';
import fetch from 'isomorphic-unfetch';

export default function Index({ tabs, liquidacion }) {

  const formatter = Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });

  const toStatus = (i) => {
    switch (i) {
      case 0: return 'Pendiente de pago';
      case 1: return 'Depositado';
    }
  };

  const buttons = (id) => {
    return (
      <div>
        <Link href={`/recibo/${id}`}>
          <button className="whitespace-nowrap text-right text-sm font-medium text-indigo-600 hover:text-indigo-900">
            <p>Ver</p>
          </button>
        </Link>
      </div>
    );
  };

  const deleteLiquidacion = () => {
    fetch(`/api/liquidacion/${liquidacion.liquidacion_id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((resp) => {
          // Some problem with dates, force page reload as workaround. This is ugly.
          window.location.href = '/liquidacion';
        });
      } else {
        response.json().then((errors) => {
          console.log(errors);
        });
      }
    });
  };

  return (
    <Navbar tabs={tabs} withHeader={<p>{`Liquidacion: ${liquidacion.lapso} Version: ${liquidacion.version}`}</p>}>
      <div className="my-5 px-3 pb-5 border-b-2">
        <FormSection label="Datos de la liquidacion" fixedHeight={'full'}>
          <p><strong>Periodo: </strong>{liquidacion.lapso}</p>
          <p><strong>Fecha: </strong>{format(liquidacion.fecha, 'dd/MM/yy')}</p>
          <p><strong>Version: </strong>{liquidacion.version}</p>
          <p><strong>Estado: </strong>{toStatus(liquidacion.status)}</p>
          <p><strong>Monto Total: </strong>{formatter.format(liquidacion.bruto_total)}</p>
          <p><strong>Recibos Generados: </strong>{liquidacion.recibos.length}</p>
        </FormSection>
      </div>
      <div className="my-5 px-3 pb-5 border-b-2">
        <FormSection label="Recibos generados" fixedHeight={'full'}>
          <Table
            headers={['Legajo', 'Empleado', 'Neto', 'Acciones']}
            selectedFields={['legajo', 'empleado', 'neto', 'acciones']}
            values={
              liquidacion.recibos.map((r) => {
                return {
                  legajo: r.data.legajo,
                  empleado: `${r.employee.lastname} ${r.employee.name}`,
                  neto: formatter.format(r.data.neto),
                  acciones: buttons(r.recibo_id)
                };
              })
            }
          />
        </FormSection>
      </div>
      { liquidacion.status === 0 ? (
        <div className="mt-5 px-2" >
          <FormSection label={'Borrar'} fixedHeight={'full'}>
            <div className="flex flex-row-reverse text-right">
              <button className="bg-red-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
                      onClick={deleteLiquidacion}>
                Borrar liquidacion
              </button>
            </div>
          </FormSection>
        </div>
      ) : null }
    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const liquiId = Number.parseInt(context.params.id, 10);
  const tabs = await UserService.getNavTabs(context);
  const liquidacion = await ReciboService.getLiquidacion(liquiId);

  return {
    props: {
      tabs,
      liquidacion
    }
  };
}, null);
