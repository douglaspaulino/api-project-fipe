CREATE DATABASE projeto_fipe;

\c projeto_fipe;
-- Creation of product table
CREATE TABLE IF NOT EXISTS "marcas" (
  "codigo" varchar(3) NOT NULL,
  "nome" varchar(100) NOT NULL,
  PRIMARY KEY ("codigo")
);

CREATE TABLE IF NOT EXISTS "modelos" (
  "codigo" varchar(10) NOT NULL,
  "nome" varchar(100) NOT NULL,
  "marca_codigo" varchar(3) NOT NULL,
  "observacoes" varchar(100)  NULL,
  PRIMARY KEY ("codigo"),
  CONSTRAINT "fk_marcas"
    FOREIGN KEY("marca_codigo") 
	REFERENCES "marcas" ("codigo")
);