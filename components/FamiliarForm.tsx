import { ErrorMessage, Field, Form, Formik } from 'formik';
import FormInput from '@components/FormInput';
import FormSubmit from '@components/FormSubmit';
import Validation from '@middlewares/validation';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export default function FamiliarForm({ onSubmit }) {

  const [t] = useTranslation();
  const validation = Validation(t, new Date());

  const familiarSchema = Yup.object().shape({
    name: validation.String('field.name.required'),
    lastname: validation.String('field.lastname.required'),
    identifier: validation.CUIL('field.cuil.required'),
    relationship: validation.String('field.relationship.required'),
    birth: validation.Date('field.birth.required'),
    annual_salary: validation.Number('field.income.positive')
  });

  const isFamiliarFormEnabled = (errors, touched) => {
    return Object.keys(errors).length !== 0 || Object.keys(touched).length === 0;
  };

  return(
    <Formik initialValues={{
      name: '',
      lastname: '',
      identifier: '',
      annual_salary: '',
      birth: '',
      relationship: '',
      handicap: false
    }} onSubmit={onSubmit} validationSchema={familiarSchema}>
      {({ errors, touched }) => (
        <Form>
          <div className="flex">
            <div className="px-2 mb-5 w-full">
              <p className="text-sm text-gray-700 font-bold mb-2">{t('employee.familiar.relationship')}</p>
              <Field as="select" name="relationship" className="px-3 py-2 w-48 std-data-input capitalize text-md text-gray-700">
                <option>(Selecionar)</option>
                <option>Conyuge</option>
                <option>Hijo</option>
              </Field>
              <p className="text-red-500 text-xs italic" style={{ padding: '5px 5px 0px 5px' }}>
                <ErrorMessage name="relationship"/>
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="px-2 w-full">
              <FormInput id={'name'} name={'name'} label={'employee.familiar.name'} placeholder={'employee.familiar.name'}/>
            </div>
          </div>
          <div className="flex">
            <div className="px-2 w-full">
              <FormInput id={'lastname'} name={'lastname'} label={'employee.familiar.lastname'} placeholder={'employee.familiar.lastname'}/>
            </div>
          </div>
          <div className="flex">
            <div className="px-2">
              <FormInput id={'identifier'} name={'identifier'} label={'employee.familiar.cuil'} placeholder={'employee.familiar.cuil'}/>
            </div>
          </div>
          <div className="flex">
            <div className="px-2">
              <FormInput id={'birth'} name={'birth'} label={'employee.familiar.birth'} placeholder={'employee.familiar.birth'}/>
            </div>
          </div>
          <div className="flex">
            <div className="px-2">
              <FormInput id={'annual_salary'} name={'annual_salary'} label={'employee.familiar.income'} placeholder={'employee.familiar.income'}/>
            </div>
          </div>
          <div className="flex">
            <div className="px-2">
              <label className="form-check-label inline-block text-sm text-gray-700 font-bold">
                {'Posee discapacidad '}
                <Field className="mr-5" type="checkbox" name={'handicap'}/>
              </label>
            </div>
          </div>
          <div className="pt-5 flex justify-center text-center">
            <FormSubmit disabled={isFamiliarFormEnabled(errors, touched)}>
              <p>{t('employee.add.new.familiar')}</p>
            </FormSubmit>
          </div>
        </Form>
      )}
    </Formik>
  );
}
