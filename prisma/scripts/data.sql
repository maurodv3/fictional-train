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

-- Test users
INSERT INTO users VALUES (1, 'admin', 'Admin Istrador', 'admin@b3000.com', 'admin', 1);
INSERT INTO users VALUES (2, 'user', 'Usua Rio', 'usuario@b3000.com', 'user', 2);

-- Initial accounts setup
INSERT INTO account_types VALUES (1, 'ACTIVO');
INSERT INTO account_types VALUES (2, 'PASIVO');
INSERT INTO account_types VALUES (3, 'PATRIMONIAL');
INSERT INTO account_types VALUES (4, 'RESULTADOS POSITIVOS');
INSERT INTO account_types VALUES (5, 'RESULTADOS NEGATIVOS');

INSERT INTO accounts VALUES (100, 'Activo', true, 1, 0, null, true);
INSERT INTO accounts VALUES (110, 'Caja y bancos', true, 1, 0, 100, true);
INSERT INTO accounts VALUES (111, 'Caja', false, 1, 0, 110, true);
INSERT INTO accounts VALUES (112, 'Banco plazo fijo', false, 1, 0, 110, true);
INSERT INTO accounts VALUES (113, 'Banco c/c', false, 1, 0, 110, true);
INSERT INTO accounts VALUES (120, 'Creditos', true, 1, 0, 100, true);
INSERT INTO accounts VALUES (121, 'Deudores por ventas', false, 1, 0, 120, true);
INSERT INTO accounts VALUES (122, 'Documentos a cobrar', false, 1, 0, 120, true);
INSERT INTO accounts VALUES (123, 'Valores a depositar', false, 1, 0, 120, true);
INSERT INTO accounts VALUES (130, 'Bienes de cambio', true, 1, 0, 100, true);
INSERT INTO accounts VALUES (131, 'Mercaderias', false, 1, 0, 130, true);
INSERT INTO accounts VALUES (140, 'Bienes de uso', true, 1, 0, 100, true);
INSERT INTO accounts VALUES (141, 'Inmuebles', false, 1, 0, 140, true);
INSERT INTO accounts VALUES (142, 'Rodados', false, 1, 0, 140, true);
INSERT INTO accounts VALUES (143, 'Instalaciones', false, 1, 0, 140, true);

INSERT INTO accounts VALUES (200, 'Pasivo', true, 2, 0, null, true);
INSERT INTO accounts VALUES (210, 'Deudas comerciales', true, 2, 0, 200, true);
INSERT INTO accounts VALUES (211, 'Proveedores', false, 2, 0, 210, true);
INSERT INTO accounts VALUES (212, 'Sueldos a pagar', false, 2, 0, 210, true);
INSERT INTO accounts VALUES (220, 'Deudas fiscales', true, 2, 0, 200, true);
INSERT INTO accounts VALUES (221, 'Impuestos a pagar', false, 2, 0, 220, true);
INSERT INTO accounts VALUES (222, 'Moratorias', false, 2, 0, 220, true);
INSERT INTO accounts VALUES (230, 'Prestamos bancarios', false, 2, 0, 200, true);

INSERT INTO accounts VALUES (300, 'Patrimonio', true, 3, 0, null, true);
INSERT INTO accounts VALUES (310, 'Capital', false, 3, 0, 300, true);
INSERT INTO accounts VALUES (320, 'Resultados', false, 3, 0, 300, true);

INSERT INTO accounts VALUES (400, 'Ingresos', true, 4, 0, null, true);
INSERT INTO accounts VALUES (410, 'Ventas', true, 4, 0, 400, true);
INSERT INTO accounts VALUES (411, 'Ventas', false, 4, 0, 410, true);
INSERT INTO accounts VALUES (420, 'Otros ingresos', true, 4, 0, 400, true);
INSERT INTO accounts VALUES (430, 'Intereses ganados', false, 4, 0, 400, true);

INSERT INTO accounts VALUES (500, 'Egresos', true, 5, 0, null, true);
INSERT INTO accounts VALUES (510, 'Costo de mercaderia vencida', false, 5, 0, 500, true);
INSERT INTO accounts VALUES (520, 'Impuestos', false, 5, 0, 500, true);
INSERT INTO accounts VALUES (530, 'Sueldos', false, 5, 0, 500, true);
INSERT INTO accounts VALUES (540, 'Intereses', false, 5, 0, 500, true);
INSERT INTO accounts VALUES (550, 'Alquileres', false, 5, 0, 500, true);


