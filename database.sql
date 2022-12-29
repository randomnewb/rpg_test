CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

CREATE TABLE "entity" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR (1000)
);

CREATE TABLE "type" (
	"id" SERIAL PRIMARY KEY,
	"description" VARCHAR (255)
);

CREATE TABLE "stat" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES "user",
	"entity_id" INT REFERENCES "entity",
	"type_id" INT REFERENCES "type",
	"rarity" INT DEFAULT 1,
	"level" INT DEFAULT 0,
	"experience" INT DEFAULT 0,
	"health" INT DEFAULT 0,
	"min_health" INT DEFAULT 0,
	"max_health" INT DEFAULT 0,
	"mana" INT DEFAULT 0,
	"strength" INT DEFAULT 0,
	"dexterity" INT DEFAULT 0,
	"wisdom" INT DEFAULT 0,
	"damage" INT DEFAULT 0,
	"armor" INT DEFAULT 0,
	"resistance" INT DEFAULT 0
);

INSERT INTO "type" ("description")
VALUES ('mob'), ('woodcutting'), ('mining');


INSERT INTO "entity" ("name")
VALUES ('Zombie'), ('Oak Tree'), ('Boulder');

INSERT INTO "stat" ("entity_id", "type_id", "min_health", "max_health")
VALUES(1, 1, 2, 5), (2, 2, 2, 3), (3, 3, 3, 6);