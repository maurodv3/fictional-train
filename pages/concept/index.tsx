import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import { toModel } from '@model/recibo/v2/ConceptoMapper';
import Table from '@components/Table';
import Navbar from '@components/Navbar';
import Link from 'next/link';
import { useState } from 'react';
import ConceptService from '@services/ConceptService';

export default function Index({ tabs, concepts }) {

  const mappedConcepts = concepts.map(toModel);
  const [searchConcepts, setSearchConcepts] = useState(mappedConcepts);
  const search = (e) => {
    if (e.target.value === '') {
      setSearchConcepts(mappedConcepts);
    } else {
      const result = mappedConcepts.filter(concept =>
        concept.nombre.toLowerCase().includes(e.target.value.toLowerCase()));
      setSearchConcepts(result);
    }
  };

  const toTipo = (tipo) => {
    switch (tipo) {
      case 0: return 'Fijo';
      case 1: return '%';
      case 2: return 'Calculado';
      case 3: return 'Por tabla';
    }
  };

  const toUnidad = (unidad) => {
    switch (unidad) {
      case 0: return 'Hora';
      case 1: return 'Dia';
      case 2: return 'Porcentaje';
      case 3: return 'Otro';
    }
  };

  const toColumna = (col) => {
    switch (col) {
      case 0: return 'Remunerativo';
      case 1: return 'No remunerativo';
      case 2: return 'Deduccion';
    }
  };

  const toTable = (concept) => {
    const renamed = { ...concept };
    renamed['tipoConcepto'] = toTipo(concept['tipoConcepto']);
    renamed['unidad'] = toUnidad(concept['unidad']);
    renamed['columna'] = toColumna(concept['columna']);
    renamed.actions = (
      <Link href={`/concept/edit/${concept.id}`}>
        <button className="px-2 py-1 whitespace-nowrap text-right text-sm font-medium text-indigo-600 hover:text-indigo-900">
          <p>Editar</p>
        </button>
      </Link>
    );
    return renamed;
  };

  return (
    <Navbar tabs={tabs}>
      <div className="mb-5 relative border border-gray-100 rounded-md shadow-md bg-white no-print">
        <div className="flex h-24 rounded-sm px-4 py-4">
          <div className="mx-5">
            <p className="text-sm text-gray-700 font-bold mb-2">Conceptos</p>
            <input className="w-full py-2 px-3 std-data-input" onChange={search} placeholder="Buscar..."/>
          </div>
        </div>
        <div className="absolute top-2 right-4 h-8 w-8 text-center">
          <Link href={'/concept/add'}>
            <button className="border border-gray-300 rounded-full bg-indigo-500 h-10 w-10 p-2 focus:outline-none focus:shadow-outline hover:bg-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="whitesmoke">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
      <div>
        <Table
          headers={['Codigo', 'Nombre', 'Modalidad', 'Unidad', 'Tipo', 'Acciones']}
          values={searchConcepts.map(toTable)}
          selectedFields={['codigo', 'nombre', 'tipoConcepto', 'unidad', 'columna', 'actions']}
        />
      </div>
    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const tabs = await UserService.getNavTabs(context);
  const concepts = await ConceptService.getConcepts();

  return {
    props: {
      tabs,
      concepts,
    }
  };
}, null);
