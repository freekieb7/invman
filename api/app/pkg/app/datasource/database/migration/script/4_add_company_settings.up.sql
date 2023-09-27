CREATE TABLE tbl_settings (
    mod_inspections_active BOOLEAN DEFAULT FALSE,
    global_fields JSONB,
    updated_at TIMESTAMPTZ NULL
);

CREATE TRIGGER set_updated_at_timestamp
BEFORE UPDATE ON tbl_settings
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at_timestamp();

INSERT INTO tbl_settings DEFAULT VALUES;