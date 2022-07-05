import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import Navbar from '@components/Navbar';
import { Field, Form, Formik } from 'formik';
import FormSection from '@components/FormSection';
import FormInput from '@components/FormInput';
import Table from '@components/Table';
import React, { useState } from 'react';
import FormSubmit from '@components/FormSubmit';
import fetch from 'isomorphic-unfetch';
import * as Yup from 'yup';
import Validation from '@middlewares/validation';
import { useTranslation } from 'react-i18next';
import Variables from '@model/recibo/v2/Variables';

export default function Index({ tabs, edit_mode, concept }) {

  const [t] = useTranslation();

  const initialTabla = () => {
    if (concept.concepto_tabla) {
      return concept.concepto_tabla.map((ct) => {
        return {
          minimo: ct.minimo,
          maximo: ct.maximo,
          fijo: ct.fijo
        };
      });
    }
    return [];
  };

  const [tabla, setTabla] = useState(edit_mode ? initialTabla() : []);

  const canAddRow = (monto, minimo, maximo) => {
    return monto !== '' && minimo !== '' && maximo !== '';
  };

  const removeRow = (index) => {
    return () => setTabla(tabla.filter((v, i) => i !== index));
  };

  const addRow = (monto, minimo, maximo) => {
    return () => {
      setTabla([...tabla, { minimo, maximo, fijo: monto }]);
    };
  };

  const buildTablaButton = (pos) => {
    return (
      <button onClick={removeRow(pos)} type="button">
        <svg className="h-5 w-5 mr-1 ml-1" xmlns="http://www.w3.org/2000/svg"
             fill="none" viewBox="0 0 24 24" stroke="indigo" fillOpacity="0.5" strokeOpacity="0.8">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    );
  };

  const canSubmit = (errors, touched) => {
    return Object.keys(errors).length !== 0 || Object.keys(touched).length === 0;
  };

  const calculateGrupo = (columna) => {
    switch (columna) {
      case '0': return 'G1';
      case '1': return 'G2';
      case '2': return 'G3';
    }
  };

  const calculateSubGrupo = (grupo) => {
    return `S${grupo}5`;
  };

  const create = async (values) => {
    console.log('POST concept.', values, tabla);
    const grupo = values.grupo === null ? calculateGrupo(values.columna) : values.grupo;
    const subgrupo = values.subgrupo === null ? calculateSubGrupo(grupo) : values.subgrupo;
    const body = {
      ...values,
      grupo,
      subgrupo,
      tabla
    };
    await fetch('/api/concept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then((response) => {
      if (response.status === 201) {
        response.json().then((resp) => {
          window.location.href = `/concept?added=${resp['concepto_id']}`;
        });
      } else {
        response.json().then((errors) => {
          console.log(errors);
        });
      }
    });
  };

  const update = async (values) => {
    console.log('PUT concept.', values, tabla);
    const grupo = values.grupo === null ? calculateGrupo(values.columna) : values.grupo;
    const subgrupo = values.subgrupo === null ? calculateSubGrupo(grupo) : values.subgrupo;
    const body = {
      ...values,
      grupo,
      subgrupo,
      tabla
    };
    await fetch(`/api/concept/${concept.concepto_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((resp) => {
          window.location.href = `/concept?added=${concept.concepto_id}`;
        });
      } else {
        response.json().then((errors) => {
          console.log(errors);
        });
      }
    });
  };

  const validation = Validation(t, new Date());
  const conceptSchema = Yup.object().shape({
    codigo: validation.String('field.required'),
    nombre: validation.String('field.required'),
    unidad: validation.String('field.required'),
    columna: validation.String('field.required'),
    tipoconcepto: validation.String('field.required'),
    valor: validation.NumberOrPlaceholder('field.required'),
    cantidad: validation.NumberOrPlaceholder('field.required'),
    multiplicador: validation.NumberOrPlaceholder('field.required'),
    divisor: validation.NumberOrPlaceholder('field.required')
  });

  const getInitialValue = (field, def?) => {
    if (edit_mode) {
      if (field === 'monto' || field === 'maximo' || field === 'minimo') {
        return null;
      }
      return String(concept[field]);
    }
    return def === null ? '' : def;
  };

  const values = {
    concepto_id: getInitialValue('concepto_id'),
    codigo: getInitialValue('codigo'),
    nombre: getInitialValue('nombre'),
    unidad: getInitialValue('unidad', '1'),
    columna: getInitialValue('columna', '0'),
    tipoconcepto: getInitialValue('tipoconcepto', '0'),
    grupo: getInitialValue('grupo'),
    subgrupo: getInitialValue('subgrupo'),
    seaplicaa: getInitialValue('seaplicaa'),
    cantidad: getInitialValue('cantidad', '1'),
    valor: getInitialValue('valor', '1'),
    multiplicador: getInitialValue('multiplicador', '1'),
    divisor: getInitialValue('divisor', '1'),
    condicion: getInitialValue('condicion', 'true'),
    periodico: getInitialValue('periodico', 'true'),
    monto: getInitialValue('monto'),
    maximo: getInitialValue('maximo'),
    minimo: getInitialValue('minimo')
  };

  return (
    <Navbar tabs={tabs} withHeader={<p>Agregar Concepto</p>}>
      <Formik initialValues={values} onSubmit={edit_mode ? update : create} validationSchema={conceptSchema}>
        {({ values, errors, touched }) => (
          <Form>
            <div className="mt-5 px-2 py-5">
              <FormSection label={'Informacion del concepto'} fixedHeight={'full'}>
                <FormInput id={'codigo'} name={'codigo'} label={'Codigo'} placeholder={'Codigo de concepto'}/>
                <FormInput id={'nombre'} name={'nombre'} label={'Nombre'} placeholder={'Nombre de concepto'}/>
                <div>
                  <div className="flex">
                    <div className="pr-3 w-1/3">
                      <p className="text-sm text-gray-700 font-bold mb-2">Tipo de concepto</p>
                      <Field as="select" name="columna" className="px-3 py-2 w-48 std-data-input capitalize text-md text-gray-700">
                        <option value={'0'}>Remunerativo</option>
                        <option value={'1'}>No Remunerativo</option>
                        <option value={'2'}>Deduccion</option>
                      </Field>
                    </div>
                    <div className="pr-3 w-1/3">
                      <p className="text-sm text-gray-700 font-bold mb-2">Unidad</p>
                      <Field as="select" name="unidad" className="px-3 py-2 w-48 std-data-input capitalize text-md text-gray-700">
                        <option value={0}>Hora</option>
                        <option value={1}>Dia</option>
                        <option value={2}>Porcentaje (%)</option>
                        <option value={3}>Otro</option>
                      </Field>
                    </div>
                    <div className="pr-3 w-1/3">
                      <p className="text-sm text-gray-700 font-bold mb-2">Forma de calculo</p>
                      <Field as="select" name="tipoconcepto" className="px-3 py-2 w-48 std-data-input capitalize text-md text-gray-700">
                        <option value={'0'}>Fijo</option>
                        <option value={'1'}>Porcentaje (%)</option>
                        <option value={'2'}>Calculo Avanzado</option>
                        <option value={'3'}>Por tabla</option>
                      </Field>
                    </div>
                  </div>
                </div>
                <div className="mb-6"/>
                { values.tipoconcepto === '0' ?
                  <FormInput id={'valor'} name={'valor'} label={'Monto Fijo'} placeholder={'Monto Fijo del concepto'}/>
                  : null }
                { values.tipoconcepto === '1' ?
                  <FormInput id={'cantidad'} name={'cantidad'} label={'Porcentaje (%)'} placeholder={'Porcentaje del concepto'}/>
                  : null }
                { values.tipoconcepto === '2' ?
                  <div>
                    <div className="m-4 p-4 border rounded border-blue-500 shadow">
                      <p className="m-2">
                        <span className="font-bold text-blue-500">Informacion: </span>
                        El modo avanzado le permite crear resultados mas complejos mediante el uso de variables y condiciones.
                        El resultado final estara dado por
                        <span className="font-medium text-blue-500"> ( valor / divisor ) * multiplicador * cantidad </span>
                        siempre que <span className="font-medium text-blue-500">condicion</span> sea verdadera.
                      </p>
                      <div className="m-2">
                        El sistema admite variables internas como parte del calculo:
                        <ul>
                          {Variables.TODOS.map(v => (
                            <li key={v.symbol}>
                              - {v.name} = <span className="font-bold">{v.symbol} </span>
                              <ul className="pl-5 text-blue-700 italic">
                                <li>
                                  {v.desc}
                                </li>
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="m-2">
                        <span className="font-bold">Resultado final:</span>
                        <br/>
                        <span className="text-lg font-medium">
                          {`( ${values.valor ? values.valor : '0'} / ${values.divisor ? values.divisor : '1'} ) * ${values.multiplicador ? values.multiplicador : '1'} * ${values.cantidad ? values.cantidad : '1'} `}
                        </span>
                      </p>
                    </div>
                    <FormInput id={'valor'} name={'valor'} label={'Valor'} placeholder={'Valor del concepto'}/>
                    <FormInput id={'divisor'} name={'divisor'} label={'Divisor'} placeholder={'Divisor de concepto'}/>
                    <FormInput id={'multiplicador'} name={'multiplicador'} label={'Multiplicador'} placeholder={'Multiplicador de concepto'}/>
                    <FormInput id={'cantidad'} name={'cantidad'} label={'Cantidad'} placeholder={'Cantidad de concepto'}/>
                    <FormInput id={'condicion'} name={'condicion'} label={'Condicion'} placeholder={'Condicion de concepto'}/>
                  </div>
                  : null }
                { values.tipoconcepto === '3' ?
                  <div>
                    <div className="m-4 p-4 border rounded border-blue-500 shadow">
                      <p className="m-2">
                        <span className="font-bold text-blue-500">Informacion: </span>
                        El modo tabla le permite crear una tabla con rangos maximos y minimos que determinan si el concepto sera recibido por el
                        empleado. La tabla deber tener rangos excluyentes, si el empleado no califica por ningun rango el concepto sera ignorado.
                      </p>
                    </div>
                    <div className="flex">
                      <div className="pr-15 w-1/3">
                        <FormInput id={'monto'} name={'monto'} label={'Monto a recibir'} placeholder={'Monto a recibir'}/>
                      </div>
                      <div className="pr-15 w-1/3">
                        <FormInput id={'minimo'} name={'minimo'} label={'Sueldo Minimo'} placeholder={'Sueldo minimo'}/>
                      </div>
                      <div className="pr-15 w-1/3">
                        <FormInput id={'maximo'} name={'maximo'} label={'Sueldo Maximo'} placeholder={'Sueldo maximo'}/>
                      </div>
                    </div>
                    <button type="button"
                            className={`float-right border border-gray-300 rounded-full bg-indigo-500 h-10 w-10 p-2 focus:outline-none focus:shadow-outline hover:bg-indigo-700${canAddRow(values.monto, values.minimo, values.maximo) ? '' : ' opacity-50 cursor-not-allowed'}`}
                            disabled={!canAddRow(values.monto, values.minimo, values.maximo)}
                            onClick={addRow(values.monto, values.minimo, values.maximo)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="whitesmoke">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                    <Table
                      headers={['Monto a recibir', 'Sueldo Minimo', 'Sueldo Maximo', 'Acciones']}
                      values={tabla.map((tr, i) => {
                        return {
                          ...tr,
                          acciones: buildTablaButton(i)
                        };
                      })}
                      selectedFields={['fijo', 'minimo', 'maximo', 'acciones']}
                    />
                  </div>
                  : null }
              </FormSection>
            </div>
            <div className="mt-5 px-2 py-5 border-t border-gray-300">
              <FormSection label={'Secuencia de calculo'} fixedHeight={'full'}>
                <div className="m-4 p-4 border rounded border-blue-500 shadow">
                  <p className="m-2">
                    <span className="font-bold text-blue-500">Informacion: </span>
                    Los grupos y sub-grupos sirven para controlar como los conceptos se aplican a diferentes resultados dados por otros grupos.
                    Por ejemplo: todos los conceptos remunerativos pertencen al Grupo 1 (G1)
                    por defecto y todos las deducciones pertenecen al Grupo 3 (G3) y tienen como entrada el Grupo 1.
                  </p>
                </div>
                <FormInput id={'grupo'} name={'grupo'} label={'Grupo'}
                           placeholder={'Grupo del concepto (opcional)'}/>
                <FormInput id={'subgrupo'} name={'subgrupo'} label={'Sub Grupo'}
                           placeholder={'Sub Grupo del concepto (opcional)'}/>
                <FormInput id={'seaplicaa'} name={'seaplicaa'} label={'Entradas'}
                           placeholder={'Se calcula en base a los siguientes grupos (opcional)'}/>
              </FormSection>
            </div>
            <div className="mt-5 px-2 py-5 border-t border-gray-300" >
              <FormSection label={'Confirmacion'} fixedHeight={'full'}>
                <div className="flex flex-row-reverse text-right">
                  <FormSubmit disabled={canSubmit(errors, touched)}>
                    <p>{edit_mode ? ('Editar Concepto') : ('Agregar Concepto')}</p>
                  </FormSubmit>
                </div>
              </FormSection>
            </div>
          </Form>
        )}
      </Formik>
    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const tabs = await UserService.getNavTabs(context);

  return {
    props: {
      tabs,
      concept: {},
      edit_mode: false
    }
  };
}, null);
