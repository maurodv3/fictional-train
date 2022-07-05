import { Categoria, Puesto } from './Puesto';
import { CuentaBanco, Deposito } from './Banco';
import { bank_accounts, bank_deposits, concepto_unico, employee, employee_familiar, horas_extra, job, job_category, recibos } from '@prisma/client';

export class Empleado {

  id: number;

  cuil: string;
  legajo: string;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: Date;

  fechaIngreso: Date;

  puesto: Puesto;

  cuentaBanco: CuentaBanco;
  ultimoDeposito: Deposito;

  mesesTrabajados: number;
  mayorRemuneracionPercibida: number;

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

function toTipoFamiliar(rel: string) : TipoFamiliar {
  switch (rel) {
    case 'Conjuge': return TipoFamiliar.CONJUGE;
    case 'Hijo': return TipoFamiliar.HIJO;
    default: return TipoFamiliar.OTRO;
  }
}

function toAccountType(type: number) : string {
  switch (type) {
    case 0: return 'Caja de ahorro';
    case 1: return 'Cuenta corriente';
    default: return '';
  }
}

export function toModel(
  db: employee & {
    employee_familiar: employee_familiar[],
    concepto_unico: concepto_unico[],
    job_category: job_category & { job: job },
    bank_accounts: bank_accounts[],
    bank_deposits: bank_deposits[],
    recibos: recibos[],
    horas_extra: horas_extra[]
  }
) : Empleado {

  const empleado = new Empleado();
  empleado.id = db.employee_id;

  // Create family
  empleado.familiares = db.employee_familiar.map((familiar) => {
    const fam = new Familiar();
    fam.cuil = familiar.identifier;
    fam.nombre = familiar.name;
    fam.apellido = familiar.lastname;
    fam.tipo = toTipoFamiliar(familiar.relationship);
    fam.fechaNacimiento = familiar.birth_date;
    fam.ingresoDeclarado = familiar.annual_salary;
    fam.discapacitado = familiar.handicap;
    return fam;
  });

  // Create employee data
  empleado.nombre = db.name;
  empleado.apellido = db.lastname;
  empleado.cuil = db.identifier;
  empleado.fechaIngreso = db.start_date;
  empleado.legajo = String(db.employee_id);

  // Create job data
  const puesto = new Puesto();
  const categoria = new Categoria();
  categoria.nombre = db.job_category.name;
  categoria.aumentoPorc = db.job_category.percentage_raise;
  categoria.aumentoFijo = db.job_category.fixed_raise;
  puesto.categoria = categoria;
  puesto.nombre = db.job_category.job.name;
  puesto.sueldo = db.job_category.job.base_salary;
  empleado.puesto = puesto;

  const dbBank = db.bank_accounts[0];
  const cuentaBanco = new CuentaBanco();
  cuentaBanco.banco = dbBank.bank_name;
  cuentaBanco.tipo = toAccountType(dbBank.bank_account_type);
  cuentaBanco.numero = dbBank.bank_number;
  empleado.cuentaBanco = cuentaBanco;

  const dbDep = db.bank_deposits[0];
  if (dbDep) {
    const ultDeposito = new Deposito();
    ultDeposito.banco = dbDep.bank_name;
    ultDeposito.fecha = dbDep.date;
    ultDeposito.lapso = dbDep.lapse;
    empleado.ultimoDeposito = ultDeposito;
  }

  empleado.mesesTrabajados = db.recibos.length;
  empleado.mayorRemuneracionPercibida = Math.max(0, ...db.recibos.map(r => r.data['neto']));

  return empleado;
}
