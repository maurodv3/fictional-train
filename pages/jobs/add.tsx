import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import Navbar from '@components/Navbar';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import FormSection from '@components/FormSection';
import FormInput from '@components/FormInput';
import Link from 'next/link';
import Table from '@components/Table';
import React, { useState } from 'react';
import SidePanel from '@components/SidePanel';
import JobCategoryForm from '@components/JobCategoryForm';
import ConceptService from '@services/ConceptService';
import FormSubmit from '@components/FormSubmit';
import JobConceptSelect from '@components/JobConceptSelect';
import * as Yup from 'yup';
import Validation from '@middlewares/validation';
import { useTranslation } from 'react-i18next';
import fetch from 'isomorphic-unfetch';
import DepartmentService from '@services/DepartmentService';

export default function AddJob({ tabs, departments, stored_concepts, edit_mode, job }) {

  const formatter = Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });

  const initialCategories = () => {
    if (edit_mode) {
      return job.job_category;
    }
    return [];
  };
  const initialConcepts = () => {
    if (edit_mode) {
      return job.concepto_job.map(cj => String(cj.concepto_id));
    }
    return [];
  };
  const initialValues = (key) => {
    if (edit_mode) {
      return job[key];
    }
    return '';
  };

  const [openCategories, setOpenCategories] = useState(false);
  const [categories, setCategories] = useState(initialCategories());
  const openCategoriesPanel = (e) => {
    e.preventDefault();
    setOpenCategories(true);
  };
  const addCategory = (values) => {
    setCategories([...categories, values]);
    setOpenCategories(false);
  };
  const removeCategory = (index) => {
    return () => setCategories(categories.filter((cat, i) => i !== index));
  };

  const [openConcepts, setOpenConcepts] = useState(false);
  const [concepts, setConcepts] = useState(initialConcepts());
  const selectConcepts = (values) => {
    setConcepts(values);
    setOpenConcepts(false);
  };
  const openConceptsPanel = (e) => {
    e.preventDefault();
    setOpenConcepts(true);
  };

  const toColumna = (col) => {
    switch (col) {
      case 0: return 'Remunerativo';
      case 1: return 'No remunerativo';
      case 2: return 'Deduccion';
    }
  };

  const isEnabled = (errors, touched) => {
    console.log(errors);
    return Object.keys(errors).length === 0 && concepts.length !== 0 && categories.length !== 0;
  };

  const jobValues = {
    name: initialValues('name'),
    description: initialValues('description'),
    base_salary: initialValues('base_salary'),
    department_id: initialValues('department_id')
  };

  const [t] = useTranslation();
  const validation = Validation(t, new Date());
  const schema = Yup.object().shape({
    name: validation.String('field.required'),
    description: validation.String('field.required'),
    base_salary: validation.Number('field.required'),
    department_id: validation.String('field.required')
  });

  const buttons = (index) => {
    return (
      <div>
        <button className="pt-1 whitespace-nowrap text-right text-sm font-medium text-indigo-600 hover:text-indigo-900"
                onClick={removeCategory(index)}>
          <svg className="h-5 w-5 mr-1 ml-1" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" stroke="indigo" fillOpacity="0.5" strokeOpacity="0.8">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    );
  };

  const create = async (values) => {
    console.log('POST job', values, concepts, categories);
    const body = {
      ...values,
      concepts,
      categories
    };
    await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then((response) => {
      if (response.status === 201) {
        response.json().then((resp) => {
          window.location.href = `/jobs?added=${resp['job_id']}`;
        });
      } else {
        response.json().then((errors) => {
          console.log(errors);
        });
      }
    });
  };

  const update = async (values) => {
    console.log('PUT job', values, concepts, categories);
    const body = {
      ...values,
      concepts,
      categories
    };
    await fetch(`/api/jobs/${job.job_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((resp) => {
          window.location.href = `/jobs?added=${job.job_id}`;
        });
      } else {
        response.json().then((errors) => {
          console.log(errors);
        });
      }
    });
  };

  return (
    <Navbar tabs={tabs} withHeader={<p>Agregar Puesto</p>}>
        <Formik initialValues={jobValues} validationSchema={schema} onSubmit={edit_mode ? update : create}>
          {({ values, errors, touched }) => (
            <Form>
              <div className="mt-5 px-2 py-5">
                <FormSection label={'Informacion del puesto'} fixedHeight={'full'}>
                  <FormInput id={'name'} name={'name'} label={'Nombre'} placeholder={'Nombre del puesto'}/>
                  <FormInput id={'description'} name={'description'} label={'Descripcion'} placeholder={'Descripcion del puesto'}/>
                  <FormInput id={'base_salary'} name={'base_salary'} label={'Sueldo Basico'} placeholder={'Sueldo Basico'}/>
                  <div className="flex mb-4">
                    <div className="">
                      <p className="text-sm text-gray-700 font-bold mb-2">{t('Departamento')}</p>
                      <Field as="select" name="department_id" className="px-3 py-2 w-48 std-data-input capitalize text-md text-gray-700">
                        {<option value={''}>{t('employee.position.empty')}</option>}
                        {departments.map(department =>
                          <option key={department.department_id} value={department.department_id}>{department.name}</option>)}
                      </Field>
                      <p className="text-red-500 text-xs italic" style={{ padding: '5px 5px 0px 5px' }}>
                        <ErrorMessage name="department_id"/>
                      </p>
                    </div>
                  </div>
                </FormSection>
              </div>
              <div className="mt-5 px-2 py-5 border-t border-gray-300">
                <FormSection label={'Categorias'} fixedHeight={'full'}>
                  <div className="relative">
                    <div className="absolute right-1 h-8 w-8 text-center">
                      <Link href={'/employee/add'}>
                        <button className="border border-gray-300 rounded-full bg-indigo-500 h-10 w-10 p-2 focus:outline-none focus:shadow-outline hover:bg-indigo-700"
                                onClick={openCategoriesPanel}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="whitesmoke">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </Link>
                    </div>
                    { categories.length === 0 ? (
                      <div className="text-center text-md font-semibold">
                        <p>No hay categorias</p>
                      </div>
                    ) : (
                      <Table
                        headers={['Nombre', 'Monto Fijo', 'Porcentual', 'Acciones']}
                        selectedFields={['name', 'fixed_raise', 'percentage_raise', 'actions']}
                        values={categories.map((jc, index) => {
                          return {
                            name: jc.name,
                            fixed_raise: formatter.format(jc.fixed_raise),
                            percentage_raise: `${jc.percentage_raise} %`,
                            actions: buttons(index)
                          };
                        })}
                      />
                    )}
                  </div>
                </FormSection>
              </div>
              <div className="mt-5 px-2 py-5 border-t border-gray-300">
                <FormSection label={'Conceptos'} fixedHeight={'full'}>
                  <div className="relative">
                    <div className="absolute right-1 h-8 w-8 text-center">
                      <Link href={'/employee/add'}>
                        <button className="border border-gray-300 rounded-full bg-indigo-500 h-10 w-10 p-2 focus:outline-none focus:shadow-outline hover:bg-indigo-700"
                                onClick={openConceptsPanel}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="whitesmoke">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </Link>
                    </div>
                    { concepts.length === 0 ? (
                      <div className="text-center text-md font-semibold">
                        <p>No hay conceptos</p>
                      </div>
                    ) : (
                      <Table
                        headers={['Codigo', 'Nombre', 'Tipo']}
                        selectedFields={['codigo', 'nombre', 'columna']}
                        values={
                          stored_concepts
                              .filter(c => concepts.includes(String(c.concepto_id)))
                              .map((c) => {
                                return {
                                  codigo: c.codigo,
                                  nombre: c.nombre,
                                  columna: toColumna(c.columna)
                                };
                              })
                        }
                      />
                    )
                    }
                  </div>
                </FormSection>
              </div>
              <div className="mt-5 px-2 py-5 border-t border-gray-300" >
                <FormSection label={'Confirmar'} fixedHeight={'full'}>
                  <div className="flex flex-row-reverse text-right">
                    <FormSubmit disabled={!isEnabled(errors, touched)}>
                      <p>{'Guardar'}</p>
                    </FormSubmit>
                  </div>
                </FormSection>
              </div>
            </Form>
          )}
        </Formik>
      <SidePanel title={'Agregar Categoria'} open={openCategories} setOpen={setOpenCategories} >
        <JobCategoryForm onSubmit={addCategory}/>
      </SidePanel>
      <SidePanel title={'Seleccionar Conceptos'} open={openConcepts} setOpen={setOpenConcepts} >
        <JobConceptSelect onSubmit={selectConcepts} selected={concepts} concepts={stored_concepts}/>
      </SidePanel>
    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const tabs = await UserService.getNavTabs(context);
  const concepts = await ConceptService.getConcepts();
  const departments = await DepartmentService.getDepartments();
  return {
    props: {
      tabs,
      departments,
      stored_concepts: concepts,
      edit_mode: false,
      job: {}
    }
  };
}, null);
