import { Form, Formik, Field } from 'formik';
import FormSubmit from '@components/FormSubmit';
import { useTranslation } from 'react-i18next';

export default function JobConceptSelect({ onSubmit, selected, concepts }) {

  const [t] = useTranslation();
  const mappedConcepts = concepts.map((concept) => {
    return {
      id: concept.concepto_id,
      displayName: `(${concept.codigo}) ${concept.nombre}`,
      checked: selected.includes(String(concept.concepto_id))
    };
  });

  const values = {};
  mappedConcepts.forEach((concept) => {
    values[concept['id']] = concept['checked'];
  });

  const submit = (values) => {
    const sel = [];
    Object.keys(values).forEach((key) => {
      if (values[key] === true) {
        sel.push(key);
      }
    });
    onSubmit(sel);
  };

  return (
    <Formik initialValues={values} onSubmit={submit}>
      {({ values, errors, touched }) => (
        <Form>
          <div className="flex ml-4 mb-4">
            <div>
              { mappedConcepts.map(concept =>
                <div key={concept.id} className="form-check pb-2 mb-2">
                  <label className="form-check-label inline-block text-gray-800">
                    <Field className="mr-2" type="checkbox" name={concept.id}/>
                    {concept.displayName}
                  </label>
                </div>
              )}
            </div>
          </div>
          <div className="pt-5 flex justify-center text-center">
            <FormSubmit disabled={false}>
              <p>{t('Modificar conceptos')}</p>
            </FormSubmit>
          </div>
        </Form>
      )}
    </Formik>
  );
}
