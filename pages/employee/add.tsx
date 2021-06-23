import Navbar from '@components/Navbar';
import { GetServerSideProps } from 'next';
import withSecureAccess from '@middlewares/secured';
import UserService from '@services/UserService';
import { Form, Formik } from 'formik';
import FormSection from '@components/FormSection';
import FormSubmit from '@components/FormSubmit';
import FormInput from '@components/FormInput';

export default function AddEmployee({ tabs }) {
  return (
    <Navbar tabs={tabs} withHeader={<p>Agregar Empleado</p>}>
      <Formik initialValues={{}} onSubmit={() => console.log('SUBMIT')}>
        <Form>
          <div className="px-2">
            <FormSection label={'Datos personales'} fixedHeight={'full'}>
              <div className="flex">
                <div className="px-2 w-1/2">
                  <FormInput id={'nombre'} name={'nombre'} label={'Nombre'} placeholder={'Nombre'}/>
                </div>
                <div className="px-2 w-1/2">
                  <FormInput id={'apellido'} name={'apellido'} label={'Apellido'} placeholder={'Apellido'}/>
                </div>
              </div>
              <div className="flex">
                <div className="px-2">
                  <FormInput id={'CUIL'} name={'CUIL'} label={'CUIL'} placeholder={'CUIL'}/>
                </div>
              </div>
              <div className="flex">
                <div className="px-2 w-2/6">
                  <FormInput id={'Fecha Nacimiento'} name={'Fecha Nacimiento'} label={'Fecha de nacimiento'} placeholder={'Fecha de nacimiento'}/>
                </div>
                <div className="px-2 w-4/6">
                  <FormInput id={'Domicilio'} name={'Domicilio'} label={'Domicilio'} placeholder={'Domicilio'}/>
                </div>
              </div>
              <div className="flex">
                <div className="px-2 w-full">
                  <FormInput id={'E-MailP'} name={'E-MailP'} label={'E-Mail Personal'} placeholder={'E-Mail Personal'}/>
                </div>
              </div>
              <div className="px-2">
                <label className="block font-bold text-sm font-medium text-gray-700">
                  Foto personal
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload"
                             className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Agregar imagen</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only"/>
                      </label>
                      <p className="pl-1">o arrastrar hasta aqui</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF hasta 10MB
                    </p>
                  </div>
                </div>
              </div>
            </FormSection>
          </div>
          <div className="mt-5 px-2 py-5 border-t border-gray-300">
            <FormSection label={'Datos laborales'} fixedHeight={'full'}>
              <div className="flex mb-4">
                <div className="px-2">
                  <p className="text-sm text-gray-700 font-bold mb-2">Area</p>
                  <select className="px-3 py-2 w-48 std-data-input capitalize text-md text-gray-700">
                    <option>-</option>
                    <option>Ventas</option>
                    <option>Compras</option>
                    <option>Distribucion</option>
                  </select>
                </div>
                <div className="px-2">
                  <p className="text-sm text-gray-700 font-bold mb-2">Puesto</p>
                  <select className="px-3 py-2 w-48 std-data-input capitalize text-md text-gray-700">
                    <option>-</option>
                    <option>Vendedor</option>
                    <option>Repositor</option>
                    <option>Repartidor</option>
                  </select>
                </div>
              </div>
              <div className="flex">
                  <div className="px-2">
                    <FormInput id={'Encargado'} name={'Encargado'} label={'Encargado'} placeholder={'Encargado'}/>
                  </div>
              </div>
              <div className="flex">
                <div className="px-2 w-full">
                  <FormInput id={'E-MailT'} name={'E-MailT'} label={'E-Mail Laboral'} placeholder={'E-Mail Laboral'}/>
                </div>
              </div>
              <div className="flex">
                <div className="px-2 w-1/4">
                  <FormInput id={'Fecha Ingreso'} name={'Fecha Ingreso'} label={'Fecha Ingreso'} placeholder={'Fecha Ingreso'}/>
                </div>
              </div>

            </FormSection>
          </div>
          <div className="mt-5 px-2 py-5 border-t border-gray-300" >
            <FormSection label={'Confirmar'} fixedHeight={'full'}>
              <div className="pt-3 flex flex-row-reverse text-right">
                <FormSubmit disabled={true}>
                  <p>{'Agregar Empleado'}</p>
                </FormSubmit>
              </div>
            </FormSection>
          </div>
        </Form>
      </Formik>
    </Navbar>
  );
}

export const getServerSideProps: GetServerSideProps = withSecureAccess(async (context) => {

  const tabs = await UserService.getNavTabs(context);

  return {
    props: {
      tabs
    }
  };
}, null);
