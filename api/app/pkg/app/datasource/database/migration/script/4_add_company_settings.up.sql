CREATE TABLE tbl_settings (
    mod_inspections_active BOOLEAN DEFAULT FALSE,
    inspection_statuses JSONB,
    updated_at TIMESTAMPTZ NULL
);

CREATE TRIGGER set_updated_at_timestamp
BEFORE UPDATE ON tbl_settings
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at_timestamp();

INSERT INTO tbl_settings (inspection_statuses)
VALUES (
'{
    "approved": {
        "translations": {
            "NL": "Goedgekeurd",
            "EN": "Approved"
        } 
    }, 
    "denied": {
        "translations": {
            "NL": "Afgekeurd",
            "EN": "Rejected"
        }
    }
}'::jsonb);