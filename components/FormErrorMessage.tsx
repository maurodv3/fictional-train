import { useTranslation } from 'react-i18next';

export default function FormErrorMessage({ errors } :
  {
    errors : {
      msg: string;

    }[]
  }) {

  const [t] = useTranslation();

  return (
    <div className="bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md mb-5" role="alert">
      <div className="flex">
        <div>
          <svg className="h-6 w-6 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="font-bold">{t('entry.error')}</p>
          { errors.map((error, index) => <p key={index}> - {t(error.msg, error)}</p>) }
        </div>
      </div>
    </div>
  );
}
