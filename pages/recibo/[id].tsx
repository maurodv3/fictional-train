import Navbar from '@components/Navbar';
import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import ReciboService from '@services/ReciboService';
import Recibo from '@components/Recibo';
import ToggleButton from '@components/ToggleButton';
import { useState } from 'react';

export default function Index({ tabs, recibo, entity }) {

  const [toggle, setToggle] = useState(true);

  return (
    <Navbar tabs={tabs} withHeader={
      <div className="flex">
        <div className="w-3/4">
          {`Recibo: ${recibo.data.apellido} ${recibo.data.nombre}, Periodo: ${recibo.data.ulLapso}`}
        </div>
        <div className="flex w-1/3 justify-end">
          <ToggleButton onClick={() => setToggle(!toggle)} checked={toggle}
                        checkedLabel={'Version Empleado'}
                        uncheckedLabel={'Version Empleador'}
                        id={'type'}/>
        </div>
      </div>}>
      <div className="my-5 px-3 pb-5 border-b-2">
        <Recibo recibo={recibo.data} entity={entity} isEmpleado={toggle}/>
      </div>
    </Navbar>
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
