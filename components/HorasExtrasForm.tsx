import { ErrorMessage, Field, Form, Formik } from 'formik';
import FormInput from '@components/FormInput';
import FormSubmit from '@components/FormSubmit';
import Validation from '@middlewares/validation';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export default function ConceptoUnicoForm({ onSubmit }) {

  const [t] = useTranslation();
  const validation = Validation(t, new Date());

  const schema = Yup.object().shape({
    cantidad: validation.String('field.required'),
    tipo: validation.Number('field.required'),
    realizadas_en: validation.Date('field.required'),
    a_cobrar_en: validation.String('field.required')
  });

  const isEnabled = (errors, touched) => {
    return Object.keys(errors).length === 0 && Object.keys(touched).length !== 0;
  };

  return(
    <Formik initialValues={{
      cantidad: '',
      tipo: '',
      realizadas_en: '',
      a_cobrar_en: ''
    }} onSubmit={onSubmit} validationSchema={schema}>
      {({ errors, touched }) => (
        <Form>
          <div className="flex">
            <div className="px-2 w-full">
              <FormInput id={'cantidad'} name={'cantidad'} label={'Horas'} placeholder={'Cantidad de horas'}/>
            </div>
          </div>
          <div className="flex">
            <div className="px-2 mb-5 w-full">
              <p className="text-sm text-gray-700 font-bold mb-2">Tipo hora extra</p>
              <Field as="select" name="tipo" className="px-3 py-2 w-48 std-data-input capitalize text-md text-gray-700">
                <option value={''}>(Selecionar)</option>
                <option value={'50'}>50%</option>
                <option value={'100'}>100%</option>
              </Field>
              <p className="text-red-500 text-xs italic" style={{ padding: '5px 5px 0px 5px' }}>
                <ErrorMessage name="tipo"/>
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="px-2 w-full">
              <FormInput id={'realizadas_en'} name={'realizadas_en'} label={'Realizadas en'} placeholder={'Fecha (dd/mm/yyyy)'}/>
            </div>
          </div>
          <div className="flex">
            <div className="px-2 w-full">
              <FormInput id={'a_cobrar_en'} name={'a_cobrar_en'} label={'A Cobrar en'} placeholder={'Periodo (mm/yy)'}/>
            </div>
          </div>
          <div className="pt-5 flex justify-center text-center">
            <FormSubmit disabled={!isEnabled(errors, touched)}>
              <p>{t('Agregar horas extras')}</p>
            </FormSubmit>
          </div>
        </Form>
      )}
    </Formik>
  );
}
