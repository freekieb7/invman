CREATE TABLE tbl_account (
    id UUID PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NULL,
    deleted_at TIMESTAMPTZ NULL
);

CREATE TRIGGER set_updated_at_timestamp
BEFORE UPDATE ON tbl_account
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at_timestamp();