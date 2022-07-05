import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import Navbar from '@components/Navbar';
import Table from '@components/Table';
import FormSection from '@components/FormSection';
import EmployeeService from '@services/EmployeeService';
import ReciboService from '@services/ReciboService';
import ConceptService from '@services/ConceptService';
import React, { useState } from 'react';
import SidePanel from '@components/SidePanel';
import ConceptoUnicoForm from '@components/ConceptoUnicoForm';
import fetch from 'isomorphic-unfetch';
import { format } from 'date-fns';
import Link from 'next/link';
import HorasExtrasForm from '@components/HorasExtrasForm';

export default function AddEmployee({ tabs, employee, recibos, personalConcepts, horasExtras }) {

  const [open, setOpen] = useState(false);
  const [openHX, setOpenHX] = useState(false);
  const openConceptForm = () => {
    setOpen(true);
  };
  const openHXForm = () => {
    setOpenHX(true);
  };

  const [concepts, setConcepts] = useState(personalConcepts);
  const createConcept = (values) => {
    fetch(`/api/employee/${employee.employee_id}/concept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    }).then((response) => {
      if (response.status === 201) {
        response.json().then((resp) => {
          // Some problem with dates, force page reload as workaround. This is ugly.
          window.location.href = `/employee/${employee.employee_id}`;
        });
      } else {
        response.json().then((errors) => {
          console.log(errors);
        });
      }
    });
  };

  const [hx, setHX] = useState(horasExtras);
  const createHX = (values) => {
    fetch(`/api/employee/${employee.employee_id}/horaextra`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    }).then((response) => {
      if (response.status === 201) {
        response.json().then((resp) => {
          // Some problem with dates, force page reload as workaround. This is ugly.
          window.location.href = `/employee/${employee.employee_id}`;
        });
      } else {
        response.json().then((errors) => {
          console.log(errors);
        });
      }
    });
  };

  const submitConcept = (values) => {
    createConcept(values);
    setOpen(false);
  };

  const submitHX = (values) => {
    createHX(values);
    setOpen(false);
  };

  const formatter = Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });

  const toType = (type) => {
    switch (type) {
      case 1: return 'Premio';
      case -1: return 'Descuento';
    }
  };

  const toConceptoStatus = (type) => {
    switch (type) {
      case 1: return 'Pendiente';
      case 2: return 'Pago';
    }
  };

  const toReciboStatus = (type) => {
    switch (type) {
      case 0: return 'Pendiente';
      case 1: return 'Pagado';
    }
  };

  return (
      <Navbar tabs={tabs} withHeader={<p>{employee.name} {employee.lastname}</p>}>
        <div className="py-5 flex border-b-2">
          <div className="w-1/4 pl-10">
            <img className="h-48 w-48 rounded-full" src="/user_pic.png" alt=""/>
          </div>
          <div className="w-3/4 px-2">
            <p><strong>CUIL:{' '}</strong>{employee.identifier}</p>
            <p><strong>E-mail Laboral:{' '}</strong>{employee.email_work}</p>
            <p><strong>E-mail Personal:{' '}</strong>{employee.email_personal}</p>
            <p><strong>Domicilio:{' '}</strong>{employee.address}</p>
            <br/>
            <p><strong>Puesto:{' '}</strong>{employee.job_category.job.name}</p>
            <p><strong>Categoria:{' '}</strong>{employee.job_category.name}</p>
            <p><strong>Departamento:{' '}</strong>{employee.job_category.job.department.name}</p>
          </div>
        </div>
        <div className="my-5 mb-5 px-3 pb-5 border-b-2">
          <FormSection label={'Horas Extras'} fixedHeight={'full'}>
            <div className="relative mb-15">
              <div className="absolute top-3 right-15 h-8 w-full text-right font-bold">
                <p>Agregar H. Extras</p>
              </div>
              <div className="absolute top-2 right-4 h-8 w-8 text-center">
                <button className="border border-gray-300 rounded-full bg-indigo-500 h-10 w-10 p-2
                    focus:outline-none focus:shadow-outline hover:bg-indigo-700" type={'button'} onClick={openHXForm}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="whitesmoke">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
            { hx.length === 0 ? (
              <div className="text-center">
                <p>No hay horas extras</p>
              </div>
            ) : (
              <Table headers={['Realizadas en', 'A Cobrarse en', 'Nro. Horas', 'Tipo']}
                     values={hx.map((h) => {
                       return {
                         ...h,
                         realizadas_en: format(h.realizadas_en, 'dd/MM/yyyy'),
                         tipo: h.tipo === 50 ? '50%' : '100%'
                       };
                     })}
                     selectedFields={['realizadas_en', 'a_cobrar_en', 'cantidad', 'tipo']}/>
            )}
          </FormSection>
        </div>
        <div className="my-5 mb-5 px-3 pb-5 border-b-2">
          <FormSection label={'Conceptos Excepcionales'} fixedHeight={'full'}>
            <div className="relative mb-15">
              <div className="absolute top-3 right-15 h-8 w-full text-right font-bold">
                <p>Agregar concepto</p>
              </div>
              <div className="absolute top-2 right-4 h-8 w-8 text-center">
                <button className="border border-gray-300 rounded-full bg-indigo-500 h-10 w-10 p-2
                    focus:outline-none focus:shadow-outline hover:bg-indigo-700" type={'button'} onClick={openConceptForm}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="whitesmoke">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
            { personalConcepts.length === 0 ? (
              <div className="text-center">
                <p>No hay conceptos</p>
              </div>
            ) : (
              <Table headers={['Descripcion', 'Tipo', 'Efectivo en', 'Monto']}
                     values={concepts.map((c) => {
                       return {
                         ...c,
                         type: toType(c.type),
                         amount: formatter.format(c.amount),
                         status: toConceptoStatus(c.status)
                       };
                     })}
                     selectedFields={['description', 'type', 'period', 'amount']}/>
            )}
          </FormSection>
        </div>
        <div className="mb-5 px-3 pb-5">
          <FormSection label={'Recibos de sueldo'} fixedHeight={'full'}>
            { recibos.length === 0 ? (
              <div className="text-center">
                <p>No hay recibos</p>
              </div>
            ) : (
              <Table headers={['Periodo', 'Fecha Emision', 'Version', 'Estado', 'Acciones']}
                     values={recibos.map((r) => {
                       return {
                         ...r,
                         date: format(r.date, 'dd/MM/yyyy'),
                         status: toReciboStatus(r.status),
                         actions: (
                           <div>
                             <Link href={`/recibo/${r.recibo_id}`}>
                               <button className="whitespace-nowrap text-right text-sm font-medium text-indigo-600 hover:text-indigo-900">
                                 <p>Ver</p>
                               </button>
                             </Link>
                           </div>
                         )
                       };
                     })}
                     selectedFields={['period', 'date', 'version', 'status', 'actions']}/>
            )}

          </FormSection>
        </div>
        <SidePanel title={'Agregar concepto'} open={open} setOpen={setOpen} >
          <ConceptoUnicoForm onSubmit={submitConcept}/>
        </SidePanel>
        <SidePanel title={'Agregar horas extras'} open={openHX} setOpen={setOpenHX} >
          <HorasExtrasForm onSubmit={submitHX}/>
        </SidePanel>
      </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const employeeId = Number.parseInt(context.params.id, 10);

  const tabs = await UserService.getNavTabs(context);
  const employee = await EmployeeService.getEmployee(employeeId);
  const recibos = await ReciboService.getRecibos(employeeId);
  const personalConcepts = await ConceptService.getPersonalConcepts(employeeId);
  const horasExtras = await ConceptService.getHorasExtras(employeeId);

  return {
    props: {
      tabs,
      employee,
      recibos,
      personalConcepts,
      horasExtras
    }
  };

}, null);
