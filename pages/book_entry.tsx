import Navbar, { TabInfo } from '../components/Navbar';
import { useTranslation } from 'react-i18next';

const tabs : TabInfo[] = [
  { name: 'tab_actions', href: '/', active: false },
  { name: 'tab_entries', href: '/book_entry', active: true },
  { name: 'tab_books', href: '/book', active: false },
  { name: 'tab_accounts', href: '/account', active: false }
];

export default function BookEntry() {

  const [t] = useTranslation();
  const header = <p>{t('book_entry_title')}</p>;

  return (
    <Navbar withHeader={header} tabs={tabs}>

        <div className="px-2">
          <div className="flex flex-wrap -mx-2">
            <div className="w-1/4 px-2">
              <div className="bg-gray-800 h-36 px-4 py-4 rounded-sm">
                <p className="text-xl text-gray-300">{t('details')}</p>
              </div>
            </div>
            <div className="w-3/4 px-2">
              <div className="bg-gray-400 h-36 rounded-sm px-4 py-4">
                <textarea style={{ resize : 'none' }}
                          rows={3}
                          className="form-textarea block w-full h-full"
                          placeholder={t('insert_description_tooltip')}/>
              </div>
            </div>
          </div>
        </div>

        <div className="px-2 mt-3">
          <div className="flex flex-wrap -mx-2">
            <div className="w-1/4 px-2">
              <div className="bg-gray-800 px-4 py-4 rounded-sm h-full">
                <p className="text-xl text-gray-300">{t('account_and_amount')}</p>
              </div>
            </div>
            <div className="w-3/4 px-2">
              <div className="bg-gray-400 rounded-sm px-4 py-4">
                <div className="grid grid-flow-row grid-cols-2 gap-4">
                  <div>
                    <div className="relative">
                      <select
                        className="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-state">
                        <option>(100) Activos</option>
                        <option>(200) Pasivos</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm sm:leading-5">
                          $
                        </span>
                      </div>
                      <input id="price" className="pl-7 pr-12 sm:text-sm sm:leading-5 appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" placeholder="0.00"/>
                    </div>
                  </div>
                  <div className="pl-4">
                    <div className="relative">
                      <select
                        className="block appearance-none w-full border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-state">
                        <option>(100) Activos</option>
                        <option>(200) Pasivos</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm sm:leading-5">
                          $
                        </span>
                      </div>
                      <input id="price" className="pl-7 pr-12 sm:text-sm sm:leading-5 appearance-none block w-full text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" placeholder="0.00"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-2 mt-3">
          <div className="flex flex-wrap -mx-2">
            <div className="w-1/4 px-2">
              <div className="bg-gray-800 px-4 py-4 rounded-sm h-full">
                <p className="text-xl text-gray-300">{t('summary')}</p>
              </div>
            </div>
            <div className="w-3/4 px-2">
              <div className="bg-gray-400 rounded-sm px-4 py-4">
                  <p><strong>Total: $ 1234.50</strong></p>
                  <button>OK</button>
              </div>
            </div>
          </div>
        </div>

      </Navbar>
  );
}
