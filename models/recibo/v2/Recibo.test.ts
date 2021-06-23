import { Recibo } from './Recibo';
import { Puesto } from './Puesto';
import { CuentaBanco } from './Banco';
import { Empleado, Familiar, TipoFamiliar } from './Empleado';
import { ConceptoCalculado } from './ConceptoCalculado';
import DatabaseConnection from '../../../prisma/DatabaseConnection';
import { toModel } from './ConceptoMapper';

describe('asd', () => {

  it('asd', async () => {

    const desarrollador: Puesto = new Puesto();
    desarrollador.nombre = 'Desarollador de Software';
    desarrollador.categoria = 'Senior';
    desarrollador.sueldo = 110_000;

    const cuentaBanco: CuentaBanco = new CuentaBanco();
    cuentaBanco.tipo = 'Caja de ahorro';
    cuentaBanco.numero = '123456';

    const mauro: Empleado = new Empleado();
    mauro.legajo = '0380';
    mauro.nombre = 'Mauro';
    mauro.apellido = 'Vidal';
    mauro.cuil = '20-35505180-4';
    mauro.dni = '35505180';
    mauro.fechaIngreso = new Date(2018, 1, 1);
    mauro.puesto = desarrollador;
    mauro.cuentaBanco = cuentaBanco;

    const esposa = new Familiar();
    esposa.nombre = 'Esposa';
    esposa.apellido = 'Vidal';
    esposa.fechaNacimiento = new Date(1995, 1, 1);
    esposa.cuil = '24-1234567-09';
    esposa.tipo = TipoFamiliar.CONJUGE;

    const hijo = new Familiar();
    hijo.nombre = 'Hijo';
    hijo.apellido = 'Vidal';
    hijo.fechaNacimiento = new Date(2018, 1, 1);
    hijo.cuil = '20-1234567-04';
    hijo.tipo = TipoFamiliar.HIJO;

    mauro.familiares = [esposa, hijo];

    const recibo: Recibo = new Recibo();
    recibo.empleado = mauro;
    recibo.horasExtras50 = 0;
    recibo.horasExtras100 = 1;

    recibo.load();

  });

  it('qwe', async () => {

    const db = DatabaseConnection.getConnection();
    const conceptos = await db.concepto.findMany({
      where: {
        periodico: true
      },
      orderBy: {
        codigo: 'asc'
      },
      include: {
        concepto_tabla: true
      }
    });

    const desarrollador: Puesto = new Puesto();
    desarrollador.nombre = 'Desarollador de Software';
    desarrollador.categoria = 'Senior';
    desarrollador.sueldo = 110_000;

    const cuentaBanco: CuentaBanco = new CuentaBanco();
    cuentaBanco.tipo = 'Caja de ahorro';
    cuentaBanco.numero = '123456';

    const mauro: Empleado = new Empleado();
    mauro.legajo = '0380';
    mauro.nombre = 'Mauro';
    mauro.apellido = 'Vidal';
    mauro.cuil = '20-35505180-4';
    mauro.dni = '35505180';
    mauro.fechaIngreso = new Date(2018, 1, 1);
    mauro.puesto = desarrollador;
    mauro.cuentaBanco = cuentaBanco;

    const esposa = new Familiar();
    esposa.nombre = 'Esposa';
    esposa.apellido = 'Vidal';
    esposa.fechaNacimiento = new Date(1995, 1, 1);
    esposa.cuil = '24-1234567-09';
    esposa.tipo = TipoFamiliar.CONJUGE;
    esposa.ingresoDeclarado = 100_000;

    const hijo = new Familiar();
    hijo.nombre = 'Hijo';
    hijo.apellido = 'Vidal';
    hijo.fechaNacimiento = new Date(2018, 1, 1);
    hijo.cuil = '20-1234567-04';
    hijo.tipo = TipoFamiliar.HIJO;

    mauro.familiares = [esposa, hijo];

    const recibo: Recibo = new Recibo();
    recibo.empleado = mauro;
    recibo.horasExtras50 = 0;
    recibo.horasExtras100 = 1;
    recibo.conceptos = conceptos.map(toModel);

    recibo.load();

  });

});

export {};
