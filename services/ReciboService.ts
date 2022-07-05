import { PrismaClient, users } from '@prisma/client';
import DatabaseConnection from '@database/DatabaseConnection';
import { Recibo } from '@model/recibo/v2/Recibo';
import { toModel } from '@model/recibo/v2/Empleado';
import { toModelList } from '@model/recibo/v2/ConceptoMapper';
import { endOfMonth, format, isSaturday, isSunday, subDays } from 'date-fns';
import FinancialPeriodService from '@services/FinancialPeriodService';
import AccountService from '@services/AccountService';
import EntryService from '@services/EntryService';
import { ConceptoBuilder } from '@model/recibo/v2/ConceptoBuilder';
import { Columna, TipoConcepto, Unidad } from '@model/recibo/v2/Concepto';

const ReciboService = (database: PrismaClient) => {

  const caculateFechaLiquidacion = () => {
    let fl = endOfMonth(new Date());
    if (isSaturday(fl)) {
      fl = subDays(fl, 1);
    }
    if (isSunday(fl)) {
      fl = subDays(fl, 2);
    }
    return fl;
  };

  const buildRecibos = async () => {

    const fechaLiquidacion = caculateFechaLiquidacion();
    const lapsoLiquidacion = format(fechaLiquidacion, 'MM/yy');

    const employees = await database.employee.findMany({
      include: {
        employee_familiar: true,
        bank_accounts: true,
        bank_deposits: {
          orderBy: {
            date: 'desc'
          },
          take: 1
        },
        job_category: {
          include: {
            job: {
              include: {
                concepto_job: {
                  include: {
                    concepto: {
                      include: {
                        concepto_tabla: true
                      }
                    }
                  }
                },
                department: true
              }
            }
          }
        },
        recibos: {
          orderBy: {
            date: 'desc'
          },
          where: {
            period: {
              not: {
                equals: lapsoLiquidacion // Don't count other versions of the same period
              }
            }
          },
          take: 6
        },
        horas_extra: {
          where: {
            a_cobrar_en: lapsoLiquidacion
          }
        },
        concepto_unico: {
          where: {
            period: lapsoLiquidacion
          }
        }
      }
    });

    const liquidaciones = await database.liquidacion.findMany({
      where: {
        lapso: lapsoLiquidacion
      }
    });

    const version = liquidaciones.length;

    const recibos = employees.map((e) => {
      const r = new Recibo();
      r.liquidacionFecha = fechaLiquidacion;
      r.liquidacionPeriodo = fechaLiquidacion;
      r.empleado = toModel(e);
      r.horasExtras50 = e.horas_extra.filter(hx => hx.tipo === 50).reduce(((acc, r) => acc + r.cantidad), 0);
      r.horasExtras100 = e.horas_extra.filter(hx => hx.tipo === 100).reduce(((acc, r) => acc + r.cantidad), 0);
      r.conceptos = toModelList(e.job_category.job.concepto_job.map(cj => cj.concepto));
      r.conceptos.push(...e.concepto_unico.map((cu) => {
        return new ConceptoBuilder(null)
          .id(-1)
          .codigo(299)
          .nombre(cu.description)
          .periodico(false)
          .columna(Columna.NO_REMUNERATIVO)
          .valor(cu.amount * cu.type)
          .grupo('G2')
          .tipoConcepto(TipoConcepto.FIJO)
          .seAplicaA([])
          .unidad(Unidad.NA)
          .build();
      }));
      r.conceptos.sort((a, b) => a.codigo - b.codigo);
      r.load();
      return r;
    });

    const netoTotal = recibos.reduce(((acc, r) => acc + r.neto), 0);
    const brutoTotal = recibos.reduce(((acc, r) => acc + r.totalHaberesCDesc), 0);
    const deduccionesTotal = recibos.reduce(((acc, r) => acc + r.totalDeducciones), 0);

    const created = await database.liquidacion.create({
      data: {
        version,
        lapso: lapsoLiquidacion,
        fecha: fechaLiquidacion,
        bruto_total: brutoTotal,
        deduciones_total: deduccionesTotal,
        neto_total: netoTotal,
        status: 0,
        recibos: {
          create: recibos.map((r) => {
            return {
              version,
              data: reciboFlatten(r),
              date: r.fechaGeneracion,
              status: 0,
              period: lapsoLiquidacion,
              employee: {
                connect: {
                  employee_id: r.empleado.id
                }
              }
            };
          })
        }
      }
    });

    return recibos;

  };

  const getRecibos = async (employeeId) => {
    return await database.recibos.findMany({
      where: {
        employee_id: employeeId
      }
    });
  };

  const getRecibo = async (reciboId) => {
    return await database.recibos.findUnique({
      where: {
        recibo_id: reciboId
      }
    });
  };

  const getLiquidaciones = async () => {
    return await database.liquidacion.findMany({
      orderBy: [
        {
          fecha: 'desc'
        },
        {
          version: 'desc'
        }
      ]
    });
  };

  const getLiquidacionesConfirmables = async () => {
    return await database.liquidacion.findMany({
      where: {
        status: 0
      },
      orderBy: [
        {
          fecha: 'desc'
        },
        {
          version: 'desc'
        }
      ]
    });
  };

  const getLiquidacion = async (liquiId) => {
    return await database.liquidacion.findUnique({
      where: {
        liquidacion_id: liquiId
      },
      include: {
        recibos: {
          include: {
            employee: true
          }
        }
      }
    });
  };

  const CUENTAS = { // TODO - Properties
    SUELDOS: {
      DE: 53, // Sueldos (R-) -- neto total
      A: 212,
    },
    APORTES_PERSONALES: {
      DE: 56, // Aportes personales (R-) -- Deducciones total
      A: 2110,
    },
    CONTRIB_PATRONAL: {
      DE: 57, // Contribucion patronal (R-) -- calcular 23% de bruto total
      A: 2115,
    },
    ART: {
      DE: 58, // ART (R-) -- calcular 1.5% de bruto total
      A: 2116
    },
    // APORTES_SINDICALES: {
    //   DE: 59, // Aportes sindicales (R-) -- TODO
    //   A: 2117
    // },
    BANCO_CC: {
      A: 113
    }
  };

  const confirmLiquidacion = async (liquiId: number, user: users) => {

    const liqui =  await database.liquidacion.findUnique({
      where: {
        liquidacion_id: liquiId
      },
      include: {
        recibos: {
          include: {
            employee: true
          }
        }
      }
    });

    if (liqui.status !== 0) {
      return {
        msg: 'This is already confimed.'
      };
    }

    const sueldos = liqui.neto_total;
    const aportesPersonales = liqui.deduciones_total;
    const contribucionPatronal = liqui.bruto_total * 0.23; // TODO - property
    const art = liqui.bruto_total * 0.015; // TODO - property
    const total = sueldos + aportesPersonales + contribucionPatronal + art;

    // check account balance
    const targetAccount = await AccountService.getAccountById(CUENTAS.BANCO_CC.A);
    if (targetAccount.account_balance < total) {
      return {
        msg: `La cuenta de fondos (${targetAccount.account_id} - ${targetAccount.name}) no posee fondos suficientes ($ ${total}).`
      };
    }

    // create contable book entries

    const asiento1 = {
      description: `Devengan sueldos ${liqui.lapso}`,
      entries: [

        { account_id: CUENTAS.SUELDOS.DE, debit: sueldos }, // Sueldos (R-)
        { account_id: CUENTAS.APORTES_PERSONALES.DE, debit: aportesPersonales }, // Aportes personales (R-)
        { account_id: CUENTAS.CONTRIB_PATRONAL.DE, debit: contribucionPatronal }, // Contribucion patronal (R-)
        { account_id: CUENTAS.ART.DE, debit: art }, // ART (R-)

        { account_id: CUENTAS.SUELDOS.A, assets: sueldos }, // Sueldos a pagar (P)
        { account_id: CUENTAS.APORTES_PERSONALES.A, assets: aportesPersonales }, // Aportes personales a depositar (P)
        { account_id: CUENTAS.CONTRIB_PATRONAL.A, assets: contribucionPatronal }, // Contribucion patronal a pagar (P)
        { account_id: CUENTAS.ART.A, assets: art }, // ART a pagar (P)

        // { account_id: 59, debit: 300 }, // Aportes sindicales (R-)
        // { account_id: 2117, assets: 300 } // Aportes sindicales a depositar
      ]
    };

    const asiento2 = {
      description: `Pago de sueldos ${liqui.lapso}`,
      entries: [
        { account_id: CUENTAS.SUELDOS.A, debit: sueldos }, // Sueldos a pagar (P)
        { account_id: CUENTAS.APORTES_PERSONALES.A, debit: aportesPersonales }, // Aportes personales a depositar (P)
        { account_id: CUENTAS.CONTRIB_PATRONAL.A, debit: contribucionPatronal }, // Contribucion patronal a pagar (P)
        { account_id: CUENTAS.ART.A, debit: art }, // ART a pagar (P)
        // { account_id: 2117, debit: 5000 }, // Aportes sindicales a depositar
        { account_id: CUENTAS.BANCO_CC.A, assets: total } // Banco C/C
      ]
    };

    const currentPeriod = await FinancialPeriodService.getCurrentPeriod(user);

    // @ts-ignore
    await EntryService.addEntry(asiento1, user, currentPeriod);
    // @ts-ignore
    await EntryService.addEntry(asiento2, user, currentPeriod);

    const toTipoCuentaBanco = (tipo) => {
      switch (tipo) {
        case 'Cuenta corriente': return 1;
        default: return 0;
      }
    };

    // generate all deposits
    const depositoCreates = liqui.recibos.map((recibo) => {
      return database.bank_deposits.create({
        data: {
          bank_name: recibo.data['cbBanco'],
          back_account_type: toTipoCuentaBanco(recibo.data['cbTipo']),
          bank_account_number: recibo.data['cbNro'],
          lapse: recibo.period,
          date: recibo.date,
          employee: {
            connect: {
              employee_id: recibo.employee_id
            }
          }
        }
      });
    });

    // change recibo status
    const recibosUpdate = database.recibos.updateMany({
      where: {
        liquidacion_id: liqui.liquidacion_id
      },
      data: {
        status: 1
      }
    });

    // change liquidacion status
    const liquidacionUpdate = database.liquidacion.update({
      where: {
        liquidacion_id: liqui.liquidacion_id
      },
      data: {
        status: 1
      }
    });

    try {
      await database.$transaction([...depositoCreates, recibosUpdate, liquidacionUpdate]);
    } catch (err) {
      console.log(err);
    }

    return {
      msg: 'Confirmed'
    };

  };

  const deleteLiquidacion = async (liquiId) => {
    const liqui =  await database.liquidacion.findUnique({
      where: {
        liquidacion_id: liquiId
      },
      include: {
        recibos: {
          include: {
            employee: true
          }
        }
      }
    });
    if (liqui.status !== 0) {
      throw new Error('Cannot be deleted.');
    }
    await database.$transaction([
      database.recibos.deleteMany({
        where: {
          liquidacion_id: liquiId
        }
      }),
      database.liquidacion.delete({
        where: {
          liquidacion_id: liquiId
        }
      })
    ]);
  };

  return {
    buildRecibos,
    getRecibos,
    getRecibo,
    getLiquidaciones,
    getLiquidacion,
    confirmLiquidacion,
    deleteLiquidacion,
    getLiquidacionesConfirmables
  };
};

