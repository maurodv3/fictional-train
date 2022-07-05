import ConceptoCalculator from './ConceptoCalculator';
import { Recibo } from './Recibo';

const PARAMETER_REGEX = /\$\.[a-z\d%]*/ig;

export class Concepto {

  id: number;
  recibo: Recibo;

  codigo: number;
  nombre: string;
  unidad: Unidad;

  cantidad: number | string;
  tipoConcepto: TipoConcepto;
  columna: Columna;

  grupo: string;
  subGrupo: string;
  seAplicaA: string[]; // Se calcula sobre grupo/subgrupo

  escalas: Escala[] = [];

  valor: number | string;
  multiplicador: number | string = 1;
  divisor: number | string = 1;

  condicion: string = null;
  periodico: boolean = true;

  constructor(recibo: Recibo) {
    this.recibo = recibo;
  }

  calcular() : number {
    return ConceptoCalculator
      .getConceptoCalculator(this.tipoConcepto)
      .calculate(this);
  }

  evaluar() : boolean {
    if (this.condicion == null) {
      return true;
    }

    const matches: string[] = this.condicion.match(PARAMETER_REGEX);
    let compiled : string = this.condicion;
    for (const match of matches) {
      const value = this.get(match);
      compiled = compiled.replace(match, String(value));
    }

    let result = null;
    try {
      // tslint:disable-next-line:no-eval
      result = eval(compiled);
    } catch (err) {
      console.error(`Error on ${this.codigo}-${this.nombre} - Expression: ${this.condicion}`);
      throw err;
    }

    if (typeof result === 'boolean') {
      return result;
    }

    throw new Error('Returned expression is not boolean.');

  }

  getCantidad() : number {
    return this.get(this.cantidad);
  }

  getValor() : number {
    return this.get(this.valor);
  }

  getMultiplicador() : number {
    return this.get(this.multiplicador);
  }

  getDivisor() : number {
    return this.get(this.divisor);
  }

  private get(value: number | string) : number {
    if (typeof value === 'string') {
      return this.recibo.get(<string>value);
    }
    return <number>value;
  }

}

export class Escala {

  minimo: number;
  maximo: number;
  fijo: number;
  porcentual: number;

  constructor(minimo: number, maximo: number, fijo: number, porcentual: number) {
    this.minimo = minimo;
    this.maximo = maximo;
    this.fijo = fijo;
    this.porcentual = porcentual;
  }
}

export enum Unidad {
  HORA,
  DIA,
  PORCENTAJE,
  NA
}

export enum TipoConcepto {
  FIJO,
  PORCENTAJE,
  CALCULADO,
  FIJO_TABLA
}

export enum Columna {
  REMUNERATIVO,
  NO_REMUNERATIVO,
  DEDUCCCIONES
}
