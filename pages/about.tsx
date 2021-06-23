import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import Navbar from '@components/Navbar';
import { useTranslation } from 'react-i18next';
import UserService from '@services/UserService';

export default function About({ entity, tabs }) {

  const [t] = useTranslation();

  return (
    <Navbar tabs={tabs}>
      <div>
        <div className="mb-7">
          <p className="mb-4 text-xl font-medium border-b border-indigo-700">
            {t('about.info')}
            <svg className="w-6 h-6 ml-1 pb-1 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </p>
          <div className="ml-2">
            <p className="font-medium">{t('about.identifier')}</p>
            <p className="mb-1">{entity.identifier}</p>
            <p className="font-medium">{t('about.legal.name')}</p>
            <p className="mb-1">{entity.legal_name}</p>
            <p className="font-medium">{t('about.address')}</p>
            <p className="mb-1">{entity.address}</p>
            <p className="font-medium">{t('about.email')}</p>
            <p className="mb-1">
              <svg className="w-5 h-5 mr-1 inline-block text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a className="underline text-blue-600" href={`mailto:${entity.email_address}`}>{entity.email_address}</a>
            </p>
          </div>
        </div>
        <div>
          <p className="mb-4 text-xl font-medium border-b border-indigo-700">
            {t('about.liables')}
            <svg className="w-6 h-6 ml-1 pb-1 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </p>
          <div className="ml-2">
            { entity.entity_liable.map((liable, index) => (
              <div key={index} className="mb-3">
                <p className="font-medium">{liable.first_name} {liable.last_name}</p>
                <p>
                  <svg className="w-5 h-5 mr-1 inline-block text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a className="underline text-blue-600" href={`mailto:${liable.email_address}`}>{liable.email_address}</a>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {
  const [, entity] = await UserService.getUserInfo(context);
  const tabs = await UserService.getNavTabs(context);
  return {
    props: {
      entity,
      tabs
    },
  };
}, null);
