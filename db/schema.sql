CREATE TABLE roles (
    role_id SERIAL,
    name VARCHAR(100) UNIQUE NOT NULL,
    PRIMARY KEY(role_id)
);

CREATE TABLE actions (
    action_id SERIAL,
    name VARCHAR(100) UNIQUE NOT NULL,
    PRIMARY KEY(action_id)
);

CREATE TABLE users (
    user_id SERIAL,
    username VARCHAR(100) UNIQUE NOT NULL,
    display_name varchar(100),
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT,
    PRIMARY KEY(user_id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE roles_actions (
    id SERIAL,
    role_id INT,
    action_id INT,
    PRIMARY KEY(id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(role_id),
    CONSTRAINT fk_action FOREIGN KEY (action_id) REFERENCES actions(action_id)
);

INSERT INTO actions VALUES (1, 'MANAGE_ACCOUNTS');
INSERT INTO actions VALUES (2, 'MANAGE_ACCOUNT_BOOKS');
INSERT INTO actions VALUES (3, 'MANAGE_USERS');

INSERT INTO roles VALUES (1, 'ADMIN');
INSERT INTO roles VALUES (2, 'STANDARD');

INSERT INTO roles_actions VALUES (1, 1, 1);
INSERT INTO roles_actions VALUES (2, 1, 2);
INSERT INTO roles_actions VALUES (3, 1, 3);
INSERT INTO roles_actions VALUES (4, 2, 2);

INSERT INTO users VALUES (1, 'admin', 'Admin Istrador', 'admin@b3000.com', 'admin', 1);
INSERT INTO users VALUES (2, 'user', 'Usua Rio', 'usuario@b3000.com', 'user', 2);

CREATE TABLE account_types (
    account_type_id SERIAL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY(account_type_id)
);

CREATE TABLE accounts (
    account_id SERIAL,
    name VARCHAR(255) NOT NULL,
    abstract_account BOOLEAN NOT NULL,
    account_type_id INT,
    account_balance NUMERIC(8,4),
    parent_account_id INT,
    PRIMARY KEY(account_id),
    CONSTRAINT fk_account_type FOREIGN KEY (account_type_id) REFERENCES account_types(account_type_id)
);

ALTER TABLE accounts
    ADD CONSTRAINT fk_parent_account_id FOREIGN KEY (parent_account_id) REFERENCES accounts(account_id);

INSERT INTO account_types VALUES (1, 'ACTIVO');
INSERT INTO account_types VALUES (2, 'PASIVO');
INSERT INTO account_types VALUES (3, 'PATRIMONIAL');
INSERT INTO account_types VALUES (4, 'RESULTADOS POSITIVOS');
INSERT INTO account_types VALUES (5, 'RESULTADOS NEGATIVOS');

INSERT INTO accounts VALUES (100, 'Activo', true, 1, 0, null);
INSERT INTO accounts VALUES (110, 'Caja y bancos', true, 1, 0, 100);
INSERT INTO accounts VALUES (111, 'Caja', false, 1, 0, 110);
INSERT INTO accounts VALUES (112, 'Banco plazo fijo', false, 1, 0, 110);
INSERT INTO accounts VALUES (113, 'Banco c/c', false, 1, 0, 110);
INSERT INTO accounts VALUES (120, 'Creditos', true, 1, 0,  100 );
INSERT INTO accounts VALUES (121, 'Deudores por ventas', false, 1, 0, 120);
INSERT INTO accounts VALUES (122, 'Documentos a cobrar', false, 1, 0, 120);
INSERT INTO accounts VALUES (123, 'Valores a depositar', false, 1, 0, 120);
INSERT INTO accounts VALUES (130, 'Bienes de cambio', true, 1, 0, 100);
INSERT INTO accounts VALUES (131, 'Mercaderias', false, 1, 0, 130);
INSERT INTO accounts VALUES (140, 'Bienes de uso', true, 1, 0, 100);
INSERT INTO accounts VALUES (141, 'Inmuebles', false, 1, 0, 140);
INSERT INTO accounts VALUES (142, 'Rodados', false, 1, 0, 140);
INSERT INTO accounts VALUES (143, 'Instalaciones', false, 1, 0, 140);

INSERT INTO accounts VALUES (200, 'Pasivo', true, 2, 0, null);
INSERT INTO accounts VALUES (210, 'Deudas comerciales', true, 2, 0, 200);
INSERT INTO accounts VALUES (211, 'Proveedores', false, 2, 0, 210);
INSERT INTO accounts VALUES (212, 'Sueldos a pagar', false, 2, 0, 210);
INSERT INTO accounts VALUES (220, 'Deudas fiscales', true, 2, 0, 200);
INSERT INTO accounts VALUES (221, 'Impuestos a pagar', false, 2, 0, 220);
INSERT INTO accounts VALUES (222, 'Moratorias', false, 2, 0, 220);
INSERT INTO accounts VALUES (230, 'Prestamos bancarios', false, 2, 0, 200);

INSERT INTO accounts VALUES (300, 'Patrimonio', true, 3, 0, null);
INSERT INTO accounts VALUES (310, 'Capital', false, 3, 0, 300);
INSERT INTO accounts VALUES (320, 'Resultados', false, 3, 0, 300);

INSERT INTO accounts VALUES (400, 'Ingresos', true, 4, 0, null);
INSERT INTO accounts VALUES (410, 'Ventas', true, 4, 0, 400);
INSERT INTO accounts VALUES (411, 'Ventas', false, 4, 0, 410);
INSERT INTO accounts VALUES (420, 'Otros ingresos', true, 4, 0, 400);
INSERT INTO accounts VALUES (430, 'Intereses ganados', false, 4, 0, 400);

INSERT INTO accounts VALUES (500, 'Egresos', true, 5, 0, null);
INSERT INTO accounts VALUES (510, 'Costo de mercaderia vencida', false, 5, 0, 500);
INSERT INTO accounts VALUES (520, 'Impuestos', false, 5, 0, 500);
INSERT INTO accounts VALUES (530, 'Sueldos', false, 5, 0, 500);
INSERT INTO accounts VALUES (540, 'Intereses', false, 5, 0, 500);
INSERT INTO accounts VALUES (550, 'Alquileres', false, 5, 0, 500);
