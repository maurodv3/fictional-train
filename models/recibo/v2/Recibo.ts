import { Empleado } from './Empleado';
import { Deposito } from './Banco';
import { Columna, Concepto } from './Concepto';
import { ReciboParameterMapper } from './ReciboParameterMapper';
import { ConceptoCalculado } from './ConceptoCalculado';

export class Recibo {

  parameterMapper: ReciboParameterMapper;

  empleado: Empleado;
  sueldo : number;
  duracionJornada: number = 180; // 180 horas mensuales;

  ultimmoDeposito: Deposito;

  liquidacionFecha: Date;
  liquidacionPeriodo: Date;

  conceptos: Concepto[] = [];
  calculados: ConceptoCalculado[] = [];

  horasExtras50: number = 0;
  horasExtras100: number = 0;

  fechaGeneracion: Date;

  constructor() {
    this.fechaGeneracion = new Date();
    this.parameterMapper = new ReciboParameterMapper(this);
  }

  load() {

    this.sueldo = this.empleado.puesto.sueldo;

    for (const concepto of this.conceptos) {

      concepto.recibo = this;

      if (!concepto.evaluar()) {
        continue;
      }

      if (concepto.seAplicaA.length === 0) {
        this.calculados.push(new ConceptoCalculado(concepto));
      } else {
        concepto.valor = this.calculados
          .filter(concepto => concepto.matches([concepto.grupo, concepto.subGrupo]))
          .reduce(((acc, c) => acc + c.calculo), 0);
        this.calculados.push(new ConceptoCalculado(concepto));
      }

    }

    console.log(this.calculados.map(cc => `${cc.concepto.nombre} - ${cc.calculo}`));

  }

  get(placeholder: string) : number {
    return this.parameterMapper.get(placeholder);
  }

  getIngresoTotalHogar() : number {
    const ingresoFamilia = this.empleado.familiares
      .reduce(((acc, a) => acc + a.ingresoDeclarado), 0);
    const ingresoEmpleado = this.calculados
      .filter(calculado => calculado.concepto.columna === Columna.HABERES_CON_DESCUENTO)
      .reduce(((acc, c) => acc + c.calculo), 0);
    return ingresoEmpleado + ingresoFamilia;
  }

}