export default ReciboService(DatabaseConnection.getConnection());

export function reciboFlatten(recibo) {
  return {
    cuil: recibo.empleado.cuil,
    nombre: recibo.empleado.nombre,
    apellido: recibo.empleado.apellido,
    documento: recibo.empleado.cuil.split('-')[1],
    legajo: recibo.empleado.legajo,
    sueldo: recibo.sueldo,
    fechaIngreso: format(recibo.empleado.fechaIngreso, 'dd/MM/yy'),
    puesto: recibo.empleado.puesto.nombre,
    lineas: recibo.lineas,
    totalHaberesCDesc: recibo.totalHaberesCDesc,
    totalHaberesSDesc: recibo.totalHaberesSDesc,
    totalDeducciones: recibo.totalDeducciones,
    neto: recibo.neto,
    netoEnLetras: recibo.netoEnLetras,
    // Datos faltantes
    // Ultimo deposito
    udFecha: recibo.empleado.ultimoDeposito ? format(recibo.empleado.ultimoDeposito.fecha, 'dd/MM/yy') : '-',
    udLapso: recibo.empleado.ultimoDeposito ? recibo.empleado.ultimoDeposito.lapso : '-',
    udBanco: recibo.empleado.ultimoDeposito ? recibo.empleado.ultimoDeposito.banco : '-',
    // Ultima liquidacion
    ulFecha: recibo.liquidacionFecha ? format(recibo.liquidacionFecha, 'dd/MM/yy') : '-',
    ulLapso: recibo.liquidacionPeriodo ? format(recibo.liquidacionPeriodo, 'MM/yy') : '-',
    // Cuenta banco
    cbBanco: recibo.empleado.cuentaBanco.banco,
    cbTipo: recibo.empleado.cuentaBanco.tipo,
    cbNro: recibo.empleado.cuentaBanco.numero,
    // Lugar pago
    lugarPago: `Junin, ${format(recibo.liquidacionFecha, 'dd/MM/yy')}`
  };
}
