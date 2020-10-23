import { useTranslation } from 'react-i18next';
import Table from './Table';

export default function MasterBookTable({ masterBook }) {

  const [t] = useTranslation();
  const headers = [
    t('book.detail.theader.number'),
    t('book.detail.theader.name'),
    t('book.detail.theader.balance')
  ];

  return (
    <div>
      <p className="text-md font-bold mb-3 mt-3 ml-2">{t('book.account.movements')}</p>
      { masterBook.summary.map((accountSummary) => {
        return (
          <div key={`summary-${accountSummary.account.account_id}`}>
            <Table
              headers={[`${accountSummary.account.name} (${accountSummary.account.account_id})`, t('debit'), t('assets'), t('balance')]}
              values={accountSummary.summary}
              selectedFields={['description', 'debit', 'assets', 'balance']}
            />
            <br/>
          </div>
        );
      })}
      <p className="text-md font-bold mb-3 mt-3 ml-2">{t('book.account.no.movements')}</p>
      <Table headers={headers} values={masterBook.withoutMovement} selectedFields={['account_id', 'name', 'account_balance']}/>
    </div>
  );
}
