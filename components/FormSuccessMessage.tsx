import { useTranslation } from 'react-i18next';

export default function FormSuccessMessage({ show, message } :
  {
    show : boolean;
    message : string;
  }) {

  const [t] = useTranslation();

  return (
    <div className={`${show ? '' : 'hidden'} bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md mb-5`} role="alert">
      <div className="flex">
        <div>
          <svg className="h-6 w-6 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="font-bold">{t(message)}</p>
        </div>
      </div>
    </div>
  );
}
