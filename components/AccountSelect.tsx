import { useState } from 'react';
import { Transition } from '@tailwindui/react';
import Account from '../model/Account';
import { useTranslation } from 'react-i18next';

function Options({ options, onClick }) {
  return (
    <div>
      {options.map(([type , group], i) => {
        return (
          <div key={`${type}-${i}`}>
            <div className="border-b border-t border-gray-200">
              <p className="px-4 py-2 font-bold capitalize">{type.toLowerCase()}</p>
            </div>
            <div className="py-1">
              {
                group.map((account, j) => {
                  return (
                    <a className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 cursor-pointer"
                       onClick={onClick} key={`${account.account_id}-${i}-${j}`}>
                      {`${account.name} (${account.account_id})`}
                    </a>
                  );
                })
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AccountSelect({ accounts, onClick } :
  {
    accounts : Record<string, Account[]>,
    onClick: object
  }) {

  const [t] = useTranslation();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState(Object.entries(accounts));

  const search = (e) => {
    let searchTerm = e.currentTarget.value;
    const all = Object.entries(accounts);
    if (searchTerm) {
      searchTerm = searchTerm.toLowerCase();
      const newResults: Record<string, Account[]> = {};
      for (const result of all) {
        const [key, values] = result;
        for (const value of values) {
          if (value.name.toLowerCase().includes(searchTerm)) {
            if (newResults[key]) {
              newResults[key].push(value);
            } else {
              newResults[key] = [];
              newResults[key].push(value);
            }
          }
        }
      }
      setResults(Object.entries(newResults));
      return;
    }
    setResults(all);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <span className="rounded-md shadow-sm">
          <button type="button" className="inline-flex justify-center w-64 px-4 py-2 text-sm font-medium leading-5 transition ease-in-out duration-150 std-data-input bg-white"
                  id="options-dropdown" aria-haspopup="true" aria-expanded="true" onClick={e => setOpen(!open)} >
            { selected ? selected : t('select_account')}
            <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </span>
      </div>
      <Transition
        enter={'transition ease-out duration-100'}
        enterFrom={'transform opacity-0 scale-95'}
        enterTo={'transform opacity-100 scale-100'}
        leave={'transition ease-in duration-75'}
        leaveFrom={'transform opacity-100 scale-100'}
        leaveTo={'transform opacity-0 scale-95'} show={open}>
        <div className="origin-top-right absolute right-0 mt-2 mb-2 w-64 rounded-md shadow-lg z-10">
          <div className="rounded-md bg-white shadow-xs" aria-orientation="vertical">
            <div className="px-3 py-3 relative mx-auto text-gray-600">
              <input className="w-full border-2 border-gray-300 bg-white h-10 px-2 pr-8 rounded text-sm focus:outline-none" autoComplete="off"
                      // @ts-ignore onsearch not supported yet
                     type="search" name="search" placeholder={t('search_placeholder')} ref={element => (element || {}).onsearch = search}/>
              <button type="submit" className="absolute right-0 top-0 mt-6 mr-6">
                <svg className="text-gray-600 h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                     version="1.1" id="search-icon" x="0px" y="0px" viewBox="0 0 56.966 56.966" xmlSpace="preserve" width="512px" height="512px">
                  <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"/>
                </svg>
              </button>
            </div>
            <Options options={results} onClick={() => onClick}/>
          </div>
        </div>
      </Transition>
    </div>
  );
}
