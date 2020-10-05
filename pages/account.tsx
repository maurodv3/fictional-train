import { GetServerSideProps } from 'next';
import { PrismaClient } from '@prisma/client';
import Table from '../components/Table';
import withSecureAccess from '../lib/secured';
import Navbar, { TabInfo } from '../components/Navbar';

const tabs : TabInfo[] = [
  { name: 'tab_actions', href: '/', active: false },
  { name: 'tab_entries', href: '/book_entry', active: false },
  { name: 'tab_books', href: '/book', active: false },
  { name: 'tab_accounts', href: '/account', active: true }
];

export default function Account({ accounts }) {

  const tableHeader : string[] = ['Numero', 'Nombre', 'Saldo actual'];
  const selectedFields : string[] = ['account_id', 'name', 'account_balance'];

  return (
    <div>
      <Navbar tabs={tabs}>
        <Table headers={tableHeader} values={accounts} selectedFields={selectedFields}/>
      </Navbar>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {
  const prisma = new PrismaClient();
  const accounts = await prisma.accounts.findMany();
  return {
    props: { accounts },
  };
}, 'MANAGE_ACCOUNTS');
