import withSession from '../lib/session';
import React from 'react';
import Navbar, { TabInfo } from '../components/Navbar';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const tabs : TabInfo[] = [
  { name: 'tab_actions', href: '/', active: true },
  { name: 'tab_entries', href: '/book_entry', active: false },
  { name: 'tab_books', href: '/book', active: false },
  { name: 'tab_accounts', href: '/account', active: false }
];

export default function Home() {

  const [t] = useTranslation();

  return (
    <div>
      <Navbar tabs={tabs}>
        <div className="py-12 bg-white">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <p className="text-base leading-6 text-indigo-600 font-semibold tracking-wide uppercase">{t('brand_name')}</p>
              <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
                {t('main_subtitle')}
              </h3>
              <p className="mt-4 max-w-2xl text-xl leading-7 text-gray-500 lg:mx-auto">
                {t('main_introduction')}
              </p>
            </div>

            <div className="mt-10">
              <ul className="md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">

                <Link href="/book_entry">
                  <li className="cursor-pointer">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg leading-6 font-medium text-gray-900">{t('main_action_add_entry')}</h4>
                        <p className="mt-2 text-base leading-6 text-gray-500">
                          {t('main_action_add_entry_desc')}
                        </p>
                      </div>
                    </div>
                  </li>
                </Link>

                <Link href="/book">
                  <li className="mt-10 md:mt-0 cursor-pointer">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg leading-6 font-medium text-gray-900">{t('main_action_view_books')}</h4>
                        <p className="mt-2 text-base leading-6 text-gray-500">
                          {t('main_action_view_books_desc')}
                        </p>
                      </div>
                    </div>
                  </li>
                </Link>

                <Link href="/account">
                  <li className="mt-10 md:mt-0 cursor-pointer">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg leading-6 font-medium text-gray-900">{t('main_action_manage_accounts')}</h4>
                        <p className="mt-2 text-base leading-6 text-gray-500">
                          {t('main_action_manage_accounts_desc')}
                        </p>
                      </div>
                    </div>
                  </li>
                </Link>

                <Link href="/logout">
                  <li className="mt-10 md:mt-0 cursor-pointer">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                          <svg className="h-6 w-6" fill="none" viewBox="-2 -2 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm5-11H5v2h10V9z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg leading-6 font-medium text-gray-900">{t('main_action_close_session')}</h4>
                        <p className="mt-2 text-base leading-6 text-gray-500">
                          {t('main_action_close_session_desc')}
                        </p>
                      </div>
                    </div>
                  </li>
                </Link>

              </ul>
            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
}

export const getServerSideProps = withSession(async ({ req, res }) => {
  const user = req.session.get('user');

  if (user === undefined) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: { user: req.session.get('user') },
  };
});
