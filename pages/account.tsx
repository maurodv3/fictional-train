import { GetServerSideProps } from 'next';
import withSecureAccess from '../lib/secured';
import Navbar, { TabInfo } from '../components/Navbar';
import FormSection from '../components/FormSection';
import { Field, Form, Formik } from 'formik';
import FormSubmit from '../components/FormSubmit';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ToggleButton from '../components/ToggleButton';
import Table from '../components/Table';
import AccountSelect from '../components/AccountSelect';
import Account from '../handlers/account/Account';
import fetch from 'isomorphic-unfetch';
import { getAccounts, groupAccounts } from '../handlers/account/accountService';

const tabs : TabInfo[] = [
  { name: 'tab_actions', href: '/', active: false },
  { name: 'tab_entries', href: '/book_entry', active: false },
  { name: 'tab_books', href: '/book', active: false },
  { name: 'tab_accounts', href: '/account', active: true }
];

const tableHeader : string[] = ['Numero', 'Nombre', 'Saldo actual', 'Recibe Saldo', 'Estado'];
const selectedFields : string[] = ['account_id', 'name', 'account_balance', 'abstract_account', 'switch'];

export default function Accounts({ accounts, groupedAccounts }) {

  const [t] = useTranslation();
  const [errorMsg, setErrorMsg] = useState();
  const numberFormatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'ARS' });

  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<Account>(null);
  const [abstractAccount, setAbstractAccount] = useState(false);

  const selectAccount = (account: Account) => {
    setSelectedAccount(account);
    setAccountType(account.account_types.name.toLowerCase());
  };

  const selectAccountType = (e) => {
    setAccountType(e.target.value);
  };

  const addAccount = async () => {
    await fetch('/api/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountName, accountType, selectedAccount, abstractAccount
      })
    }).then(console.log);
  };

  const switchAccount = async (accountId) => {
    await fetch(`/api/account/${accountId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    }).then(console.log);
  };

  const isButtonDisabled = (errors, touched) => !(accountName && accountName.length !== 0 && accountType && accountType.length !== 0);

  return (
      <Navbar tabs={tabs}>
        <div className="px-2">
          <FormSection label={'Agregar cuenta'} fixedHeight={'full'}>
            <Formik initialValues={{ name: '', type: '', abstract: '', parentID: '' }} onSubmit={addAccount}>
              {({ errors, touched }) => (
                <Form>
                  <div className="flex">
                    <div className="w-1/3 mr-5 pr-3">
                      <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="account_name">
                          Nombre de cuenta
                        </label>
                        <input name="account_name" className="w-full py-2 px-3 std-data-input" placeholder="..." autoComplete="off"
                               onChange={e => setAccountName(e.target.value)}/>
                      </div>
                    </div>
                    <div className="flex-initial">
                      <p className="text-sm text-gray-700 font-bold mb-2">Cuenta Padre</p>
                      <AccountSelect selected={selectedAccount} accounts={groupedAccounts} onClick={selectAccount}/>
                    </div>
                  </div>
                  <div className="flex mb-5">
                    <div className="w-1/3 pr-3">
                      <p className="text-sm text-gray-700 font-bold mb-2">Tipo cuenta</p>
                      <select className="capitalize std-data-input px-3 py-2 w-full text-sm text-gray-700"
                              disabled={!!(selectedAccount)}
                              value={accountType}
                              onChange={selectAccountType}>
                        <option>-</option>
                        { Object.keys(groupedAccounts).map((group, index) => {
                          return (<option key={`account-type-${index}`} className="capitalize text-sm text-gray-700">{group.toLowerCase()}</option>);
                        })}
                      </select>
                    </div>
                    <div className="ml-6">
                      <p className="text-sm text-gray-700 font-bold mb-4">Recibe Saldo</p>
                      <ToggleButton id={'is_abstract_account_toggle'}
                                    checked={!abstractAccount}
                                    onClick={() => setAbstractAccount(!abstractAccount)}
                                    checkedLabel={'SI'} uncheckedLabel={'NO'}
                      />
                    </div>
                  </div>
                  <div className="pt-3 text-right border-t border-gray-300">
                    <FormSubmit disabled={isButtonDisabled(errors, touched)}>
                      <p>Agregar cuenta</p>
                    </FormSubmit>
                  </div>
                </Form>
              )}
            </Formik>
          </FormSection>
        </div>
        <div className="mt-5 px-2 py-5 border-t border-gray-300">
          <FormSection label={'Cuentas'} fixedHeight={'full'}>
            <Table headers={tableHeader}
                   selectedFields={selectedFields}
                   values={accounts.map((account) => {
                     return {
                       account_id: account.account_id,
                       name: account.name,
                       account_balance: numberFormatter.format(account.account_balance),
                       abstract_account: account.abstract_account ? 'NO' : 'SI',
                       switch: <ToggleButton id={`${account.account_id}-active-toggle`} checked={account.enabled}
                                             onClick={() => switchAccount(account.account_id)} checkedLabel={'Activa'} uncheckedLabel={'Inactiva'}/>
                     };
                   })}
            />
          </FormSection>
        </div>
      </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {
  const accounts = await getAccounts(undefined, { account_balance: 'desc' });
  const groupedAccounts = groupAccounts(accounts);
  return {
    props: { accounts, groupedAccounts },
  };
}, 'MANAGE_ACCOUNTS');
