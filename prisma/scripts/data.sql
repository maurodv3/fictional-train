-- Action Types
INSERT INTO actions VALUES (1, 'MANAGE_ACCOUNTS');
INSERT INTO actions VALUES (2, 'MANAGE_ACCOUNT_BOOKS');
INSERT INTO actions VALUES (3, 'MANAGE_USERS');
INSERT INTO actions VALUES (4, 'MANAGE_EMPLOYEES');
INSERT INTO actions VALUES (5, 'MANAGE_PAYROLL');

-- User roles
INSERT INTO roles VALUES (1, 'ADMIN');
INSERT INTO roles VALUES (2, 'BASIC');
INSERT INTO roles VALUES (3, 'RRHH');

-- Roles / Actions association
-- Admin actions All
INSERT INTO roles_actions VALUES (1, 1, 1);
INSERT INTO roles_actions VALUES (2, 1, 2);
INSERT INTO roles_actions VALUES (3, 1, 3);
INSERT INTO roles_actions VALUES (5, 1, 4);
INSERT INTO roles_actions VALUES (6, 1, 5);
-- Basic actions
INSERT INTO roles_actions VALUES (4, 2, 2);
-- RRHH actions
INSERT INTO roles_actions VALUES (7, 3, 4);
INSERT INTO roles_actions VALUES (8, 3, 5);

-- Financial information
INSERT INTO financial_entities VALUES (1, '30-12345678-1', 'Calle Falsa 123, Junín, Buenos Aires', '02364123456', 'Chibal S.R.L', 'Chibal S.R.L', 'info@chibal.com.ar');
INSERT INTO entity_liable VALUES(1, 1, 'Fernandinho', 'Balbin', 'fernandinho@chibal.com.ar');
INSERT INTO entity_liable VALUES(2, 1, 'Leonardo', 'Chivel', 'leonardo@chibal.com.ar');

INSERT INTO financial_period VALUES (1, 1, '2020', '2020-01-01 00:00:00.000', '2020-12-31 23:59:59.999');
INSERT INTO financial_period VALUES (2, 1, '2021', '2021-01-01 00:00:00.000', '2021-12-31 23:59:59.999');
INSERT INTO financial_period VALUES (3, 1, '2022', '2022-01-01 00:00:00.000', '2022-12-31 23:59:59.999');
INSERT INTO financial_period VALUES (4, 1, '2023', '2023-01-01 00:00:00.000', '2023-12-31 23:59:59.999');
INSERT INTO financial_period VALUES (5, 1, '2024', '2024-01-01 00:00:00.000', '2024-12-31 23:59:59.999');

-- Test users
INSERT INTO users VALUES (1, 'admin', 'Administrador', 'admin@b3000.com', 'admin', 1, 1);
INSERT INTO users VALUES (2, 'user', 'Usuario', 'usuario@b3000.com', 'user', 2, 1);
INSERT INTO users VALUES (3, 'rrhh', 'RRHH', 'rrhh@b3000.com', 'rrhh', 3, 1);

-- Initial accounts setup
INSERT INTO account_types VALUES (1, 'ACTIVO');
INSERT INTO account_types VALUES (2, 'PASIVO');
INSERT INTO account_types VALUES (3, 'PATRIMONIAL');
INSERT INTO account_types VALUES (4, 'RESULTADOS POSITIVOS');
INSERT INTO account_types VALUES (5, 'RESULTADOS NEGATIVOS');

INSERT INTO accounts VALUES (1, 'Activo', true, 1, 0, null, true);
INSERT INTO accounts VALUES (11, 'Caja y bancos', true, 1, 0, 1, true);
INSERT INTO accounts VALUES (111, 'Caja', false, 1, 0, 11, true);
INSERT INTO accounts VALUES (112, 'Banco plazo fijo', false, 1, 0, 11, true);
INSERT INTO accounts VALUES (113, 'Banco c/c', false, 1, 0, 11, true);
INSERT INTO accounts VALUES (12, 'Creditos', true, 1, 0, 1, true);
INSERT INTO accounts VALUES (121, 'Deudores por ventas', false, 1, 0, 12, true);
INSERT INTO accounts VALUES (122, 'Documentos a cobrar', false, 1, 0, 12, true);
INSERT INTO accounts VALUES (123, 'Valores a depositar', false, 1, 0, 12, true);
INSERT INTO accounts VALUES (13, 'Bienes de cambio', true, 1, 0, 1, true);
INSERT INTO accounts VALUES (131, 'Mercaderias', false, 1, 0, 13, true);
INSERT INTO accounts VALUES (14, 'Bienes de uso', true, 1, 0, 1, true);
INSERT INTO accounts VALUES (141, 'Inmuebles', false, 1, 0, 14, true);
INSERT INTO accounts VALUES (142, 'Rodados', false, 1, 0, 14, true);
INSERT INTO accounts VALUES (143, 'Instalaciones', false, 1, 0, 14, true);

