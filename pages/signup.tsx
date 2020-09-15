import { Formik, Form, FormikHelpers } from 'formik';
import FormInput from '../components/FormInput';
import FormSubmit from '../components/FormSubmit';

interface Values {
  firstName: string;
  lastName: string;
  email: string;
}

export default function Signup() {
  return (
    <div className="w-full max-w-xs">
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
        }}
        onSubmit={(
            values: Values,
            { setSubmitting }: FormikHelpers<Values>,
        ) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 500);
        }}
      >
        <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <FormInput
            id={'firstName'}
            name={'firstName'}
            label={'First Name'}
            placeholder={'John'}
          />
          <FormInput
            id={'lastName'}
            name={'lastName'}
            label={'Last Name'}
            placeholder={'Doe'}
          />
          <FormInput
            id={'email'}
            name={'email'}
            label={'Email'}
            placeholder={'john@acme.com'}
            type={'email'}
          />
          <FormSubmit disabled={true}>Submit</FormSubmit>
        </Form>
      </Formik>
      <p className="text-center text-gray-500 text-xs">
        &copy;2020 Mauro Vidal
      </p>
    </div>
  );
}
