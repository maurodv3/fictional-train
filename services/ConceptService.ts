import DatabaseConnection from '@database/DatabaseConnection';
import { PrismaClient } from '@prisma/client';
import { parse } from 'date-fns';

const ConceptService = (database: PrismaClient) => {

  const getConcepts = async () => {
    return await database.concepto.findMany({
      include: {
        concepto_tabla: true
      },
      orderBy: {
        codigo: 'asc'
      }
    });
  };

  const getConcept = async (conceptId) => {
    return await database.concepto.findUnique({
      where: {
        concepto_id: conceptId
      },
      include: {
        concepto_tabla: true
      }
    });
  };

  const addConcept = async (concepto) => {
    const create = {
      codigo: Number.parseInt(concepto.codigo, 10),
      nombre: concepto.nombre,
      unidad: Number.parseInt(concepto.unidad, 10),
      columna: Number.parseInt(concepto.columna, 10),
      tipoconcepto: Number.parseInt(concepto.tipoconcepto, 10),
      grupo: concepto.grupo,
      subgrupo: concepto.subgrupo,
      cantidad: concepto.cantidad,
      valor: concepto.valor,
      multiplicador: concepto.multiplicador,
      divisor: concepto.divisor,
      condicion: concepto.condicion,
      periodico: Boolean(concepto.periodico),
      seaplicaa: concepto.seaplicaa ? concepto.seaplicaa.split(',') : []
    };
    if (concepto.tabla) {
      try {
        return await database.concepto.create({
          data: {
            ...create,
            concepto_tabla: {
              create: concepto.tabla.map((tl) => {
                return {
                  minimo: Number.parseFloat(tl.minimo),
                  maximo: Number.parseFloat(tl.maximo),
                  fijo: Number.parseFloat(tl.fijo),
                  porcentual: 0
                };
              })
            }
          },
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    } else {
      try {
        return await database.concepto.create({
          data: {
            ...create
          }
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  };

  const getPersonalConcepts = async (employeeId) => {
    return await database.concepto_unico.findMany({
      where: {
        employee_id: employeeId
      }
    });
  };

  const addPersonalConcept = async (employeeId, personalConcept) => {
    console.log('Create personal concept', personalConcept);
    try {
      return await database.concepto_unico.create({
        data: {
          description: personalConcept.description,
          amount: Number.parseFloat(personalConcept.amount),
          status: 1,
          type: Number.parseInt(personalConcept.type, 10),
          period: personalConcept.period,
          employee: {
            connect: {
              employee_id: employeeId
            }
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const addHoraExtra = async (employeeId, horaExtra) => {
    console.log('Add hora extra', horaExtra);
    try {
      return await database.horas_extra.create({
        data: {
          cantidad: Number.parseFloat(horaExtra.cantidad),
          tipo: Number.parseInt(horaExtra.tipo, 10), // 50 or 100
          realizadas_en: parse(horaExtra.realizadas_en, 'dd/MM/yyyy', new Date()),
          a_cobrar_en: horaExtra.a_cobrar_en,
          employee: {
            connect: {
              employee_id: employeeId
            }
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getHorasExtras = async (employeeId) => {
    return await database.horas_extra.findMany({
      where: {
        employee_id: employeeId
      }
    });
  };

  const updateConcept = async (conceptoId, concepto) => {
    try {
      const update = {
        codigo: Number.parseInt(concepto.codigo, 10),
        nombre: concepto.nombre,
        unidad: Number.parseInt(concepto.unidad, 10),
        columna: Number.parseInt(concepto.columna, 10),
        tipoconcepto: Number.parseInt(concepto.tipoconcepto, 10),
        grupo: concepto.grupo,
        subgrupo: concepto.subgrupo,
        cantidad: concepto.cantidad,
        valor: concepto.valor,
        multiplicador: concepto.multiplicador,
        divisor: concepto.divisor,
        condicion: concepto.condicion,
        periodico: Boolean(concepto.periodico),
        seaplicaa: concepto.seaplicaa ? concepto.seaplicaa.split(',') : []
      };
      if (concepto.tabla) {
        await database.$transaction([
          database.concepto_tabla.deleteMany({
            where: {
              concepto_id: conceptoId
            }
          }),
          database.concepto_tabla.createMany({
            data: concepto.tabla.map((tl) => {
              return {
                minimo: Number.parseFloat(tl.minimo),
                maximo: Number.parseFloat(tl.maximo),
                fijo: Number.parseFloat(tl.fijo),
                porcentual: 0,
                concepto_id: conceptoId
              };
            })
          }),
          database.concepto.update({
            data: update,
            where: {
              concepto_id: conceptoId
            }
          })
        ]);
      } else {
        await database.concepto.update({
          data: update,
          where: {
            concepto_id: conceptoId
          }
        });
      }
      return { msg: 'OK' };
    } catch (err) {
      console.log(err);
    }
  };

  return {
    getConcepts,
    getConcept,
    addConcept,
    getPersonalConcepts,
    addPersonalConcept,
    getHorasExtras,
    addHoraExtra,
    updateConcept
  };
};

export default ConceptService(DatabaseConnection.getConnection());
