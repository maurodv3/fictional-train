import Navbar from '@components/Navbar';
import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import Link from 'next/link';

const buttons = <Link href={'/employee/1'}>
  <button className="rounded-full h-6 w-6 focus:outline-none">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="indigo">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  </button>
</Link>;

export default function Index({ tabs }) {
  return (
    <Navbar tabs={tabs}>
      <div className="mb-5 relative border border-gray-100 rounded-md shadow-md bg-white no-print">
        <div className="flex h-24 rounded-sm px-4 py-4">
          <div className="mx-5">
            <p className="text-sm text-gray-700 font-bold mb-2">Area</p>
            <select className="px-3 py-2 w-36 std-data-input capitalize text-md text-gray-700">
              <option>-</option>
              <option>Ventas</option>
              <option>Compras</option>
              <option>Distribucion</option>
            </select>
          </div>
        </div>
        <div className="absolute top-2 right-4 h-8 w-8 text-center">
          <Link href={'/employee/add'}>
            <button className="border border-gray-300 rounded-full bg-indigo-500 h-10 w-10 p-2 focus:outline-none focus:shadow-outline hover:bg-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="whitesmoke">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col mb-5">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puesto
                  </th>
                  <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  </th>
                  <th scope="col" className="px-6 py-3 bg-gray-50">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full"
                             src="https://i.insider.com/5682a0d9c08a8081028b56f8?width=500&format=jpeg&auto=webp"
                             alt=""/>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Luke Skywalker
                        </div>
                        <div className="text-sm text-gray-500">
                          luke.skywalker@b3000.com
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Jefe de ventas</div>
                    <div className="text-sm text-gray-500">Ventas</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Activo
                </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={'/employee/1'}>
                      <a className="text-indigo-600 hover:text-indigo-900">Más</a>
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full"
                             src="https://imagenes.20minutos.es/files/image_656_370/uploads/imagenes/2020/01/23/chewbacca.jpeg"
                             alt=""/>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Chewbacca
                        </div>
                        <div className="text-sm text-gray-500">
                          chewbacca@b3000.com
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Repartidor</div>
                    <div className="text-sm text-gray-500">Distribucion</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Activo
                </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={'/employee/1'}>
                      <a className="text-indigo-600 hover:text-indigo-900">Más</a>
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full"
                             src="https://cnet2.cbsistatic.com/img/q0txpjSZ7Gw1oUyZzORHNG9fBFw=/1200x675/2016/05/03/0f31fc0a-89a0-43ea-9a7e-0d9324ab7cf2/hansolo2.jpg"
                             alt=""/>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Han Solo
                        </div>
                        <div className="text-sm text-gray-500">
                          han.solo@b3000.com
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Repartidor</div>
                    <div className="text-sm text-gray-500">Distribucion</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                  En vacaciones
                </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={'/employee/1'}>
                      <a className="text-indigo-600 hover:text-indigo-900">Más</a>
                    </Link>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-5 relative border border-gray-100 rounded-md shadow-md bg-white no-print">
        <div className="flex rounded-sm px-4 py-4">
          <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4">
            Generar Recibos
          </button>
          <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4">
            Confirmar Depositos
          </button>
        </div>
      </div>
    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const tabs = await UserService.getNavTabs(context);

  return {
    props: {
      tabs
    }
  };
}, null);
