
export default function Recibo({ recibo, isEmpleado, entity }) {

  const formatter = Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  });

  const selectCol = (expected, linea) => {
    if (expected === linea[2]) {
      return formatter.format(linea[4]);
    }
    return '';
  };

  const ConceptoRow = ({ linea }) =>  (
    <tr key={linea[0]} className="w-full text-center">
      <td className="border-l border-r border-black">{linea[0]}</td>
      <td className="border-l border-r border-black">{linea[1]}</td>
      <td className="border-l border-r border-black">{isNaN(Number(linea[3])) ? '' : linea[3]}</td>
      <td className="border-l border-r border-black">{selectCol('0', linea)}</td>
      <td className="border-l border-r border-black">{selectCol('1', linea)}</td>
      <td className="border-l border-r border-black">{selectCol('2', linea)}</td>
    </tr>
  );

  return (<div className="bg-white border border-black">

    <div className="w-full flex p-2">
      <div className="w-1/4 flex justify-center pt-4">
        <img className="h-16 w-16" src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg" alt="Workflow logo"/>
      </div>
      <div className="border border-black w-2/4 pl-4 p-1">
        <p><strong>Empresa: </strong>{entity.display_name}</p>
        <p><strong>Domicilio: </strong>{entity.address}</p>
        <p><strong>C.U.I.T: </strong>{entity.identifier}</p>
      </div>
      <div className="w-1/4 text-center flex justify-center">
        <table className="w-3/4 px-4 border border-black">
          <tr className="border border-black">
            <th>
              C.U.I.L
            </th>
          </tr>
          <tr>
            <td>
              {recibo.cuil}
            </td>
          </tr>
          <tr className="border border-black">
            <th>
              Puesto
            </th>
          </tr>
          <tr>
            <td>
              {recibo.puesto}
            </td>
          </tr>
        </table>
      </div>
    </div>

    <div className="w-full p-2">
      <table className="w-full border border-black text-center">
        <tr className="border border-black">
          <th className="border border-black">Legajo</th>
          <th className="border border-black">Apellido y Nombre</th>
          <th className="border border-black">Documento</th>
          <th className="border border-black">Fecha de ingreso</th>
          <th className="border border-black">Sueldo o Jornal</th>
        </tr>
        <tr className="border border-black">
          <td className="border border-black">
            {recibo.legajo}
          </td>
          <td className="border border-black">
            {`${recibo.apellido} ${recibo.nombre}`}
          </td>
          <td className="border border-black">
            {recibo.documento}
          </td>
          <td className="border border-black">
            {recibo.fechaIngreso}
          </td>
          <td className="border border-black">
            {formatter.format(recibo.sueldo)}
          </td>
        </tr>
      </table>
    </div>

    <div className="w-full p-2">
      <div className="w-full flex">
        <div className="w-1/2 px-6">
          <table className="w-full border border-black text-center">
            <tr className="border border-black"><th colSpan={3}>Ultimo Deposito</th></tr>
            <tr className="border border-black">
              <th className="border border-black">Fecha</th>
              <th className="border border-black">Lapso</th>
              <th className="border border-black">Banco</th>
            </tr>
            <tr className="border border-black">
              <td className="border border-black">{recibo.udFecha}</td>
              <td className="border border-black">{recibo.udLapso}</td>
              <td className="border border-black">{recibo.udBanco}</td>
            </tr>
          </table>
        </div>
        <div className="w-1/2 px-6">
          <table className="w-full border border-black text-center">
            <tr className="border border-black"><th colSpan={3}>Liquidacion</th></tr>
            <tr className="border border-black">
              <th className="border border-black">Fecha</th>
              <th className="border border-black">Mes/Año</th>
            </tr>
            <tr className="border border-black">
              <td className="border border-black">{recibo.ulFecha}</td>
              <td className="border border-black">{recibo.ulLapso}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <div className="flex pl-8 p-2">
      <div className="w-1/3">
        <p><strong>Depositado en cuenta: </strong>{recibo.cbBanco}</p>
      </div>
      <div className="w-1/3">
        <p>Tipo: {recibo.cbTipo}</p>
      </div>
      <div className="w-1/3">
        <p>Nro: {recibo.cbNro}</p>
      </div>
    </div>

    <div className="w-full p-2">
      <table className="w-full text-center">
        <tr className="w-full border border-black text-center">
          <th className="border border-black">Codigo</th>
          <th className="border border-black">Concepto</th>
          <th className="border border-black">Hora/Dias/%</th>
          <th className="border border-black">Haberes C/Desc</th>
          <th className="border border-black">Haberes S/Desc</th>
          <th className="border border-black">Deducciones</th>
        </tr>
        {recibo.lineas.map(l => <ConceptoRow linea={l}/>)}
        <tr className="w-full border-t border-black text-center">
          <th className="h-2" colSpan={6}></th>
        </tr>
        <tr className="w-full border border-black text-center">
          <th className="border border-black" colSpan={3}>Lugar de pago</th>
          <th className="border border-black">Total haberes C/desc</th>
          <th className="border border-black">Total haberes S/desc</th>
          <th className="border border-black">Total Deducciones</th>
        </tr>
        <tr className="w-full border border-black text-center">
          <td className="border border-black" colSpan={3}>{recibo.lugarPago}</td>
          <td className="border border-black">{formatter.format(recibo.totalHaberesCDesc)}</td>
          <td className="border border-black">{formatter.format(recibo.totalHaberesSDesc)}</td>
          <td className="border border-black">{formatter.format(recibo.totalDeducciones)}</td>
        </tr>
      </table>
    </div>

    <div className="p-2">
      <div className="w-full border border-black">
        <div className="flex p-1">
          <div className="w-2/3 p-2 pl-16">
            <p><strong>Son pesos:</strong></p>
            <p>{recibo.netoEnLetras}</p>
          </div>
          <div className="w-1/3 text-center p-2">
            <table className="w-3/4 border border-black">
              <tr>
                <th className="border border-black">NETO A COBRAR</th>
              </tr>
              <tr>
                <td>{formatter.format(recibo.neto)}</td>
              </tr>
            </table>
          </div>
        </div>
        <div className="h-4"></div>
        <div className="flex p-1 text-center">
          <div className="w-2/3 p-3">
            { isEmpleado ? (
              <p><strong>LA PRESENTE LIQUIDACION ES COPIA DEL RECIBO FIRMADO
                <br/> QUE OBRA EN PODER DE LA EMPRESA COMO COMPROBANTE DE PAGO</strong></p>
            ) : null }
          </div>
          <div className="flex w-1/3 p-5 justify-end">
            <table>
              <tr>
                <td className="italic no-print">
                  { isEmpleado ? `${entity.entity_liable[0].last_name} ${entity.entity_liable[0].first_name}` : ' '}
                </td>
              </tr>
              <tr>
                <th className="border-t border-black">
                  { isEmpleado ? 'Firma del empleador' : 'Firma del empleado' }
                </th>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>);

}
