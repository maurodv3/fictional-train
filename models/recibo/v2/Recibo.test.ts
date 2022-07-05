import { Recibo } from './Recibo';
import { Puesto } from './Puesto';
import { CuentaBanco } from './Banco';
import { Empleado, Familiar, TipoFamiliar } from './Empleado';
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

    const santiago: Empleado = new Empleado();
    santiago.legajo = '0380';
    santiago.nombre = 'Santiago';
    santiago.apellido = 'Pidal';
    santiago.cuil = '20-123504171-4';
    santiago.dni = '123504171';
    santiago.fechaIngreso = new Date(2018, 1, 1);
    santiago.puesto = desarrollador;
    santiago.cuentaBanco = cuentaBanco;

    const esposa = new Familiar();
    esposa.nombre = 'Esposa';
    esposa.apellido = 'Pidal';
    esposa.fechaNacimiento = new Date(1995, 1, 1);
    esposa.cuil = '24-1234567-09';
    esposa.tipo = TipoFamiliar.CONJUGE;

    const hijo = new Familiar();
    hijo.nombre = 'Hijo';
    hijo.apellido = 'Pidal';
    hijo.fechaNacimiento = new Date(2018, 1, 1);
    hijo.cuil = '20-1234567-04';
    hijo.tipo = TipoFamiliar.HIJO;

    santiago.familiares = [esposa, hijo];

    const recibo: Recibo = new Recibo();
    recibo.empleado = santiago;
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

    const santiago: Empleado = new Empleado();
    santiago.legajo = '0380';
    santiago.nombre = 'Santiago';
    santiago.apellido = 'Pidal';
    santiago.cuil = '20-123504171-4';
    santiago.dni = '123504171';
    santiago.fechaIngreso = new Date(2018, 1, 1);
    santiago.puesto = desarrollador;
    santiago.cuentaBanco = cuentaBanco;

    const esposa = new Familiar();
    esposa.nombre = 'Esposa';
    esposa.apellido = 'Pidal';
    esposa.fechaNacimiento = new Date(1995, 1, 1);
    esposa.cuil = '24-1234567-09';
    esposa.tipo = TipoFamiliar.CONJUGE;
    esposa.ingresoDeclarado = 100_000;

    const hijo = new Familiar();
    hijo.nombre = 'Hijo';
    hijo.apellido = 'Pidal';
    hijo.fechaNacimiento = new Date(2018, 1, 1);
    hijo.cuil = '20-1234567-04';
    hijo.tipo = TipoFamiliar.HIJO;

    santiago.familiares = [esposa, hijo];

    const recibo: Recibo = new Recibo();
    recibo.empleado = santiago;
    recibo.horasExtras50 = 0;
    recibo.horasExtras100 = 1;
    recibo.conceptos = conceptos.map(toModel);

    recibo.load();

  });

});

export {};
