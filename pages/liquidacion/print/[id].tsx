import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import ReciboService from '@services/ReciboService';
import Recibo from '@components/Recibo';
import { useEffect } from 'react';

export default function Index({ tabs, liquidacion, entity }) {

  useEffect(() => {
    window.print();
  });

  return (
    <div>
      {liquidacion.recibos.map((recibo) => {
        return (
          <div key={recibo.recibo_id}>
            <Recibo key={`${recibo.recibo_id}-a`} recibo={recibo.data} entity={entity} isEmpleado={true}/>
            <div className="pagebreak"/>
            <Recibo key={`${recibo.recibo_id}-b`} recibo={recibo.data} entity={entity} isEmpleado={false}/>
            <div className="pagebreak"/>
          </div>
        );
      })}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const liquiId = Number.parseInt(context.params.id, 10);
  const tabs = await UserService.getNavTabs(context);
  const liquidacion = await ReciboService.getLiquidacion(liquiId);
  const [, entity] = await UserService.getUserInfo(context);

  return {
    props: {
      tabs,
      liquidacion,
      entity
    }
  };
}, null);
