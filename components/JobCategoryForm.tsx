import { Form, Formik } from 'formik';
import FormInput from '@components/FormInput';
import FormSubmit from '@components/FormSubmit';
import Validation from '@middlewares/validation';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export default function JobCategoryForm({ onSubmit }) {

  const [t] = useTranslation();
  const validation = Validation(t, new Date());

  const schema = Yup.object().shape({
    name: validation.String('field.required'),
    percentage_raise: Yup.number().required(),
    fixed_raise: Yup.number().required(),
  });

  const isEnabled = (errors, touched) => {
    return Object.keys(errors).length !== 0 || Object.keys(touched).length === 0;
  };

  return(
    <Formik initialValues={{
      name: '',
      percentage_raise: '0',
      fixed_raise: '0',
    }} onSubmit={onSubmit} validationSchema={schema}>
      {({ errors, touched }) => (
        <Form>
          <div className="flex">
            <div className="px-2 w-full">
              <FormInput id={'name'} name={'name'} label={'Categoria'} placeholder={'Nombre de categoria'}/>
            </div>
          </div>
          <div className="flex">
            <div className="px-2 w-full">
              <FormInput id={'fixed_raise'} name={'fixed_raise'} label={'Monto fijo'} placeholder={'Aumento monto fijo'}/>
            </div>
          </div>
          <div className="flex">
            <div className="px-2 w-full">
              <FormInput id={'percentage_raise'} name={'percentage_raise'} label={'Monto porcentual'} placeholder={'Aumento monto porcentual'}/>
            </div>
          </div>
          <div className="pt-5 flex justify-center text-center">
            <FormSubmit disabled={isEnabled(errors, touched)}>
              <p>{t('Agregar categoria')}</p>
            </FormSubmit>
          </div>
        </Form>
      )}
    </Formik>
  );
}
