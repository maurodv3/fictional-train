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

CREATE TABLE entry_seats (
    entry_seat_id SERIAL,
    creation_date TIMESTAMPTZ NOT NULL,
    description VARCHAR(1000) NOT NULL,
    operation_type VARCHAR(255) NOT NULL,
    PRIMARY KEY(entry_seat_id)
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
