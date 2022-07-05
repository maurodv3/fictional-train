import { Empleado } from './Empleado';
import { Deposito } from './Banco';
import { Columna, Concepto } from './Concepto';
import { ReciboParameterMapper } from './ReciboParameterMapper';
import { ConceptoCalculado } from './ConceptoCalculado';
// @ts-ignore
import { numeroALetras } from '../../../utils/numberToWords';

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
  lineas: string[][] = [];

  horasExtras50: number = 0;
  horasExtras100: number = 0;

  fechaGeneracion: Date;

  totalHaberesCDesc = 0;
  totalHaberesSDesc = 0;
  totalDeducciones = 0;

  neto: number = 0;
  netoEnLetras: string = '';

  constructor() {
    this.fechaGeneracion = new Date();
    this.parameterMapper = new ReciboParameterMapper(this);
  }

  load() {

    this.sueldo = this.empleado.puesto.getSueldo();

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

    console.log('Completed');
    console.log(this.calculados.map(cc => `${cc.concepto.nombre} - ${cc.calculo}`));

    this.calculados.map((cc) => {
      this.lineas.push([
        String(cc.concepto.codigo),
        cc.concepto.nombre,
        cc.concepto.columna.toString(),
        String(typeof cc.concepto.cantidad === 'string' ? this.get(cc.concepto.cantidad) : cc.concepto.cantidad),
        String(cc.calculo)
      ]);
    });

    this.totalHaberesCDesc = this.round(
      this.calculados.filter(cc => cc.concepto.columna === 0).reduce(((acc, c) => acc + c.calculo), 0));
    this.totalHaberesSDesc = this.round(
      this.calculados.filter(cc => cc.concepto.columna === 1).reduce(((acc, c) => acc + c.calculo), 0));
    this.totalDeducciones = this.round(
      this.calculados.filter(cc => cc.concepto.columna === 2).reduce(((acc, c) => acc + c.calculo), 0));

    this.neto = this.round(this.totalHaberesCDesc + this.totalHaberesSDesc - this.totalDeducciones);
    this.netoEnLetras = numeroALetras(this.neto);

    // Delete this to avoid circular reference after calculations
    this.conceptos = [];
    this.parameterMapper = null;

  }

  get(placeholder: string) : number {
    return this.parameterMapper.get(placeholder);
  }

  getIngresoTotalHogar() : number {
    const ingresoFamilia = this.empleado.familiares
      .reduce(((acc, a) => acc + a.ingresoDeclarado), 0);
    const ingresoEmpleado = this.calculados
      .filter(calculado => calculado.concepto.columna === Columna.NO_REMUNERATIVO)
      .reduce(((acc, c) => acc + c.calculo), 0);
    return ingresoEmpleado + ingresoFamilia;
  }

  private round(n) : number {
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }

}
