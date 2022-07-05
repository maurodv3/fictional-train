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
    account_balance DOUBLE PRECISION,
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
    period_start_date TIMESTAMP NOT NULL,
    period_end_date TIMESTAMP NOT NULL,
    PRIMARY KEY (financial_period_id),
    CONSTRAINT fk_financial_entity_id FOREIGN KEY (financial_entity_id) REFERENCES financial_entities(entity_id)
);

CREATE TABLE users (
   user_id SERIAL,
   username VARCHAR(100) UNIQUE NOT NULL,
   display_name VARCHAR(100),
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
    creation_date TIMESTAMP NOT NULL,
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
    assets DOUBLE PRECISION,
    debit DOUBLE PRECISION,
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
     description VARCHAR(255) NOT NULL,
     base_salary DOUBLE PRECISION NOT NULL,
     department_id INT NOT NULL,
     PRIMARY KEY(job_id),
     CONSTRAINT fk_department_id FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE job_category (
      job_category_id SERIAL,
      name VARCHAR(255) NOT NULL,
      percentage_raise DOUBLE PRECISION NOT NULL,
      fixed_raise DOUBLE PRECISION NOT NULL,
      job_id INT NOT NULL,
      PRIMARY KEY(job_category_id),
      CONSTRAINT fk_job_id FOREIGN KEY (job_id) REFERENCES job(job_id)
);

CREATE TABLE employee (
    employee_id SERIAL,
    name VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    birth_date TIMESTAMP NOT NULL,
    identifier VARCHAR(30) NOT NULL,
    email_work VARCHAR(255) NOT NULL,
    email_personal VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    job_category_id INT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    PRIMARY KEY(employee_id),
    CONSTRAINT fk_job_category FOREIGN KEY (job_category_id) REFERENCES job_category(job_category_id)
);

CREATE TABLE employee_familiar (
    familiar_id SERIAL PRIMARY KEY,
    relationship VARCHAR(100) NOT NULL,
    identifier VARCHAR(30) NOT NULL,
    name VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    birth_date TIMESTAMP NOT NULL,
    annual_salary DOUBLE PRECISION,
    employee_familiar_id INT NOT NULL,
    CONSTRAINT fk_employee FOREIGN KEY (employee_familiar_id) REFERENCES employee(employee_id)
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
    minimo DOUBLE PRECISION NOT NULL,
    maximo DOUBLE PRECISION NOT NULL,
    fijo DOUBLE PRECISION NOT NULL,
    porcentual DOUBLE PRECISION NOT NULL,
    CONSTRAINT fk_concepto_id FOREIGN KEY (concepto_id) REFERENCES concepto(concepto_id)
);

CREATE TABLE concepto_unico (
    concepto_unico_id SERIAL PRIMARY KEY,
    due_date TIMESTAMP NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    status INT NOT NULL,
    employee_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    type INT NOT NULL,
    CONSTRAINT fk_employee_id FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE recibos (
    recibo_id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    description VARCHAR(255),
    employee_id INT NOT NULL,
    data JSONB NOT NULL,
    status INT NOT NULL,
    period VARCHAR(100) NOT NULL,
    version INT NOT NULL,
    liquidacion_id INT NOT NULL,
    CONSTRAINT fk_employee_id FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
    CONSTRAINT fk_liquidacion_id FOREIGN KEY (liquidacion_id) REFERENCES liquidacion(liquidacion_id),
    CONSTRAINT uk_employee_period_version UNIQUE (employee_id, period, version)
);

CREATE TABLE concepto_job (
    concepto_job_id SERIAL PRIMARY KEY,
    job_id INT NOT NULL,
    concepto_id INT NOT NULL,
    CONSTRAINT fk_job_id FOREIGN KEY (job_id) REFERENCES job(job_id),
    CONSTRAINT fk_concepto_id FOREIGN KEY (concepto_id) REFERENCES concepto(concepto_id),
    CONSTRAINT uk_job_concepto UNIQUE (job_id, concepto_id)
);

CREATE TABLE bank_accounts (
  bank_account_id SERIAL PRIMARY KEY,
  employee_id INT NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  bank_number VARCHAR(255) NOT NULL,
  bank_account_type INT NOT NULL,
  CONSTRAINT fk_employee_id FOREIGN KEY (employee_id) REFERENCES employee(employee_id),
  CONSTRAINT uk_employee_bank_account UNIQUE (bank_account_id, employee_id)
);

CREATE TABLE bank_deposits (
    bank_deposit_id SERIAL PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    lapse VARCHAR(255) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    bank_account_number VARCHAR(255) NOT NULL,
    back_account_type INT NOT NULL,
    employee_id INT NOT NULL,
    CONSTRAINT fk_employee_id FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE liquidacion (
    liquidacion_id SERIAL PRIMARY KEY,
    fecha TIMESTAMP NOT NULL,
    lapso VARCHAR(255) NOT NULL,
    status INT NOT NULL,
    amount DOUBLE PRECISION NOT NULL
);