INSERT INTO accounts VALUES (2, 'Pasivo', true, 2, 0, null, true);
INSERT INTO accounts VALUES (21, 'Deudas comerciales', true, 2, 0, 2, true);
INSERT INTO accounts VALUES (211, 'Proveedores', false, 2, 0, 21, true);
INSERT INTO accounts VALUES (212, 'Sueldos a pagar', false, 2, 0, 21, true);
INSERT INTO accounts VALUES (22, 'Deudas fiscales', true, 2, 0, 2, true);
INSERT INTO accounts VALUES (221, 'Impuestos a pagar', false, 2, 0, 22, true);
INSERT INTO accounts VALUES (222, 'Moratorias', false, 2, 0, 22, true);
INSERT INTO accounts VALUES (230, 'Prestamos bancarios', false, 2, 0, 2, true);

INSERT INTO accounts VALUES (3, 'Patrimonio', true, 3, 0, null, true);
INSERT INTO accounts VALUES (31, 'Capital', false, 3, 0, 3, true);
INSERT INTO accounts VALUES (32, 'Resultados', false, 3, 0, 3, true);

INSERT INTO accounts VALUES (4, 'Ingresos', true, 4, 0, null, true);
INSERT INTO accounts VALUES (41, 'Ventas', true, 4, 0, 4, true);
INSERT INTO accounts VALUES (42, 'Otros ingresos', true, 4, 0, 4, true);
INSERT INTO accounts VALUES (43, 'Intereses ganados', false, 4, 0, 4, true);

INSERT INTO accounts VALUES (5, 'Egresos', true, 5, 0, null, true);
INSERT INTO accounts VALUES (51, 'Costo de mercaderia vendida', false, 5, 0, 5, true);
INSERT INTO accounts VALUES (52, 'Impuestos', false, 5, 0, 5, true);
INSERT INTO accounts VALUES (53, 'Sueldos', false, 5, 0, 5, true);
INSERT INTO accounts VALUES (54, 'Intereses', false, 5, 0, 5, true);
INSERT INTO accounts VALUES (55, 'Alquileres', false, 5, 0, 5, true);

INSERT INTO department VALUES (1, 'Ventas');
INSERT INTO department VALUES (2, 'Compras');
INSERT INTO department VALUES (3, 'Administracion');

INSERT INTO job VALUES (1, 'Jefe de Ventas', 100000.00, 1);
INSERT INTO job_category VALUES (1, 'Jefe I', 0, 0, 1);

INSERT INTO job VALUES (2, 'Vendedor', 80000.00, 1);
INSERT INTO job_category VALUES (2, 'Vendedor I', 0, 0, 2);
INSERT INTO job_category VALUES (3, 'Vendedor II', 10, 0, 2);

INSERT INTO job VALUES (3, 'Jefe de Compras', 100000.00, 2);
INSERT INTO job_category VALUES (4, 'Jefe I', 0, 0, 3);

INSERT INTO job VALUES (4, 'Administrativo', 60000.00, 3);
INSERT INTO job_category VALUES (5, 'Administrativo I', 0, 0, 4);
INSERT INTO job_category VALUES (6, 'Administrativo II', 10, 0, 4);
INSERT INTO job_category VALUES (7, 'Administrativo III', 15, 10000, 4);

INSERT INTO employee VALUES (1, '20-123504171-4', 'santiago@work.com', 'santiago@personal.com', 'Av. San Martin 123, Junin, Buenos Aires', 7, '2020-01-01 08:00:00 -3:00');

