import { Concepto, Escala } from './Concepto';
import { concepto, concepto_tabla } from '@prisma/client';
import { ConceptoBuilder } from './ConceptoBuilder';

export function toModel(concepto: concepto & { concepto_tabla: concepto_tabla[] }) : Concepto {

  const builder: ConceptoBuilder = new ConceptoBuilder(null)
    .codigo(concepto.codigo)
    .nombre(concepto.nombre)
    .unidad(concepto.unidad)
    .grupo(concepto.grupo)
    .subGrupo(concepto.subgrupo)
    .seAplicaA(concepto.seaplicaa)
    .tipoConcepto(concepto.tipoconcepto)
    .columna(concepto.columna)
    .periodico(concepto.periodico);

  if (concepto.concepto_tabla && concepto.concepto_tabla.length > 0) {
    const escalas = [];
    concepto.concepto_tabla.forEach((linea) => {
      escalas.push(new Escala(linea.minimo, linea.maximo, linea.fijo, linea.porcentual));
    });
    builder.escalas(escalas);
  }

  builder
    .cantidad(parseNumberIfPossible(concepto.cantidad))
    .valor(parseNumberIfPossible(concepto.valor))
    .multiplicador(parseNumberIfPossible(concepto.multiplicador))
    .divisor(parseNumberIfPossible(concepto.divisor))
    .condicion(concepto.condicion);

  return builder.build();
}

export function toModelList(conceptos: concepto[]) : Concepto[] {
  return [];
}

export function toDBObject(concepto: Concepto) : concepto {
  return null;
}

export function toDBObjectList(concepto: Concepto[]) : concepto[] {
  return [];
}

function parseNumberIfPossible(val: string) : number | string {
  const parsed = parseFloat(val);
  if (Number.isNaN(parsed)) {
    return val;
  }
  return parsed;
}
