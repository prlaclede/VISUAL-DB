create table Notes (
    ID int PRIMARY KEY, 
    DATE date,
    TITLE varchar (255),
    NOTE varchar (max),
    PARENT_ID int
);

ALTER TABLE Notes ADD Constraint PARENT_ID_FK FOREIGN KEY (PARENT_ID) REFERENCES Notes(ID);