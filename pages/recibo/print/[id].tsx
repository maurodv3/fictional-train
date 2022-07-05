import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import ReciboService from '@services/ReciboService';
import Recibo from '@components/Recibo';
import { useEffect } from 'react';

export default function Index({ tabs, recibo, entity }) {

  useEffect(() => {
    window.print();
  });

  return (
    <div>
      <Recibo recibo={recibo.data} entity={entity} isEmpleado={true}/>
      <div className="pagebreak"/>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const reciboId = Number.parseInt(context.params.id, 10);
  const tabs = await UserService.getNavTabs(context);
  const recibo = await ReciboService.getRecibo(reciboId);
  const [, entity] = await UserService.getUserInfo(context);

  return {
    props: {
      tabs,
      recibo,
      entity
    }
  };
}, null);
