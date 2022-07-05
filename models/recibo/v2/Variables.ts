
const Variables = () => {

  const Var = (symbol: string, name: string, desc: string)
    : {
      symbol: string;
      name: string;
      desc: string;
    } => {
    return {
      symbol,
      name,
      desc
    };
  };

  const BASICO = Var('$.basico', 'Sueldo Basico', 'Sueldo basico mensual del empleado');
  const JORNADA = Var('$.jornada', 'Jornada', 'Tiempo de jornada (en horas)');
  const ANTIGUEDAD = Var('$.antiguedad', 'Antiguedad', 'Antiguedad del empleado (en años)');
  const MAYOR_REMUN = Var('$.mayorRemuneracionPercibida', 'Mayor Remuneracion', 'Mayor Remuneracion Percibida (en ultimos 6 Meses)');
  const MESES_TRABAJADOS = Var('$.mesesTrabajados', 'Meses Trabajados', 'Meses trabajados por el empleado (de 0 a 6 meses)');

  const MES = Var('$.mes', 'Mes Actual', 'Numero de mes del corriente');

  const HORAS_EXTRAS_50 = Var('$.horasExtras50%', 'Horas Extras (50%)', 'Horas extras realizadas por el empleado al 50%');
  const HORAS_EXTRAS_100 = Var('$.horasExtras100%', 'Horas Extras (100%)', 'Horas extras realizadas por el empleado al 100%');
  const HIJO_S_DISC = Var('$.hijosNoDiscapacitados', 'Hijos Sin Discapacidades', 'Numero de hijos del empleado cargados en el sistema');
  const HIJO_C_DISC = Var('$.hijosDiscapacitados', 'Hijos Con Discapacidades', 'Numero de hijos del empleado que presentan discapacidad cargados en el sistema');

  const NA = Var('$.na', 'No Aplica', 'No es necesario para el calculo');

  const TODOS = [BASICO, JORNADA, ANTIGUEDAD, MAYOR_REMUN, MESES_TRABAJADOS, MES, HORAS_EXTRAS_50, HORAS_EXTRAS_100, HIJO_S_DISC, HIJO_C_DISC, NA];

  const isValid = (placeholder) => {
    return TODOS.map(v => v.symbol)
      .includes(placeholder);
  };

  return {
    TODOS,
    BASICO, JORNADA, ANTIGUEDAD, MAYOR_REMUN, MESES_TRABAJADOS, MES, HORAS_EXTRAS_50, HORAS_EXTRAS_100, HIJO_S_DISC, HIJO_C_DISC, NA,
    isValid
  };

};

export default Variables();
