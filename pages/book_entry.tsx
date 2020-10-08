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
        <div className={`${h} bg-gray-800 px-4 py-4 rounded-sm`}>
          <p className="text-xl text-gray-100">{label}</p>
        </div>
      </div>
      <div className="w-3/4 px-2">
        <div className={`${h} bg-gray-300 rounded-sm px-4 py-4`}>
          {children}
        </div>
      </div>
    </div>
  );
}

function FormMoneyInput() {
  return (
    <div>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm sm:leading-5 font-bold">$</span>
        </div>
        <input id="price" className="block pl-7 pr-12 py-2 px-4 sm:text-sm sm:leading-5 std-data-input" placeholder="0.00"/>
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
      <svg className="h-5 w-5 mr-1 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="flex justify-evenly pb-3 border-b-2 border-white">
            <div className="text-center">
              <AccountSelect accounts={accounts} onClick={() => console.log('Click!')} />
            </div>
            <div className="text-center">
              <FormMoneyInput/>
            </div>
            <div className="text-center mt-2">
              <ToggleButton onClick={() => setToggle(!toggle)} checked={toggle}
                            checkedLabel={'Haber'} uncheckedLabel={'Debe'} id={'movement-type'}/>
            </div>
          </div>
          <div className="mt-3">
            <Table headers={['Cuenta', 'Debe', 'Haber', 'Acciones']}
                   values={[
                       { cuenta: 'Caja', debe: '1200.50', acciones: <div>{botones}</div> },
                       { cuenta: '-> Ventas', haber: '1200.50', acciones: <div>{botones}</div> },
                       { cuenta: 'CMV', debe: '1200.50', acciones: <div>{botones}</div> },
                       { cuenta: '-> Mercaderias', haber: '1200.50', acciones: <div>{botones}</div> }
                   ]}
                   selectedFields={['cuenta', 'debe', 'haber', 'acciones']}/>
          </div>
        </FormSection>
      </div>

      <div className="px-2 mt-3">
        <FormSection label={t('details')} fixedHeight={36}>
          <textarea style={{ resize : 'none' }} rows={3} className="form-textarea block w-full h-full std-data-input" placeholder={t('insert_description_tooltip')}/>
        </FormSection>
      </div>

      <div className="px-2 mt-3">
        <FormSection label={t('summary')} fixedHeight={'full'}>
            <FormSubmit disabled={true}>
              <p>Agregar</p>
            </FormSubmit>
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
