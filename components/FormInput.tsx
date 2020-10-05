import { ErrorMessage, Field } from 'formik';
import { useTranslation } from 'react-i18next';

export default function FormInput({ id, name, label, placeholder, type } :
    {
      id: string
      name: string
      label : string
      placeholder : string
      type?: string,
    }) {

  const [t] = useTranslation();

  return (
        <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
                {t(label)}
            </label>
            <Field
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={id}
                name={name}
                placeholder={t(placeholder)}
                type={type === null ? 'text' : type}
            />
            <p className="text-red-500 text-xs italic" style={{ padding: '5px 5px 0px 5px' }}>
                  <ErrorMessage name={name}/>
            </p>
        </div>
  );
}
