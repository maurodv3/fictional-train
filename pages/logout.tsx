import { useEffect } from 'react';
import withSession from '@middlewares/session';
import { useTranslation } from 'react-i18next';

export default function Logout() {

  const [t] = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="rounded-t-lg overflow-hidden border-t border-l border-r border-gray-400 px-3 py-10 flex justify-center">
      <div className="w-full max-w-xl text-center">
        <p className="text-xl font-bold">{t('logout_success')}</p>
        <p>{t('logout_success_desc')}</p>
      </div>
    </div>
  );

}

export const getServerSideProps = withSession(async ({ req }) => {
  req.session.destroy();
  return {
    props: {  },
  };
});
