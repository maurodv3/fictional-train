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
import FormSuccessMessage from '../components/FormSuccessMessage';

const tabs : TabInfo[] = [
  { name: 'tab_actions', href: '/', active: false },
  { name: 'tab_entries', href: '/book_entry', active: false },
  { name: 'tab_books', href: '/book', active: false },
  { name: 'tab_accounts', href: '/account', active: true }
];

const selectedFields : string[] = ['account_id', 'name', 'type', 'account_balance', 'abstract_account', 'switch'];

export default function Accounts({ initialAccounts, initialGroupedAccounts }) {

  const numberFormatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'ARS' });

  const [t] = useTranslation();

  const tableHeader : string[] = [
    t('account.list.theader.number'),
    t('account.list.theader.name'),
    t('account.list.theader.type'),
    t('account.list.theader.balance'),
    t('account.list.theader.abstract'),
    t('account.list.theader.status')
  ];

  const [accounts, setAccounts] = useState(initialAccounts);
  const [groupedAccounts, setGroupedAccounts] = useState(initialGroupedAccounts);
  const [errors, setErrors] = useState();
  const [success, setSuccess] = useState(false);

  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<Account>(null);
  const [abstractAccount, setAbstractAccount] = useState(false);

  const capitalize = (text: string) => {
    return text[0].toUpperCase() + text.slice(1, text.length).toLowerCase();
  };

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
    }).then((response) => {
      if (response.status === 201) {
        setSuccess(true);
        response.json().then((res) => {
          setAccounts(res.accounts);
          setGroupedAccounts(res.grouped);
        });
      } else {
        response.json().then((errors) => {
          setSuccess(false);
          setErrors(errors.msg);
        });
      }
    });
  };

  const switchAccount = async (accountId) => {

    const account = accounts.filter(account => account.account_id === accountId)[0];

    if (!account) {
      return;
    }

    setSuccess(false);

    await fetch(`/api/account/${accountId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: !account.enabled })
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((res) => {
          setAccounts(res.accounts);
          setGroupedAccounts(res.grouped);
        });
      } else {
        response.json().then((errors) => {
          setErrors(errors.msg);
        });
      }
    });

  };

  const isButtonDisabled = () => !(accountName && accountName.length !== 0 && accountType && accountType.length !== 0);

  return (
      <Navbar tabs={tabs}>

        <FormSuccessMessage show={success} message={'account.success'}/>

        <div className="px-2">
          <FormSection label={t('account.entry.add')} fixedHeight={'full'}>
            <Formik initialValues={{ name: '', type: '', abstract: '', parentID: '' }} onSubmit={addAccount}>
              {({ errors, touched }) => (
                <Form>
                  <div className="flex">
                    <div className="w-1/3 mr-5 pr-3">
                      <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="account_name">
                          {t('account.entry.account.name')}
                        </label>
                        <input name="account_name" className="w-full py-2 px-3 std-data-input" placeholder="_ _ _ _ _" autoComplete="off"
                               onChange={e => setAccountName(e.target.value)}/>
                      </div>
                    </div>
                    <div className="flex-initial">
                      <p className="text-sm text-gray-700 font-bold mb-2">{t('account.parent')}</p>
                      <AccountSelect selected={selectedAccount} accounts={groupedAccounts} onClick={selectAccount}/>
                    </div>
                  </div>
                  <div className="flex mb-5">
                    <div className="w-1/3 pr-3">
                      <p className="text-sm text-gray-700 font-bold mb-2">{t('account.type')}</p>
                      <select className="capitalize std-data-input px-3 py-2 w-full text-sm text-gray-700"
                              // disabled={!!(selectedAccount)}
                              disabled={true}
                              value={accountType}
                              onChange={selectAccountType}>
                        <option>_</option>
                        { Object.keys(groupedAccounts).map((group, index) => {
                          return (<option key={`account-type-${index}`} className="capitalize text-sm text-gray-700">{group.toLowerCase()}</option>);
                        })}
                      </select>
                    </div>
                    <div className="ml-6">
                      <p className="text-sm text-gray-700 font-bold mb-4">{t('account.abstract')}</p>
                      <ToggleButton id={'is_abstract_account_toggle'}
                                    checked={!abstractAccount}
                                    onClick={() => setAbstractAccount(!abstractAccount)}
                                    checkedLabel={'SI'} uncheckedLabel={'NO'}
                      />
                    </div>
                  </div>
                  <div className="pt-3 text-right border-t border-gray-300">
                    <FormSubmit disabled={isButtonDisabled()}>
                      <p>{t('account.entry.add')}</p>
                    </FormSubmit>
                  </div>
                </Form>
              )}
            </Formik>
          </FormSection>
        </div>
        <div className="mt-5 px-2 py-5 border-t border-gray-300">
          <FormSection label={t('account.list')} fixedHeight={'full'}>
            <Table headers={tableHeader}
                   selectedFields={selectedFields}
                   values={accounts.map((account) => {
                     return {
                       account_id: account.account_id,
                       name: account.name,
                       type: capitalize(account.account_types.name),
                       account_balance: numberFormatter.format(account.account_balance),
                       abstract_account: account.abstract_account ? t('account.abstract.no') : t('account.abstract.yes'),
                       switch: <ToggleButton id={`${account.account_id}-active-toggle`} checked={account.enabled}
                                             onClick={() => switchAccount(account.account_id)}
                                             checkedLabel={t('account.active')} uncheckedLabel={t('account.inactive')}/>
                     };
                   })}
            />
          </FormSection>
        </div>
      </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {
  const accounts = await getAccounts(undefined, { account_id: 'asc' });
  const groupedAccounts = groupAccounts(accounts);
  return {
    props: {
      initialAccounts: accounts,
      initialGroupedAccounts: groupedAccounts
    },
  };
}, 'MANAGE_ACCOUNTS');
