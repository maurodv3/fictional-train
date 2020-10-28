import { GetServerSideProps } from 'next';
import withSecureAccess from '../lib/secured';
import Navbar from '../components/Navbar';
import { subMonths } from 'date-fns';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import { useEffect, useState } from 'react';
import { getDailyBook, getMasterBook } from '../handlers/book/bookService';
import { getAccounts, groupAccounts } from '../handlers/account/accountService';
import AccountSelect from '../components/AccountSelect';
import DailyBookTable from '../components/DailyBookTable';
import { useTranslation } from 'react-i18next';
import Table from '../components/Table';
import Account from '../handlers/account/Account';
import fetch from 'isomorphic-unfetch';
import MasterBookTable from '../components/MasterBookTable';
import {getNavTabs, getUserInfo} from '../handlers/user/userService';

export default function Book({ tabs, accounts, groupedAccounts, initialDailyBook, initialMasterBook, from, to, company }) {

  registerLocale('es', es);
  const [t] = useTranslation();

  const dailyBookHeader = [
    t('book.daily.detail.theader.number'),
    t('book.daily.detail.theader.date'),
    t('book.daily.detail.theader.detail'),
    t('book.daily.detail.theader.name'),
    t('book.daily.detail.theader.debit'),
    t('book.daily.detail.theader.assets'),
    t('book.daily.detail.theader.optType')
  ];
  const dailyType = t('book.daily');
  const masterType = t('book.master');

  const [selectedBook, setSelectedBook] = useState(dailyType);
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  const [selectedSummarizedAccount, setSelectedSummarizedAccount] = useState();
  const [fromDate, setFromDate] = useState(new Date(from));
  const [toDate, setToDate] = useState(new Date(to));
  const [dailyBook, setDailyBook] = useState(initialDailyBook);
  const [masterBook, setMasterBook] = useState(initialMasterBook);

  const dateChanged = async () => {
    await fetch(`/api/book?${new URLSearchParams({ from: fromDate.toISOString(), to: toDate.toISOString() })}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((res) => {
          setMasterBook(res.masterBook);
          setDailyBook(res.dailyBook);
        });
      } else {
        response.json().then(console.log);
      }
    });
  };

  useEffect(() => {
    dateChanged();
  }, [fromDate, toDate]);

  const selectAccount = (account: Account) => {
    setSelectedAccount(account);
    if (account === null) {
      return;
    }
    const summarizedAccount = masterBook.summary.filter(sum => sum.account.account_id === account.account_id)[0];
    if (summarizedAccount) {
      setSelectedSummarizedAccount(summarizedAccount);
    } else {
      setSelectedSummarizedAccount(null);
    }
  };

  const changeFrom = (date) => {
    setFromDate(date);
  };
  const changeTo = (date) => {
    setToDate(date);
  };

  const findAccount = (accountId) => {
    return accounts.filter(account => account.account_id === accountId)[0];
  };

  const mappers = {
    account_id: (accountId) => {
      const acc = findAccount(accountId);
      return `${acc.name} (${acc.account_id})`;
    }
  };

  return (
    <Navbar tabs={tabs}>
      <div className="mb-5 print-only text-md font-bold">
        <p>{t('book.print.company.name', { company: company.legal_name })}</p>
        <p>{t('book.print.selected.book', { selectedBook })}</p>
        <p>{t('book.print.period', { period: '2020' })}</p>
        <p>{t('book.print.from.to', { from: fromDate.toLocaleDateString(), to: toDate.toLocaleDateString() })}</p>
      </div>
      <div className="mb-5 relative border border-gray-100 rounded-md shadow-md bg-white no-print">
        <div className="flex h-24 rounded-sm px-4 py-4">
          <div className="mx-5">
            <p className="text-sm text-gray-700 font-bold mb-2">{t('book.search.bar.book')}</p>
            <select className="px-3 py-2 w-36 std-data-input capitalize text-md text-gray-700"
                    value={selectedBook} onChange={e => setSelectedBook(e.target.value)}>
              <option>{dailyType}</option>
              <option>{masterType}</option>
            </select>
          </div>
          <div className="mx-5">
            <p className="text-sm text-gray-700 font-bold mb-2">{t('book.search.bar.date.from')}</p>
            <DatePicker className="w-full py-2 px-3 std-data-input text-md text-gray-700"
                        locale="es" dateFormat="dd/MM/yyyy"
                        selected={fromDate}
                        onChange={changeFrom}
                        selectsStart
                        startDate={fromDate}
                        endDate={toDate}
                        maxDate={toDate}
            />
          </div>
          <div className="mx-5">
            <p className="text-sm text-gray-700 font-bold mb-2">{t('book.search.bar.date.to')}</p>
            <DatePicker className="w-full py-2 px-3 std-data-input text-md text-gray-700"
                        locale="es" dateFormat="dd/MM/yyyy"
                        selected={toDate}
                        onChange={changeTo}
                        selectsEnd
                        startDate={fromDate}
                        endDate={toDate}
                        minDate={fromDate}
            />
          </div>
          { selectedBook === masterType ? (
            <div className="mx-5">
              <p className="text-sm text-gray-700 font-bold mb-2">{t('book.search.bar.account')}</p>
              <AccountSelect selected={selectedAccount} accounts={groupedAccounts} onClick={selectAccount} showRemove={true}/>
            </div>
          ) : null }
        </div>
        <div className="absolute top-2 right-4 h-8 w-8 text-center">
          <button className="border border-gray-300 rounded-full bg-indigo-500 h-10 w-10 p-2 focus:outline-none focus:shadow-outline hover:bg-indigo-700" title={t('book.search.bar.export.tooltip')}
            onClick={() => window.print()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="whitesmoke">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2h2m3-4H9a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-1m-1 4l-3 3m0 0l-3-3m3 3V3" />
            </svg>
          </button>
        </div>
      </div>
      { selectedBook === dailyType ? (
        dailyBook && dailyBook.length !== 0 ? (
          <DailyBookTable
            headers={dailyBookHeader}
            startGroup={['entry_seat_id', 'date', 'description']}
            endGroup={['operation_type']}
            entries={dailyBook}
            optGroup={['account_id', 'debit', 'assets']}
            mappers={mappers}
          />
        ) : (
          <div className="text-center">
            <p className="pt-5 font-medium">{t('book.no.results.found')}</p>
          </div>
        )
      ) : null }
      { selectedBook === masterType ? (
          selectedAccount ? (
            selectedSummarizedAccount ? (
              <div>
                <Table
                  /*@ts-ignore*/
                  headers={[`${selectedSummarizedAccount.account.name} (${selectedSummarizedAccount.account.account_id})`, 'Debe', 'Haber', 'Saldo']}
                  /*@ts-ignore*/
                  values={selectedSummarizedAccount.summary}
                  selectedFields={['description', 'debit', 'assets', 'balance']}
                />
              </div>
              ) : (
                <div>
                  <p className="text-md font-bold mb-3 mt-3 ml-2">{t('book.account.no.movement')}</p>
                  <Table headers={[t('book.detail.theader.number'), t('book.detail.theader.name'), t('book.detail.theader.balance')]}
                         values={[selectedAccount]} selectedFields={['account_id', 'name', 'account_balance']}/>
                </div>
              )
            ) : (
              <MasterBookTable masterBook={masterBook}/>
            )
      ) : null }
    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const tabs = await getNavTabs(context);
  const [, company] = await getUserInfo(context);
  const accounts = await getAccounts();
  const groupedAccounts = groupAccounts(accounts);

  const defaultFrom = subMonths(new Date(), 1);
  const defaultTo = new Date();
  const dailyBook = await getDailyBook(defaultFrom, defaultTo);
  const masterBook = await getMasterBook(defaultFrom, defaultTo);

  return {
    props: {
      tabs,
      company,
      masterBook,
      accounts,
      groupedAccounts,
      from: defaultFrom.toDateString(),
      to: defaultTo.toDateString(),
      dailyBook: dailyBook.map((entry) => {
        entry['date'] = entry.creation_date.toLocaleString();
        delete entry.creation_date;
        return entry;
      })
    },
  };
}, null);
