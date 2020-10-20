import { GetServerSideProps } from 'next';
import withSecureAccess from '../lib/secured';
import Navbar, { TabInfo } from '../components/Navbar';
import prisma  from '../prisma/prisma';
import { subMonths } from 'date-fns';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import { useState } from 'react';

const tabs : TabInfo[] = [
  { name: 'tab_actions', href: '/', active: false },
  { name: 'tab_entries', href: '/book_entry', active: false },
  { name: 'tab_books', href: '/book', active: true },
  { name: 'tab_accounts', href: '/account', active: false }
];

function BookTable({ headers, entry, operations, startGroup, endGroup, optGroup }) {

  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          { headers.map(header => <th className="border px-4 py-2">{header}</th>) }
        </tr>
      </thead>
      <tbody>
      { operations.map((operation, index) => {
        return (
          index === 0 ? (
          <tr>
            { startGroup.map(field => <td className="border px-2 py-1" rowSpan={operations.length}>{entry[field]}</td>) }
            { optGroup.map(field => <td className="border px-2 py-1">{operation[field]}</td>) }
            { endGroup.map(field => <td className="border px-2 py-1" rowSpan={operations.length}>{entry[field]}</td>) }
          </tr>
          ) : (
            <tr>
              { optGroup.map(field => <td className="border px-2 py-1">{operation[field]}</td>) }
            </tr>
          )
        );
      })}
      </tbody>
    </table>
  );
}

export default function Book({ results, from, to }) {

  registerLocale('es', es);
  const [selectedBook, setSelectedBook] = useState('Diario');
  const [fromDate, setFromDate] = useState(new Date(from));
  const [toDate, setToDate] = useState(new Date(to));

  const changeFrom = date => setFromDate(date);
  const changeTo = date => setToDate(date);

  return (
    <Navbar tabs={tabs}>
      <div className="mb-5 border border-gray-100 rounded-md shadow-md bg-white">
        <div className="flex h-24 rounded-sm px-4 py-4">
          <div className="mx-5">
            <p className="text-sm text-gray-700 font-bold mb-2">Libro</p>
            <select className="px-3 py-2 w-36 std-data-input capitalize text-sm text-gray-700"
                    value={selectedBook} onChange={e => setSelectedBook(e.target.value)}>
              <option>Diario</option>
              <option>Mayor</option>
            </select>
          </div>
          <div className="mx-5">
            <p className="text-sm text-gray-700 font-bold mb-2">Desde</p>
            <DatePicker className="w-full py-2 px-3 std-data-input text-sm text-gray-700"
                        locale="es" dateFormat="dd/MM/yyyy" selected={fromDate} onChange={changeFrom} />
          </div>
          <div className="mx-5">
            <p className="text-sm text-gray-700 font-bold mb-2">Hasta</p>
            <DatePicker className="w-full py-2 px-3 std-data-input text-sm text-gray-700"
                        locale="es" dateFormat="dd/MM/yyyy" selected={toDate} onChange={changeTo} />
          </div>
          { selectedBook === 'Mayor' ? (
            <div className="mx-5">
              <p className="text-sm text-gray-700 font-bold mb-2">Cuenta</p>
              <select className="px-3 py-2 w-36 std-data-input capitalize text-sm text-gray-700">
                <option>Caja</option>
              </select>
            </div>
          ) : null }
        </div>
      </div>
      <BookTable headers={['Numero', 'Detalle', 'Fecha', 'Cuenta', 'Debe', 'Haber', 'Tipo']}
                 startGroup={['id', 'date', 'details']}
                 endGroup={['type']}
                 entry={{
                   id: '1',
                   details: 'Venta a credito',
                   date: '14/10/2020',
                   type: 'Modificativa',
                 }}
                 operations={[
                   { account: 'Deudas por ventas', debit: 120000, assets: null },
                   { account: 'Venta', debit: null, assets: 120000 },
                   { account: 'CMV', debit: 80000, assets: null },
                   { account: 'Mercaderias', debit: null, assets: 80000 },
                 ]}
                 optGroup={['account', 'debit', 'assets']}
      />
    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {
  const defaultFrom = subMonths(new Date(), 1);
  const defaultTo = new Date();
  const results = await prisma.entry_seats.findMany({
    where: {
      AND: [
        {
          creation_date: {
            gte: defaultFrom
          }
        },
        {
          creation_date: {
            lte: defaultTo
          }
        }
      ]
    },
    include: {
      entry_seat_lines: true
    }
  });
  return {
    props: { from: defaultFrom.toDateString(), to: defaultTo.toDateString(), results: JSON.stringify(results) },
  };
}, null);
