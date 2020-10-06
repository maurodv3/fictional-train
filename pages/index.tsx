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

interface Card {
  href: string;
  title_key: string;
  description_key: string;
  icon: object;
}

const cards : Card[] = [
  {
    href: '/book_entry',
    title_key: 'main_action_add_entry',
    description_key: 'main_action_add_entry_desc',
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    href: '/book',
    title_key: 'main_action_view_books',
    description_key: 'main_action_view_books_desc',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
      </svg>
    )
  },
  {
    href: '/account',
    title_key: 'main_action_manage_accounts',
    description_key: 'main_action_manage_accounts_desc',
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    href: '/logout',
    title_key: 'main_action_close_session',
    description_key: 'main_action_close_session_desc',
    icon: (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    )
  },
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
                {cards.map((card, index) => {
                  return (
                    <Link href={card.href}>
                      <li className="mt-10 md:mt-0 cursor-pointer" key={`card-${index}`}>
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                              {card.icon}
                            </div>
                          </div>
                          <div className="ml-4">
                            <h4 className="text-lg leading-6 font-medium text-gray-900">{t(card.title_key)}</h4>
                            <p className="mt-2 text-base leading-6 text-gray-500">
                              {t(card.description_key)}
                            </p>
                          </div>
                        </div>
                      </li>
                    </Link>
                  );
                })}
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
