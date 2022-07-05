import Navbar from '@components/Navbar';
import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import ReciboService from '@services/ReciboService';
import { format } from 'date-fns';
import Table from '@components/Table';
import fetch from 'isomorphic-unfetch';

const confirm = (id) => {
  return async () => {
    await fetch(`/api/liquidacion/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
      if (response.status === 200) {
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
};

const buttons = (id) => {
  return (
    <div>
      <button className="whitespace-nowrap text-right text-sm font-medium text-indigo-600 hover:text-indigo-900" onClick={confirm(id)}>
        <p>Confirmar</p>
      </button>
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

  return (
    <Navbar tabs={tabs} withHeader={<p>Confirmar liquidacion</p>}>
      { liquidaciones.length === 0 ? (
        <div>
          <p className="text-center"> No se encontraron liquidaciones para confirmar</p>
        </div>
      ) : (
        <div>
          <div className="border-t border-b border-gray-500 text-center mb-5 ">
            <p className="py-5 font-semibold">
              IMPORTANTE! Confirmar la liquidacion hara efectiva la seleccionada liquidacion, creando los depositos para cada recibo generado y
              generando los asientos contables. Una vez confirmada la liquidacion no puede ser revertida.
            </p>
          </div>
          <div>
            <Table
              headers={['Periodo', 'Fecha' , 'Version', 'Estado', 'Monto Total', 'Acciones']}
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
          </div>
        </div>
      )}
    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const tabs = await UserService.getNavTabs(context);
  const liquidaciones = await ReciboService.getLiquidacionesConfirmables();

  return {
    props: {
      tabs,
      liquidaciones
    }
  };
}, null);
