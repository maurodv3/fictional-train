-- Action Types
INSERT INTO actions VALUES (1, 'MANAGE_ACCOUNTS');
INSERT INTO actions VALUES (2, 'MANAGE_ACCOUNT_BOOKS');
INSERT INTO actions VALUES (3, 'MANAGE_USERS');

-- User roles
INSERT INTO roles VALUES (1, 'ADMIN');
INSERT INTO roles VALUES (2, 'STANDARD');

-- Roles / Actions association
INSERT INTO roles_actions VALUES (1, 1, 1);
INSERT INTO roles_actions VALUES (2, 1, 2);
INSERT INTO roles_actions VALUES (3, 1, 3);
INSERT INTO roles_actions VALUES (4, 2, 2);

-- Financial information
INSERT INTO financial_entities VALUES (1, '30-12345678-1', 'Calle Falsa 123, Junín, Buenos Aires', '02364123456', 'Chibal S.R.L', 'Chibal S.R.L', 'info@chibal.com.ar');
INSERT INTO entity_liable VALUES(1, 1, 'Fernandinho', 'Balbin', 'fernandinho@chibal.com.ar');
INSERT INTO entity_liable VALUES(2, 1, 'Leonardo', 'Chivel', 'leonardo@chibal.com.ar');
INSERT INTO financial_period VALUES (1, 1, '2020', '2020-01-01 00:00:00.000+02', '2020-12-31 23:59:59.999+02');

-- Test users
INSERT INTO users VALUES (1, 'admin', 'Administrador', 'admin@b3000.com', 'admin', 1, 1);
INSERT INTO users VALUES (2, 'user', 'Usuario', 'usuario@b3000.com', 'user', 2, 1);

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


