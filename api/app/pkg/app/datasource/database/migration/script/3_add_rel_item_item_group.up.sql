ALTER TABLE tbl_item
ADD group_id UUID;

ALTER TABLE tbl_item 
ADD CONSTRAINT fk_group_id 
FOREIGN KEY (group_id) 
REFERENCES tbl_item_group (id) ON DELETE SET NULL;

