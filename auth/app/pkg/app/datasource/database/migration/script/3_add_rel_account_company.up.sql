ALTER TABLE tbl_account
ADD company_id UUID NOT NULL;

ALTER TABLE tbl_account 
ADD CONSTRAINT fk_company_id 
FOREIGN KEY (company_id) 
REFERENCES tbl_company (id) ON DELETE CASCADE;