INSERT INTO concepto VALUES (1, 1, 'Sueldo Basico', 1 /*DIA*/, 0/*Hab_c_desc*/, 0/*FIJO*/, 'G1', 'SG11', '{}', '$.na', '$.basico', '1', '1', null);
INSERT INTO concepto VALUES (2, 2, 'Antiguedad', 2 /*%*/, 0/*Hab_c_desc*/, 1/*%*/, 'G1', 'SG12', '{SG11}', '$.antiguedad', null, '1', '1', '$.antiguedad > 0');
INSERT INTO concepto VALUES (3, 149, 'Horas Extras 50%', 0/*HORA*/, 0/*Hab_c_desc*/, 2/*Calculado*/, 'G1', 'SG13', '{SG11,SG12}', '$.horasExtras50%', null, '1.5', '$.jornada', '$.horasExtras50% > 0');
INSERT INTO concepto VALUES (4, 150, 'Horas Extras 100%', 0/*HORA*/, 0/*Hab_c_desc*/, 2/*Calculado*/, 'G1', 'SG14', '{SG11,SG12}', '$.horasExtras100%', null, '2', '$.jornada', '$.horasExtras100% > 0');

INSERT INTO concepto VALUES (5, 200, 'Asignacion por Hijo', 3, 1, 3, 'G2', 'SG21', '{}', '$.hijosNoDiscapacitados', null, '1', '1', '$.hijosNoDiscapacitados > 0');
INSERT INTO concepto_tabla VALUES (1, 5, 6105.79, 54865, 3540, 0);
INSERT INTO concepto_tabla VALUES (2, 5, 54865.01, 80467, 2386, 0);
INSERT INTO concepto_tabla VALUES (3, 5, 80467.01, 92902, 1441, 0);
INSERT INTO concepto_tabla VALUES (4, 5, 92902.01, 155328, 741, 0);

INSERT INTO concepto VALUES (6, 201, 'Asignacion por Hijo Discapacitado', 3, 1, 3, 'G2', 'SG22', '{}', '$.hijosDiscapacitados', null, '1', '1', '$.hijosDiscapacitados > 0');
INSERT INTO concepto_tabla VALUES (5, 6, 0, 54865, 11535, 0);
INSERT INTO concepto_tabla VALUES (6, 6, 54865.01, 80467, 8158, 0);
INSERT INTO concepto_tabla VALUES (7, 6, 80467.01, 99999999, 5148, 0);

INSERT INTO concepto VALUES (7, 401, 'Jubilacion (11%)', 2, 2, 1, 'G3', 'SG31', '{G1}', '11', null, '1', '1', null);
INSERT INTO concepto VALUES (8, 402, 'Ley 19.032 (3%)', 2, 2, 1, 'G3', 'SG32', '{G1}', '3', null, '1', '1', null);
INSERT INTO concepto VALUES (9, 403, 'Obra Social (3%)', 2, 2, 1, 'G3', 'SG32', '{G1}', '3', null, '1', '1', null);

INSERT INTO concepto VALUES (10, 202, 'Asignacion por Nacimiento', 3, 1, 3, 'G2', 'SG23', '{}', '$.na', null, '1', '1', null);
INSERT INTO concepto_tabla VALUES (8, 10, 6105.79, 155328, 4128, 0);

INSERT INTO concepto VALUES (11, 203, 'Asignacion por Matrimonio', 3, 1, 3, 'G2', 'SG24', '{}', '$.na', null, '1', '1', null);
INSERT INTO concepto_tabla VALUES (9, 11, 6105.79, 155328, 6181, 0);

INSERT INTO concepto VALUES (12, 203, 'Asignacion por Adopcion', 3, 1, 3, 'G2', 'SG25', '{}', '$.na', null, '1', '1', null);
INSERT INTO concepto_tabla VALUES (10, 12, 6105.79, 155328, 24694, 0);

INSERT INTO concepto VALUES (13, 201, 'Asignacion Prenatal', 3, 1, 3, 'G2', 'SG26', '{}', '$.na', null, '1', '1', null);
INSERT INTO concepto_tabla VALUES (11, 13, 6105.79, 54865, 3540, 0);
INSERT INTO concepto_tabla VALUES (12, 13, 54865.01, 80467, 2386, 0);
INSERT INTO concepto_tabla VALUES (13, 13, 80467.01, 92902, 1441, 0);
INSERT INTO concepto_tabla VALUES (14, 13, 92902.01, 155328, 741, 0);
