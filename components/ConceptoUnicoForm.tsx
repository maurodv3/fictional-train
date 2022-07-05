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
    description: validation.String('field.required'),
    type: Yup.number().required('field.required'),
    period: validation.String('field.required'),
    amount: validation.Number('field.required')
  });

  const isEnabled = (errors, touched) => {
    return Object.keys(errors).length === 0 && Object.keys(touched).length !== 0;
  };

  return(
    <Formik initialValues={{
      description: '',
      type: '',
      period: '',
      amount: ''
    }} onSubmit={onSubmit} validationSchema={schema}>
      {({ errors, touched }) => (
        <Form>
          <div className="flex">
            <div className="px-2 w-full">
              <FormInput id={'description'} name={'description'} label={'Descripcion'} placeholder={'Descripcion del concepto'}/>
            </div>
          </div>
          <div className="flex">
            <div className="px-2 mb-5 w-full">
              <p className="text-sm text-gray-700 font-bold mb-2">Tipo concepto</p>
              <Field as="select" name="type" className="px-3 py-2 w-48 std-data-input capitalize text-md text-gray-700">
                <option value={''}>(Selecionar)</option>
                <option value={'1'}>Premio</option>
                <option value={'-1'}>Descuento</option>
              </Field>
              <p className="text-red-500 text-xs italic" style={{ padding: '5px 5px 0px 5px' }}>
                <ErrorMessage name="type"/>
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="px-2 w-full">
              <FormInput id={'period'} name={'period'} label={'A Cobrar/Descontar en'} placeholder={'Periodo (mm/yy)'}/>
            </div>
          </div>
          <div className="flex">
            <div className="px-2 w-full">
              <FormInput id={'amount'} name={'amount'} label={'Monto'} placeholder={'Monto a cobrar/descontar'}/>
            </div>
          </div>
          <div className="pt-5 flex justify-center text-center">
            <FormSubmit disabled={!isEnabled(errors, touched)}>
              <p>{t('Agregar concepto')}</p>
            </FormSubmit>
          </div>
        </Form>
      )}
    </Formik>
  );
}
