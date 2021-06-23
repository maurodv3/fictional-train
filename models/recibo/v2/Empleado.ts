import { Puesto } from './Puesto';
import { CuentaBanco } from './Banco';

export class Empleado {

  cuil: string;
  legajo: string;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: Date;

  fechaIngreso: Date;

  puesto: Puesto;

  cuentaBanco: CuentaBanco;

  familiares: Familiar[] = [];

  getAntiguedad(since: Date) : number {
    return new Date(since.getTime() - this.fechaIngreso.getTime()).getFullYear() - 1970;
  }

  getHijosMenores() : Familiar[] {
    return this.familiares
      .filter(familiar => familiar.tipo === TipoFamiliar.HIJO)
      .filter(familiar => familiar.isMinor());
  }

}

export class Familiar {
  cuil: string;
  nombre: string;
  apellido: string;
  tipo: TipoFamiliar;
  ingresoDeclarado: number = 0;
  discapacitado: boolean = false;
  fechaNacimiento: Date;

  isMinor() : boolean {
    return (new Date(new Date().getDate() - this.fechaNacimiento.getDate()).getFullYear() - 1970) < 18;
  }

}

export enum TipoFamiliar {
  CONJUGE,
  HIJO,
  OTRO
}

export enum EstadoCivil {
  SOLTERO,
  CASADO,
  VIUDO
}
