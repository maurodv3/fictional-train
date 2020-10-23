import Navbar, { TabInfo } from '../components/Navbar';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import withSecureAccess from '../lib/secured';
import FormSubmit from '../components/FormSubmit';
import { useEffect, useState } from 'react';
import AccountSelect from '../components/AccountSelect';
import ToggleButton from '../components/ToggleButton';
import FormMoneyInput from '../components/FormMoneyInput';
import TableV2 from '../components/TableV2';
import { Form, Formik } from 'formik';
import fetch from 'isomorphic-unfetch';
import FormSection from '../components/FormSection';
import FormErrorMessage from '../components/FormErrorMessage';
import FormSuccessMessage from '../components/FormSuccessMessage';
import { getGroupedAccounts } from '../handlers/account/accountService';

const tabs : TabInfo[] = [
  { name: 'tab_actions', href: '/', active: false },
  { name: 'tab_entries', href: '/book_entry', active: true },
  { name: 'tab_books', href: '/book', active: false },
  { name: 'tab_accounts', href: '/account', active: false }
];

export default function BookEntry({ accounts }) {

  const [t] = useTranslation();
  const numberFormatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'ARS' });
  const header = <p>{t('book_entry_title')}</p>;

  const [toggle, setToggle] = useState(false); // TRUE => Haber / FALSE => Debe
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const [entries, setEntries] = useState([]);

  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState(null);

  const headers = [t('account'), t('debit'), t('assets')];
  const selectedFields = ['displayName', 'debit', 'assets'];

  const selectAccount = (account) => {
    setSelectedAccount(account);
  };

  const amountChange = (e) => {
    setAmount(e.target.value);
  };

  const descriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const clearForm = () => {
    setToggle(false);
    setSelectedAccount(null);
    setAmount('');
    setDescription('');
    setEntries([]);
    setErrors(null);
  };

  const isAddEntryEnabled = () => {
    return (amount && amount.length !== 0) && selectedAccount;
  };

  const addEntry = () => {
    const entry = {
      account: selectedAccount
    };
    const displayName = `${selectedAccount.name} (${selectedAccount.account_id})`;
    if (toggle) {
      entry['displayName'] = <p className="pl-6">{displayName}</p>;
      entry['assets'] = parseFloat(amount);
    } else {
      entry['displayName'] = <p>{displayName}</p>;
      entry['debit'] = parseFloat(amount);
    }
    setEntries([...entries, entry]);
  };

  const moveEntry = (i, j) => {
    const original = entries;
    const a = entries[i];
    const b = entries[j];
    if (a && b) {
      original[i] = b;
      original[j] = a;
      setEntries([...original]);
    }
  };

  const deleteEntry = (i) => {
    const original = entries;
    original.splice(i, 1);
    setEntries([...original]);
  };

  const [assetsTotal, setAssetsTotal] = useState(0);
  const [debitTotal, setDebitTotal] = useState(0);

  useEffect(() => {
    setAssetsTotal(entries.reduce((a, b) => a + (b['assets'] || 0), 0));
    setDebitTotal(entries.reduce((a, b) => a + (b['debit'] || 0), 0));
  }, [entries]);

  const isSubmitEnabled = () => {
    return Math.abs((assetsTotal - debitTotal)) === 0 && assetsTotal !== 0 && debitTotal !== 0 && description ;
  };

  const submit = async () => {
    const body = {
      description,
      entries: entries.map((entry) => {
        return {
          account_id: entry.account.account_id,
          debit: entry.debit,
          assets: entry.assets,
        };
      })
    };

    await fetch('/api/entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then((response) => {
      if (response.status === 200) {
        setSuccess(true);
        clearForm();
      } else {
        response.json().then((errors) => {
          setErrors(errors.msg);
        });
      }
    });
  };

  return (
    <Navbar withHeader={header} tabs={tabs}>

      <FormSuccessMessage show={success} message={'entry.success'}/>

      { errors ? (
        <FormErrorMessage errors={errors}/>
      ) : null }

      <Formik initialValues={{ description: '' }} onSubmit={submit}>
        <Form>

          <div className="px-2">
            <FormSection label={t('account_and_amount')} fixedHeight={'full'}>
              <div className="flex justify-evenly pb-3 border-b-2 border-gray-100">
                <div className="text-center">
                  <AccountSelect selected={selectedAccount} accounts={accounts} onClick={selectAccount} />
                </div>
                <div className="text-center">
                  <FormMoneyInput value={amount} onChange={amountChange}/>
                </div>
                <div className="text-center mt-2">
                  <ToggleButton onClick={() => setToggle(!toggle)} checked={toggle}
                                checkedLabel={t('assets')} uncheckedLabel={t('debit')} id={'movement-type'}/>
                </div>
                <div className="text-center mt-2">
                  <button className={`rounded shadow border border-gray-100 focus:outline-none focus:shadow-outline ${isAddEntryEnabled() ? '' : 'opacity-50 cursor-not-allowed'}`}
                          onClick={addEntry} disabled={!isAddEntryEnabled()} type={'button'}>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 20 20" fill="green" fillOpacity="0.5" strokeOpacity="0.8">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} fillRule="evenodd" clipRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <TableV2 headers={headers} items={entries} displayFieldsName={selectedFields} onDelete={deleteEntry} onMove={moveEntry}/>
              </div>
            </FormSection>
          </div>

          <div className="mt-5 px-2 py-5 border-t border-gray-300">
            <FormSection label={t('details')} fixedHeight={36}>
              <textarea style={{ resize : 'none' }} rows={3} className="form-textarea block w-full h-full std-data-input"
                        placeholder={t('insert_description_tooltip')} value={description} onChange={descriptionChange}/>
            </FormSection>
          </div>

          <div className="px-2 py-5 border-t border-gray-300">
            <FormSection label={t('summary')} fixedHeight={'full'}>
              <div className="mb-3">
                <div className="flex justify-evenly">
                  <div className="text-center">
                    <p className="font-medium">{t('total_debit')}</p><p>{numberFormatter.format(debitTotal)}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{t('total_assets')}</p><p>{numberFormatter.format(assetsTotal)}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{t('total_diff')}</p><p>{numberFormatter.format(Math.abs(assetsTotal - debitTotal))}</p>
                  </div>
                </div>
              </div>
              <div className="pt-3 flex flex-row-reverse text-right border-t border-gray-300">
                <FormSubmit disabled={!isSubmitEnabled()}>
                  <p>{t('add_entry')}</p>
                </FormSubmit>
              </div>
            </FormSection>
          </div>

        </Form>
      </Formik>
    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {
  const groupedAccounts = await getGroupedAccounts(
    {
      AND: [
        {
          abstract_account: false
        },
        {
          enabled: true
        }
      ]
    },
    {
      account_balance: 'desc'
    });
  return {
    props: { accounts: groupedAccounts },
  };
}, null);
