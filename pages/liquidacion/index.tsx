import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import Navbar from '@components/Navbar';
import ReciboService from '@services/ReciboService';
import Table from '@components/Table';
import { format } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';
import fetch from 'isomorphic-unfetch';

const buttons = (id) => {
  return (
    <div>
      <Link href={`/liquidacion/${id}`}>
        <button className="whitespace-nowrap text-right text-sm font-medium text-indigo-600 hover:text-indigo-900">
          <p>Detalles</p>
        </button>
      </Link>
      <span className="text-indigo-600">{' | '}</span>
      <Link href={`/liquidacion/print/${id}`}>
        <a target="_blank">
          <button className="whitespace-nowrap text-right text-sm font-medium text-indigo-600 hover:text-indigo-900">
            <p>Imprimir</p>
          </button>
        </a>
      </Link>
    </div>
  );
};

export default function Index({ tabs, liquidaciones }) {

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

  const [generando, setGenerando] = useState(false);
  const generar = async () => {
    setGenerando(true);
    await fetch('/api/liquidacion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
      if (response.status === 201) {
        response.json().then((resp) => {
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
    <Navbar tabs={tabs} withHeader={<p>Liquidacion de sueldos</p>}>
      <div className="mb-5 relative border border-gray-100 rounded-md shadow-md bg-white no-print">
        <div className="flex rounded-sm px-4 py-4">
          { generando ? (
            <button className="bg-indigo-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed mr-4" disabled={true}>
              Generando...
            </button>
          ) : (
            <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
              onClick={generar} >
              Generar Recibos
            </button>
          )}
          <Link href={'/liquidacion/confirmar'}>
            <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4">
              Confirmar depositos
            </button>
          </Link>
        </div>
      </div>
      { liquidaciones.length === 0 ? (
        <div>
          <p className="text-center"> No se encontraron liquidaciones </p>
        </div>
      ) : (
        <Table
          headers={['Periodo', 'Fecha' , 'Version', 'Estado', 'Monto Bruto', 'Acciones']}
          selectedFields={['lapso', 'fecha', 'version', 'status', 'amount', 'actions']}
          values={
            liquidaciones.map((l) => {
              return {
                fecha: format(l.fecha, 'dd/MM/yyyy'),
                lapso: l.lapso,
                version: l.version,
                status: toStatus(l.status),
                amount: formatter.format(l.bruto_total),
                actions: buttons(l.liquidacion_id)
              };
            })
          }
        />
      )}
    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const tabs = await UserService.getNavTabs(context);
  const liquidaciones = await ReciboService.getLiquidaciones();

  return {
    props: {
      tabs,
      liquidaciones
    }
  };
}, null);
