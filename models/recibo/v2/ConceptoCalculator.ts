import { Concepto, TipoConcepto } from './Concepto';

class ConceptoCalculatorFactory {

  getConceptoCalculator(tipo: TipoConcepto) : ConceptoCalculator {
    switch (tipo) {
      case TipoConcepto.FIJO_TABLA: return new FijoTabla();
      case TipoConcepto.CALCULADO: return new Calculado();
      case TipoConcepto.PORCENTAJE: return new Porcentaje();
      case TipoConcepto.FIJO: return new ConceptoFijo();
      default:
    }

  }

}

export default new ConceptoCalculatorFactory();

interface ConceptoCalculator {

  calculate(concepto: Concepto) : number;

}

// Implementations.

class ConceptoFijo implements ConceptoCalculator {

  calculate(concepto: Concepto) : number {
    return concepto.getValor();
  }

}

class Porcentaje implements ConceptoCalculator {

  calculate(concepto: Concepto) : number {
    return (concepto.getValor() * concepto.getCantidad()) / 100;
  }

}

class FijoTabla implements ConceptoCalculator {

  calculate(concepto: Concepto) : number {
    const totalIngreso = concepto.recibo.getIngresoTotalHogar();
    const valores = concepto.escalas.filter(escala => escala.minimo <= totalIngreso && escala.maximo >= totalIngreso);
    if (valores.length === 0) {
      console.info(`Ningun valor se encotro por tabla para Concepto: [${concepto.nombre}] - Empleado: [${concepto.recibo.empleado.cuil}].`);
      return 0;
    }
    if (valores.length > 1) {
      console.warn(`Se encontro mas de un valor por tabla para Concepto: [${concepto.nombre}] - Empleado: [${concepto.recibo.empleado.cuil}]. Esto puede indicar que la tabla esta mal cargada.`);
    }
    return valores[0].fijo;
  }

}

class Calculado implements ConceptoCalculator {

  calculate(concepto: Concepto) : number {
    return (concepto.getValor() / concepto.getDivisor()) * concepto.getMultiplicador() * concepto.getCantidad();
  }

}
