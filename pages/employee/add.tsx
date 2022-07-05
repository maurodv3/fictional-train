import Navbar from '@components/Navbar';
import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import { Form, Formik, Field, ErrorMessage, useFormikContext } from 'formik';
import FormSection from '@components/FormSection';
import FormSubmit from '@components/FormSubmit';
import FormInput from '@components/FormInput';
import DepartmentService from '@services/DepartmentService';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import Validation from '@middlewares/validation';
import SidePanel from '@components/SidePanel';
import React, { useEffect, useState } from 'react';
import Table from '@components/Table';
import FamiliarForm from '@components/FamiliarForm';
import fetch from 'isomorphic-unfetch';
import { format, parse } from 'date-fns';

export default function AddEmployee({ tabs, departments, employee, edit_mode }) {

  const [t] = useTranslation();

  const formatter = Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });

  const [open, setOpen] = useState(false);
  const [family, setFamily] = useState(edit_mode ? employee.employee_familiar : []);

  const openFamiliarPanel = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const addFamiliar = async (familiar) => {
    if (edit_mode) {
      await postFamiliar(familiar);
    }
    setFamily([...family, familiar]);
    setOpen(false);
  };

  const removeFamiliar = (index) => {
    return async () => {
      const familiar = family[index];
      if (edit_mode) {
        await deleteFamiliar(familiar);
      }
      setFamily(family.filter((value, i) => i !== index));
    };
  };

  const getInitialValue = (field) => {
    if (!edit_mode) {
      return '';
    }
    if (field === 'job') {
      const job = departments
        .find(d => d.id === employee.job_category.job.department.department_id)
        .jobs.filter(j => j.id === employee.job_category.job.job_id)
        .map((j) => {
          return {
            id: j.id,
            name: j.name,
            categories: j.categories
          };
        })[0];
      return JSON.stringify(job);
    }
    if (field === 'start_date' || field === 'birth_date') {
      return format(employee[field], 'dd/MM/yyyy');
    }
    if (field === 'bank_name' || field === 'bank_number' || field === 'bank_account_type') {
      return employee['bank_accounts'][0][field];
    }
    return employee[field];
  };

  const JobCategory = (props) => {
    const {
      // @ts-ignore
      values: { job },
      setFieldValue,
    } = useFormikContext();
    const parsed = job ? JSON.parse(job) : {};
    useEffect(() => {
      const [isInit, initVal] = props.initValue;
      if (!isInit) {
        console.log('Initializing category');
        setFieldValue('job_category_id', initVal, false);
        props.initialized();
      } else {
        setFieldValue('job_category_id', '', true);
      }
    }, [job]);

    return (
      <div className="px-2">
        <p className="text-sm text-gray-700 font-bold mb-2">{t('Categoria')}</p>
        <Field as="select" name="job_category_id" className="px-3 py-2 w-48 std-data-input capitalize text-md text-gray-700">
          {<option value={''}>{t('employee.position.empty')}</option>}
          {parsed && parsed.categories ?
            parsed.categories.map((category) => {
              return (
                <option key={category.c_id} value={category.c_id}>{category.c_name}</option>
              );
            })
            : null
          }
        </Field>
        <p className="text-red-500 text-xs italic" style={{ padding: '5px 5px 0px 5px' }}>
          <ErrorMessage name="job_category_id"/>
        </p>
      </div>
    );
  };

  const create = async (values) => {
    console.log('POST employee.', values, family);
    const body = {
      ...values,
      familiars: [...family]
    };
    await fetch('/api/employee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then((response) => {
      if (response.status === 201) {
        response.json().then((resp) => {
          window.location.href = `/employee?added=${resp['employee_id']}`;
        });
      } else {
        response.json().then((errors) => {
          console.log(errors);
        });
      }
    });
  };

  const update = async (values) => {
    console.log('PUT employee.', values, family);
    const body = {
      ...values
    };
    await fetch(`/api/employee/${employee.employee_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((resp) => {
          window.location.href = `/employee?added=${resp['employee_id']}`;
        });
      } else {
        response.json().then((errors) => {
          console.log(errors);
        });
      }
    });
  };

  const postFamiliar = async (familiar) => {
    await fetch(`/api/employee/${employee.employee_id}/familiar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(familiar)
    }).then((response) => {
      if (response.status === 201) {
      } else {
        response.json().then((errors) => {
          console.log(errors);
        });
      }
    });
  };

  const deleteFamiliar = async (familiar) => {
    await fetch(`/api/employee/${employee.employee_id}/familiar/${familiar.familiar_id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(familiar)
    }).then((response) => {
      if (response.status === 204) {
      } else {
        response.json().then((errors) => {
          console.log(errors);
        });
      }
    });
  };

  const [categoryInitialized, setCategoryInitialized] = useState([!edit_mode, getInitialValue('job_category_id')]);
  const initialized = () => {
    if (!categoryInitialized) {
      setCategoryInitialized([true, -1]);
    }
  };

  const validation = Validation(t, new Date());

  const isEmployeeFormEnabled = (errors, touched) => {
    return Object.keys(errors).length !== 0 || Object.keys(touched).length === 0;
  };

  const employeeSchema = Yup.object().shape({
    name: validation.String('field.name.required'),
    lastname: validation.String('field.lastname.required'),
    identifier: validation.CUIL('field.cuil.required'),
    birth: validation.Date('field.birth.required'),
    personal_email: validation.Email('field.personal.email.required'),
    address: validation.String('field.address.required'),
    job: validation.String('field.job.required'),
    job_category_id: validation.String('field.job.required'),
    work_email: validation.Email('field.work.email.required'),
    hire_date: validation.Date('field.hire.date.required'),
    bank_name: validation.String('field.required'),
    bank_number: validation.String('field.required'),
    bank_account_type: validation.String('field.required')
  });

  return (
    <Navbar tabs={tabs} withHeader={<p>{t('employee.new.employee.title')}</p>}>
      <Formik initialValues={{
        name: getInitialValue('name'),
        lastname: getInitialValue('lastname'),
        identifier: getInitialValue('identifier'),
        birth: getInitialValue('birth_date'),
        address: getInitialValue('address'),
        personal_email: getInitialValue('email_personal'),
        job: getInitialValue('job'),
        job_category_id: getInitialValue('job_category_id'),
        work_email: getInitialValue('email_work'),
        hire_date: getInitialValue('start_date'),
        bank_name: getInitialValue('bank_name'),
        bank_number: getInitialValue('bank_number'),
        bank_account_type: getInitialValue('bank_account_type')
      }} onSubmit={edit_mode ? update : create} validationSchema={employeeSchema} validateOnMount={edit_mode} >
        {({ errors, touched }) => (
          <Form>
            <div className="px-2">
              <FormSection label={t('employee.personal.data')} fixedHeight={'full'}>
                <div className="flex">
                  <div className="px-2 w-1/2">
                    <FormInput id={'name'} name={'name'} label={'employee.name'} placeholder={'employee.name'}/>
                  </div>
                  <div className="px-2 w-1/2">
                    <FormInput id={'lastname'} name={'lastname'} label={'employee.lastname'} placeholder={'employee.lastname'}/>
                  </div>
                </div>
                <div className="flex">
                  <div className="px-2">
                    <FormInput id={'identifier'} name={'identifier'} label={'employee.cuil'} placeholder={'employee.cuil'}/>
                  </div>
                </div>
                <div className="flex">
                  <div className="px-2 w-2/6">
                    <FormInput id={'birth'} name={'birth'} label={'employee.birth'} placeholder={'employee.birth'}/>
                  </div>
                  <div className="px-2 w-4/6">
                    <FormInput id={'address'} name={'address'} label={'employee.address'} placeholder={'employee.address'}/>
                  </div>
                </div>
                <div className="flex">
                  <div className="px-2 w-2/3">
                    <FormInput id={'personal_email'} name={'personal_email'}
                               label={'employee.personal.email'} placeholder={'employee.personal.email'}/>
                  </div>
                </div>
              </FormSection>
            </div>
            <div className="mt-5 px-2 py-5 border-t border-gray-300">
              <FormSection label={t('employee.work.data')} fixedHeight={'full'}>
                <div className="flex mb-4">
                  <div className="px-2">
                    <p className="text-sm text-gray-700 font-bold mb-2">{t('employee.position')}</p>
                    <Field as="select" name="job" className="px-3 py-2 w-48 std-data-input capitalize text-md text-gray-700">
                      {<option value={''}>{t('employee.position.empty')}</option>}
                      {departments.map((department) => {
                        return (
                          <optgroup label={department.name} key={department.id}>
                            {department.jobs.map(job =>
                              <option key={job.id} value={JSON.stringify(job)}>{job.name}</option>)}
                          </optgroup>
                        );
                      })}
                    </Field>
                    <p className="text-red-500 text-xs italic" style={{ padding: '5px 5px 0px 5px' }}>
                      <ErrorMessage name="job"/>
                    </p>
                  </div>
                </div>
                <div className="flex mb-4">
                  <JobCategory initValue={categoryInitialized} initialized={initialized}/>
                </div>
                <div className="flex">
                  <div className="px-2 w-2/3">
                    <FormInput id={'work_email'} name={'work_email'} label={'employee.work.email'} placeholder={'employee.work.email'}/>
                  </div>
                </div>
                <div className="flex">
                  <div className="px-2 w-1/4">
                    <FormInput id={'hire_date'} name={'hire_date'} label={'employee.hire.date'} placeholder={'employee.hire.date'}/>
                  </div>
                </div>
              </FormSection>
            </div>
            <div className="mt-5 px-2 py-5 border-t border-gray-300" >
              <FormSection label={'Datos bancarios'} fixedHeight={'full'}>
                <div>
                  <div className="px-2">
                    <FormInput id={'bank_name'} name={'bank_name'} label={'Banco'} placeholder={'Nombre del banco'}/>
                  </div>
                  <div className="px-2">
                    <FormInput id={'bank_number'} name={'bank_number'} label={'Numero de cuenta (CBU)'} placeholder={'Numero de cuenta'}/>
                  </div>
                  <div className="px-2 mb-5 w-full">
                    <p className="text-sm text-gray-700 font-bold mb-2">Tipo cuenta</p>
                    <Field as="select" name="bank_account_type" className="px-3 py-2 w-48 std-data-input capitalize text-md text-gray-700">
                      <option value={''}>(Selecionar)</option>
                      <option value={'0'}>Caja de ahorros</option>
                      <option value={'1'}>Cuenta corriente</option>
                    </Field>
                    <p className="text-red-500 text-xs italic" style={{ padding: '5px 5px 0px 5px' }}>
                      <ErrorMessage name="bank_account_type"/>
                    </p>
                  </div>
                </div>
              </FormSection>
            </div>
            <div className="mt-5 px-2 py-5 border-t border-gray-300">
              <FormSection label={t('employee.family.data')} fixedHeight={'full'}>
                <div className="relative mb-15">
                  <div className="absolute top-3 right-15 h-8 w-full text-right font-bold">
                    <p>Agregar familiar</p>
                  </div>
                  <div className="absolute top-2 right-4 h-8 w-8 text-center">
                    <button className="border border-gray-300 rounded-full bg-indigo-500 h-10 w-10 p-2
                    focus:outline-none focus:shadow-outline hover:bg-indigo-700" onClick={openFamiliarPanel}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="whitesmoke">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
                {family.length === 0 ?
                  <div className="text-center">
                    <p>{t('employee.no.familiars')}</p>
                  </div>
                  :
                  <Table headers={['Nombre', 'Apellido', 'Relacion', 'Fecha Nacimiento', 'Ingreso', 'Acciones']}
                         selectedFields={['familiarName', 'familiarLastname', 'familiarRelationship', 'familiarBirth', 'familiarIncome', 'actions']}
                         values={family.map((familiar, i) => {
                           return {
                             familiarName: familiar.name,
                             familiarLastname: familiar.lastname,
                             familiarRelationship: familiar.relationship,
                             familiarBirth: familiar.birth ? familiar.birth : format(familiar.birth_date, 'dd/MM/yyyy'),
                             familiarIncome: familiar.annual_salary === 0 ? '-' : formatter.format(familiar.annual_salary),
                             actions: (
                               <button className="p-1" onClick={removeFamiliar(i)} type="button">
                                 <svg className="h-5 w-5 mr-1 ml-1" xmlns="http://www.w3.org/2000/svg"
                                      fill="none" viewBox="0 0 24 24" stroke="indigo" fillOpacity="0.5" strokeOpacity="0.8">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                 </svg>
                               </button>
                             )
                           };
                         })}
                  />
                }
              </FormSection>
            </div>
            <div className="mt-5 px-2 py-5 border-t border-gray-300" >
              <FormSection label={t('employee.confirm')} fixedHeight={'full'}>
                <div className="pt-3 flex flex-row-reverse text-right">
                  <FormSubmit disabled={isEmployeeFormEnabled(errors, touched)}>
                    <p>{edit_mode ? t('employee.edit.employee') : t('employee.add.new.employee')}</p>
                  </FormSubmit>
                </div>
              </FormSection>
            </div>
          </Form>
        )}
      </Formik>
      <SidePanel title={t('employee.add.new.familiar')} open={open} setOpen={setOpen} >
        <FamiliarForm onSubmit={addFamiliar}/>
      </SidePanel>
    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const tabs = await UserService.getNavTabs(context);

  const departments = await DepartmentService.getDepartmentsWithJobs()
    .then(ds => ds.flatMap((d) => {
      return {
        id: d.department_id,
        name: d.name,
        jobs: d.job.map((j) => {
          return {
            id: j.job_id,
            name: j.name,
            categories: j.job_category.map((c) => {
              return {
                c_id: c.job_category_id,
                c_name: c.name
              };
            })
          };
        })
      };
    }));

  return {
    props: {
      tabs,
      departments,
      employee: {},
      edit_mode: false
    }
  };
}, null);
