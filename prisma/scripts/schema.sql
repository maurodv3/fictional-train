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

CREATE TABLE roles_actions (
    id SERIAL,
    role_id INT,
    action_id INT,
    PRIMARY KEY(id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(role_id),
    CONSTRAINT fk_action FOREIGN KEY (action_id) REFERENCES actions(action_id)
);

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
    account_balance NUMERIC(18,4),
    parent_account_id INT,
    enabled BOOLEAN NOT NULL,
    PRIMARY KEY(account_id),
    CONSTRAINT fk_account_type FOREIGN KEY (account_type_id) REFERENCES account_types(account_type_id)
);

ALTER TABLE accounts
    ADD CONSTRAINT fk_parent_account_id FOREIGN KEY (parent_account_id) REFERENCES accounts(account_id);

CREATE TABLE financial_entities (
    entity_id SERIAL,
    identifier VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    email_address VARCHAR(255) NOT NULL,
    PRIMARY KEY (entity_id)
);

CREATE TABLE entity_liable (
    entity_liable_id SERIAL,
    entity_id INT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email_address VARCHAR(255) NOT NULL,
    PRIMARY KEY (entity_liable_id),
    CONSTRAINT fk_entity_id FOREIGN KEY (entity_id) REFERENCES financial_entities(entity_id)
);

CREATE TABLE financial_period (
    financial_period_id SERIAL,
    financial_entity_id INT NOT NULL,
    period_name VARCHAR(255) NOT NULL,
    period_start_date TIMESTAMPTZ NOT NULL,
    period_end_date TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (financial_period_id),
    CONSTRAINT fk_financial_entity_id FOREIGN KEY (financial_entity_id) REFERENCES financial_entities(entity_id)
);

CREATE TABLE users (
   user_id SERIAL,
   username VARCHAR(100) UNIQUE NOT NULL,
   display_name varchar(100),
   email VARCHAR(100) NOT NULL,
   password_hash VARCHAR(255) NOT NULL,
   role_id INT,
   financial_entity_id INT NOT NULL,
   PRIMARY KEY(user_id),
   CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(role_id),
   CONSTRAINT fk_financial_entity_id FOREIGN KEY (financial_entity_id) REFERENCES financial_entities(entity_id)
);

CREATE TABLE entry_seats (
    entry_seat_id SERIAL,
    creation_date TIMESTAMPTZ NOT NULL,
    description VARCHAR(1000) NOT NULL,
    operation_type VARCHAR(255) NOT NULL,
    financial_period_id INT NOT NULL,
    created_by INT,
    PRIMARY KEY(entry_seat_id),
    CONSTRAINT fk_financial_period_id FOREIGN KEY (financial_period_id) REFERENCES financial_period(financial_period_id),
    CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(user_id)
);

CREATE TABLE entry_seat_lines (
    entry_seat_line_id SERIAL,
    position INT NOT NULL,
    account_id INT NOT NULL,
    entry_seat_id INT NOT NULL,
    assets NUMERIC(18,4),
    debit NUMERIC(18,4),
    PRIMARY KEY(entry_seat_line_id),
    CONSTRAINT fk_entry_seat_id FOREIGN KEY (entry_seat_id) REFERENCES entry_seats(entry_seat_id),
    CONSTRAINT fk_account_id FOREIGN KEY (account_id) REFERENCES accounts(account_id),
    CONSTRAINT unique_position UNIQUE(entry_seat_id, position)
);

CREATE TABLE department (
    department_id SERIAL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY(department_id)
);

CREATE TABLE job (
     job_id SERIAL,
     name VARCHAR(255) NOT NULL,
     base_salary NUMERIC(18,4) NOT NULL,
     department_id INT NOT NULL,
     PRIMARY KEY(job_id),
     CONSTRAINT fk_department_id FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE job_category (
      job_category_id SERIAL,
      name VARCHAR(255) NOT NULL,
      percentage_raise NUMERIC(18, 4) NOT NULL,
      fixed_raise NUMERIC(18, 4) NOT NULL,
      job_id INT NOT NULL,
      PRIMARY KEY(job_category_id),
      CONSTRAINT fk_job_id FOREIGN KEY (job_id) REFERENCES job(job_id)
);

CREATE TABLE employee (
    employee_id SERIAL,
    identity_number VARCHAR(30) NOT NULL,
    email_work VARCHAR(255) NOT NULL,
    email_personal VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    job_category_id INT NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    PRIMARY KEY(employee_id),
    CONSTRAINT fk_job_category FOREIGN KEY (job_category_id) REFERENCES job_category(job_category_id)
);

CREATE TABLE concepto (
    concepto_id SERIAL PRIMARY KEY,
    codigo INT UNIQUE NOT NULL,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    unidad INT NOT NULL, -- HORA, DIA, MES, AÑO, %
    columna INT NOT NULL, -- HAB_C_DESC, HAB_S_DESC, DESC
    tipoConcepto INT NOT NULL, -- FIJO, CALCULADO, TABLA, %
    grupo VARCHAR(100) NOT NULL,
    subGrupo VARCHAR(100) NOT NULL,
    seAplicaA VARCHAR(100)[] NOT NULL,
    cantidad VARCHAR(255) NOT NULL,
    valor VARCHAR(255),
    multiplicador VARCHAR(255) NOT NULL DEFAULT '1',
    divisor VARCHAR(255) NOT NULL DEFAULT '1',
    condicion VARCHAR(255),
    periodico BOOLEAN DEFAULT true
);

CREATE TABLE concepto_tabla (
    concepto_tabla_id SERIAL PRIMARY KEY,
    concepto_id INT,
    minimo NUMERIC(18,4) NOT NULL,
    maximo NUMERIC(18,4) NOT NULL,
    fijo NUMERIC(18,4) NOT NULL,
    porcentual NUMERIC(18,4) NOT NULL,
    CONSTRAINT fk_concepto_id FOREIGN KEY (concepto_id) REFERENCES concepto(concepto_id)
);
