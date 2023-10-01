CREATE TABLE tbl_item_group (
    id UUID PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NULL,
    deleted_at TIMESTAMPTZ NULL
);

CREATE TRIGGER set_updated_at_timestamp
BEFORE UPDATE ON tbl_item_group
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at_timestamp();