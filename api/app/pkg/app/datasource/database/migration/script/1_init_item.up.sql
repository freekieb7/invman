CREATE OR REPLACE FUNCTION trigger_set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE tbl_item (
    id UUID PRIMARY KEY,
    pid VARCHAR(36) UNIQUE NOT NULL,
    local_fields JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NULL,
    deleted_at TIMESTAMPTZ NULL
);

CREATE TRIGGER set_updated_at_timestamp
BEFORE UPDATE ON tbl_item
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at_timestamp();