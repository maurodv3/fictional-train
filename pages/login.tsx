import { Formik, Form, FormikHelpers } from 'formik';
import FormInput from '../components/FormInput';
import FormSubmit from '../components/FormSubmit';
import * as Yup from 'yup';
import fetch from 'isomorphic-unfetch';
import useUser from '../lib/useUser';
import { useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import { useTranslation } from 'react-i18next';

interface Values {
  username: string;
  password: string;
}

function isButtonDisabled(errors, touched) {
  return Object.keys(errors).length !== 0 || Object.keys(touched).length === 0;
}

export default function Login() {

  const [t] = useTranslation();
  const [errorMsg, setErrorMsg] = useState('');

  const { mutateUser } = useUser({
    redirectTo: '/',
    redirectIfFound: true,
  });

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .required(t('login_username_required')),
    password: Yup.string()
      .required(t('login_password_required')),
  });

  async function handleSubmit(values: Values, { setSubmitting }: FormikHelpers<Values>) {
    try {
      await mutateUser(
        fetch('http://localhost:3001/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        }).then((response) => {
          if (response.status === 200) {
            return response.json();
          }
          throw new Error('Login fail.');
        }),
      );
    } catch (error) {
      console.error(error);
      setErrorMsg(t('login_invalid_data_msg'));
    }
    setSubmitting(false);
  }

  return (
    <div className="rounded-t-lg overflow-hidden border-t border-l border-r border-gray-400 px-3 py-10 flex justify-center ">
      <div className="w-full max-w-md">
        <div className="flex justify-center text-center mb-5">
          <img className="h-24 w-24" src="https://tailwindui.com/img/logos/workflow-mark-on-dark.svg" alt="Workflow logo"/>
        </div>
        <div className="flex justify-center text-center mb-5">
          <p className="text-indigo-500 text-xl font-mono font-bold">{t('brand_name')}</p>
        </div>
        <Formik
          initialValues={{
            username: '',
            password: '',
          }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4">
              <FormInput
                id={'username'}
                name={'username'}
                label={'login_username_field'}
                placeholder={'login_username_field_placeholder'}
              />
              <FormInput
                id={'password'}
                name={'password'}
                label={'login_password_field'}
                placeholder={'login_password_field_placeholder'}
                type={'password'}
              />
              <FormSubmit disabled={isButtonDisabled(errors, touched)}>
                <p>{t('login')}</p>
              </FormSubmit>
              { errorMsg ?
                <ErrorMessage><p>{t('login_invalid_data_msg')}</p></ErrorMessage>
                : null }
            </Form>
          )}
        </Formik>
        <p className="text-center text-gray-500 text-xs">
          {t('copyright')}
        </p>
      </div>
    </div>
  );
}
