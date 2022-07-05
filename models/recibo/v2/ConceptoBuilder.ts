import { Columna, Concepto, Escala, TipoConcepto, Unidad } from './Concepto';
import { Recibo } from './Recibo';

export class ConceptoBuilder {

  private readonly _concepto : Concepto;

  constructor(recibo: Recibo) {
    this._concepto = new Concepto(recibo);
  }

  build() : Concepto {
    return this._concepto;
  }

  id(id: number) : ConceptoBuilder {
    this._concepto.id = id;
    return this;
  }

  codigo(codigo: number) : ConceptoBuilder {
    this._concepto.codigo = codigo;
    return this;
  }

  nombre(nombre: string) : ConceptoBuilder {
    this._concepto.nombre = nombre;
    return this;
  }

  unidad(unidad: Unidad) : ConceptoBuilder {
    this._concepto.unidad = unidad;
    return this;
  }

  cantidad(cantidad: number | string) : ConceptoBuilder {
    this._concepto.cantidad = cantidad;
    return this;
  }

  tipoConcepto(tipoConcepto: TipoConcepto) : ConceptoBuilder {
    this._concepto.tipoConcepto = tipoConcepto;
    return this;
  }

  columna(columna: Columna) : ConceptoBuilder {
    this._concepto.columna = columna;
    return this;
  }

  grupo(grupo: string) : ConceptoBuilder {
    this._concepto.grupo = grupo;
    return this;
  }

  subGrupo(subGrupo: string) : ConceptoBuilder {
    this._concepto.subGrupo = subGrupo;
    return this;
  }

  seAplicaA(seAplicaA: string[]) : ConceptoBuilder {
    this._concepto.seAplicaA = seAplicaA;
    return this;
  }

  escalas(escalas: Escala[]) : ConceptoBuilder {
    this._concepto.escalas = escalas;
    return this;
  }

  valor(valor: number | string) : ConceptoBuilder {
    this._concepto.valor = valor;
    return this;
  }

  multiplicador(multiplicador: number | string) : ConceptoBuilder {
    this._concepto.multiplicador = multiplicador;
    return this;
  }

  divisor(divisor: number | string) : ConceptoBuilder {
    this._concepto.divisor = divisor;
    return this;
  }

  condicion(condicion: string) : ConceptoBuilder {
    this._concepto.condicion = condicion;
    return this;
  }

  periodico(periodico: boolean) : ConceptoBuilder {
    this._concepto.periodico = periodico;
    return this;
  }

}
