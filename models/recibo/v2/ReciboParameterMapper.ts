import { Recibo } from './Recibo';
import Variables from '@model/recibo/v2/Variables';

class Param {

  references: string;
  placeholder: string;
  description: string;
  extractor: (recibo: Recibo) => number;

  constructor(variable: { symbol: string; name: string; desc: string; }, extractor: (recibo: Recibo) => number) {
    this.references = variable.name;
    this.placeholder = variable.symbol;
    this.description = variable.desc;
    this.extractor = extractor;
  }

}

const PARAMS : Param[] = [
  new Param(Variables.BASICO, r => r.sueldo),
  new Param(Variables.JORNADA, r => r.duracionJornada),
  new Param(Variables.ANTIGUEDAD, r => r.empleado.getAntiguedad(r.fechaGeneracion)),
  new Param(Variables.HORAS_EXTRAS_50, r => r.horasExtras50),
  new Param(Variables.HORAS_EXTRAS_100, r => r.horasExtras100),
  new Param(Variables.HIJO_S_DISC, r => r.empleado.getHijosMenores().filter(hijo => !hijo.discapacitado).length),
  new Param(Variables.HIJO_C_DISC, r => r.empleado.getHijosMenores().filter(hijo => hijo.discapacitado).length),
  new Param(Variables.NA, r => null),
  new Param(Variables.MAYOR_REMUN, r => r.empleado.mayorRemuneracionPercibida),
  new Param(Variables.MES, r => new Date().getMonth() + 1),
  new Param(Variables.MESES_TRABAJADOS, r => r.empleado.mesesTrabajados)
];

export class ReciboParameterMapper {

  paramMap: Map<string, Param>;
  recibo: Recibo;

  constructor(recibo: Recibo) {
    this.recibo = recibo;
    this.paramMap = new Map(PARAMS.map(param => [param.placeholder, param]));
  }

  get(placeholder: string) : number {
    try {
      return this.paramMap
        .get(placeholder)
        .extractor(this.recibo);
    } catch (err) {
      console.error(`${placeholder} not found.`, err);
      throw err;
    }
  }

}
