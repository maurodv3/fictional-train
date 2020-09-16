import { Formik, Form, FormikHelpers } from 'formik';
import FormInput from '../components/FormInput';
import FormSubmit from '../components/FormSubmit';
import * as Yup from 'yup';
import fetch from 'isomorphic-unfetch';
import useUser from '../lib/useUser';
import { useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
        .required('El nombre de usuario es obligatorio.'),
  password: Yup.string()
        .required('La contraseña es obligatoria.'),
});

interface Values {
  username: string;
  password: string;
}

function isButtonDisabled(errors, touched) {
  return Object.keys(errors).length !== 0 || Object.keys(touched).length === 0;
}

export default function Login() {

  const [errorMsg, setErrorMsg] = useState('');

  const { mutateUser } = useUser({
    redirectTo: '/',
    redirectIfFound: true,
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
      setErrorMsg('El usuario y/o la contraseña son invalidos.');
    }
    setSubmitting(false);
  }

  return (
    <div className="rounded-t-lg overflow-hidden border-t border-l border-r border-gray-400 px-3 py-10 flex justify-center ">
      <div className="w-full max-w-md">
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
                label={'Usuario'}
                placeholder={'usuario_68'}
              />
              <FormInput
                id={'password'}
                name={'password'}
                label={'Contraseña'}
                placeholder={'******'}
                type={'password'}
              />
              <FormSubmit disabled={isButtonDisabled(errors, touched)}>
                <p>Iniciar Sesion</p>
              </FormSubmit>
              { errorMsg ?
                <ErrorMessage><p>El usuario y/o la contraseña son invalidos.</p></ErrorMessage>
                : null }
            </Form>
          )}
        </Formik>
        <p className="text-center text-gray-500 text-xs">
          &copy;2020 Mauro Vidal
        </p>
      </div>
    </div>
  );
}
