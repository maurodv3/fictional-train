import { useState } from 'react';
import { Transition } from '@tailwindui/react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export interface TabInfo {
  name: string;
  href: string;
  active: boolean;
}

export default function Navbar({ children, tabs, withHeader, displayName } :
  {
    children: object
    tabs: TabInfo[]
    withHeader?: object
    displayName?: string
  }) {

  const [t] = useTranslation();

  function buildTab(tab : TabInfo, index: number) {
    if (tab.active) {
      return (
        <Link href={tab.href} key={`link-${index}`}>
          <a className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700">
            {t(tab.name)}
          </a>
        </Link>
      );
    }
    return (
      <Link href={tab.href} key={`link-${index}`}>
        <a className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">
          {t(tab.name)}
        </a>
      </Link>
    );
  }
  function buildSmallTab(tab: TabInfo, index: number) {
    if (tab.active) {
      return (
        <Link href={tab.href} key={`link-${index}`}>
          <a className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 focus:outline-none
            focus:text-white focus:bg-gray-700">
            {t(tab.name)}
          </a>
        </Link>
      );
    }
    return (
      <Link href={tab.href} key={`link-${index}`}>
        <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700
          focus:outline-none focus:text-white focus:bg-gray-700">
          {t(tab.name)}
        </a>
      </Link>
    );
  }

  const [userMenuIsOpen, setUserMenuIsOpen] = useState(false);
  const [displaySmallView, setDisplaySmallView] = useState(false);

  return (
    <div>
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img className="h-8 w-8" src="https://tailwindui.com/img/logos/workflow-mark-on-dark.svg" alt="Workflow logo"/>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  { tabs.map(buildTab) }
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="ml-3 relative">
                  <div>
                    <button className="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-solid"
                            id="user-menu" aria-label="User menu" aria-haspopup="true" onClick={() => setUserMenuIsOpen(!userMenuIsOpen)}>
                      <img className="h-8 w-8 rounded-full"
                           src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                           alt=""/>
                    </button>
                  </div>
                  <Transition
                    enter={'transition ease-out duration-100'}
                    enterFrom={'transform opacity-0 scale-95'}
                    enterTo={'transform opacity-100 scale-100'}
                    leave={'transition ease-in duration-75'}
                    leaveFrom={'transform opacity-100 scale-100'}
                    leaveTo={'transform opacity-0 scale-95'}
                    show={userMenuIsOpen}
                  >
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
                      <div className="py-1 rounded-md bg-white shadow-xs" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                        <Link href="/logout">
                          <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">{t('logout')}</a>
                        </Link>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button onClick={() => setDisplaySmallView(!displaySmallView)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white">
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
                <svg className="hidden h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <Transition show={displaySmallView}>
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {tabs.map(buildSmallTab)}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5 space-x-3">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full"
                       src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                       alt=""/>
                </div>
                <div className="space-y-1">
                  <div className="text-base font-medium leading-none text-white">{ displayName ? displayName : 'undefined' }</div>
                </div>
              </div>
              <Link href="/logout">
                <div className="mt-3 px-2 space-y-1">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700">{t('logout')}</a>
                </div>
              </Link>
            </div>
          </div>
        </Transition>
      </nav>
      { withHeader ?
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              { withHeader }
            </h1>
          </div>
        </header>
        : null }
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          { children }
        </div>
      </main>
    </div>
  );
}
