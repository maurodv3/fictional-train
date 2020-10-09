import Navbar, { TabInfo } from '../components/Navbar';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import withSecureAccess from '../lib/secured';
import { PrismaClient } from '@prisma/client';
import FormSubmit from '../components/FormSubmit';
import { useState } from 'react';
import AccountSelect from '../components/AccountSelect';
import ToggleButton from '../components/ToggleButton';
import Table from '../components/Table';
import FormMoneyInput from '../components/FormMoneyInput';

const tabs : TabInfo[] = [
  { name: 'tab_actions', href: '/', active: false },
  { name: 'tab_entries', href: '/book_entry', active: true },
  { name: 'tab_books', href: '/book', active: false },
  { name: 'tab_accounts', href: '/account', active: false }
];

function FormSection({ label, children, fixedHeight }) {
  const h = fixedHeight ? `h-${fixedHeight}` : '';
  return (
    <div className="flex flex-wrap -mx-2">
      <div className="w-1/4 px-2">
        <div className={`${h} px-4 py-4 rounded-sm`}>
          <p className="text-xl font-medium text-gray-700">{label}</p>
        </div>
      </div>
      <div className="w-3/4 px-2 border border-gray-100 rounded-md shadow-md bg-white">
        <div className={`${h} rounded-sm px-4 py-4`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function BookEntry({ accounts }) {

  const [t] = useTranslation();
  const header = <p>{t('book_entry_title')}</p>;
  const [toggle, setToggle] = useState(true);

  const botones = (
    <div className="flex">
      <svg className="h-5 w-5 mr-1 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="indigo" fillOpacity="0.5" strokeOpacity="0.8">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      <svg className="h-5 w-5 mr-1 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    </div>
  );

  return (
    <Navbar withHeader={header} tabs={tabs}>

      <div className="px-2">
        <FormSection label={t('account_and_amount')} fixedHeight={'full'}>
          <div className="flex justify-evenly pb-3 border-b-2 border-gray-100">
            <div className="text-center">
              <AccountSelect accounts={accounts} onClick={() => console.log('Click!')} />
            </div>
            <div className="text-center">
              <FormMoneyInput onChange={e => console.log(e)}/>
            </div>
            <div className="text-center mt-2">
              <ToggleButton onClick={() => setToggle(!toggle)} checked={toggle}
                            checkedLabel={'Haber'} uncheckedLabel={'Debe'} id={'movement-type'}/>
            </div>
            <div className="text-center mt-2">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="green" fillOpacity="0.5" strokeOpacity="0.8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <Table headers={['Cuenta', 'Debe', 'Haber', 'Acciones']}
                   values={[
                       { cuenta: 'Caja', debe: '120,000.50', acciones: <div>{botones}</div> },
                       { cuenta: '(->) Costo mercaderias vencidas (500)', haber: '120,000.50', acciones: <div>{botones}</div> },
                       { cuenta: 'CMV', debe: '1200.50', acciones: <div>{botones}</div> },
                       { cuenta: '(->) Mercaderias', haber: '1200.50', acciones: <div>{botones}</div> }
                   ]}
                   selectedFields={['cuenta', 'debe', 'haber', 'acciones']}/>
          </div>
        </FormSection>
      </div>

      <div className="mt-3 px-2 py-5 border-t border-gray-300">
        <FormSection label={t('details')} fixedHeight={36}>
          <textarea style={{ resize : 'none' }} rows={3} className="form-textarea block w-full h-full std-data-input" placeholder={t('insert_description_tooltip')}/>
        </FormSection>
      </div>

      <div className="mt-3 px-2 py-5 border-t border-gray-300">
        <FormSection label={t('summary')} fixedHeight={'full'}>
          <div className="mb-3">
            <div className="flex justify-evenly">
              <div className="text-center">
                <p className="font-medium">Debe Total</p><p>1050.50</p>
              </div>
              <div className="text-center">
                <p className="font-medium">Haber Total</p><p>1000.00</p>
              </div>
              <div className="text-center">
                <p className="font-medium">Diferencia</p><p>50.50</p>
              </div>
            </div>
          </div>
          <div className="pt-3 text-right border-t border-gray-300">
            <FormSubmit disabled={true}>
              <p>Agregar Asiento</p>
            </FormSubmit>
          </div>
        </FormSection>
      </div>
    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {
  const prisma = new PrismaClient();
  const accounts = await prisma.accounts.findMany({
    where: { abstract_account: false },
    include: {
      account_types: true
    }
  });

  const groupedAccounts = accounts.reduce((grouped, item) => {
    (grouped[item['account_types'].name] = grouped[item['account_types'].name] || []).push(item);
    return grouped;
  }, {});

  return {
    props: { accounts: groupedAccounts },
  };

}, null);
