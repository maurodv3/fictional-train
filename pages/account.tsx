import Navbar from '../components/Navbar';
import { GetServerSideProps } from 'next';
import { PrismaClient } from '@prisma/client';
import Table from '../components/Table';

export default function Account({ accounts }) {
  return (
    <div>
      <Navbar/>
      <div className="rounded-t-lg overflow-hidden border-t border-l border-r border-gray-400 px-3 py-10 flex justify-center ">
        <div className="w-full max-w-xl">
          <Table headers={['Numero', 'Nombre', 'Saldo actual']} values={accounts} selectedFields={['account_id', 'name', 'account_balance']}/>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const prisma = new PrismaClient();
  const accounts = await prisma.accounts.findMany();
  return {
    props: { accounts },
  };
};
