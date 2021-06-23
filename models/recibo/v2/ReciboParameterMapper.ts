import { Recibo } from './Recibo';

class Param {

  references: string;
  placeholder: string;
  description: string;
  extractor: (recibo: Recibo) => number;

  constructor(references: string, placeholder: string, description: string, extractor: (recibo: Recibo) => number) {
    this.references = references;
    this.placeholder = placeholder;
    this.description = description;
    this.extractor = extractor;
  }

}

const PARAMS : Param[] = [
  new Param('Sueldo Basico', '$.basico', '', r => r.sueldo),
  new Param('Jornada', '$.jornada', '', r => r.duracionJornada),
  new Param('Antiguedad', '$.antiguedad', '', r => r.empleado.getAntiguedad(r.fechaGeneracion)),
  new Param('Horas Extras 50%', '$.horasExtras50%', '', r => r.horasExtras50),
  new Param('Horas Extras 100%', '$.horasExtras100%', '', r => r.horasExtras100),
  new Param('Hijos Sin Discapacidades', '$.hijosNoDiscapacitados', '', r => r.empleado.getHijosMenores().filter(hijo => !hijo.discapacitado).length),
  new Param('Hijos Con Discapacidades', '$.hijosDiscapacitados', '', r => r.empleado.getHijosMenores().filter(hijo => hijo.discapacitado).length),
  new Param('No Definido', '$.na', 'No necesario para el calculo', r => null)
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
