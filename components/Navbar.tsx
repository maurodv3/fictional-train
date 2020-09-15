import Link from 'next/link';

export default function Navbar() {
  return (
    <div>
      <nav className="flex items-center justify-between flex-wrap bg-blue-500 p-4">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold font-mono text-xl tracking-tight">Balbinator 3000</span>
        </div>

        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-md lg:flex-grow">
            <Link href="/">
              <a className="block mt-4 lg:inline-block lg:mt-0 text-blue-100 hover:text-white mr-4">
                Asientos
              </a>
            </Link>
            <Link href="/">
              <a className="block mt-4 lg:inline-block lg:mt-0 text-blue-100 hover:text-white mr-4">
                Libros
              </a>
            </Link>
            <Link href="/account">
              <a className="block mt-4 lg:inline-block lg:mt-0 text-blue-100 hover:text-white">
                Cuentas
              </a>
            </Link>
          </div>
          <div>
            <a href="#"
               className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-blue-500 hover:bg-white mt-4 lg:mt-0">
              Salir
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
