CREATE TABLE "zone" (
	"id" SERIAL PRIMARY KEY,
	"description" VARCHAR (255)
);

CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
	"current_zone" INT REFERENCES "zone"
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

CREATE TABLE "spawn" (
	"id" SERIAL PRIMARY KEY,
	"entity_id" INT references "entity",
	"current_health" INT
);

CREATE TABLE "spawn_zone" (
	"spawn_id" INT references "spawn",
	"zone_id" INT references "zone"
);

INSERT INTO "zone" ("description")
VALUES ('Forest'), ('Mountain');

INSERT INTO "type" ("description")
VALUES ('mob'), ('woodcutting'), ('mining');

INSERT INTO "entity" ("name")
VALUES ('Zombie'), ('Oak Tree'), ('Boulder');

INSERT INTO "stat" ("entity_id", "type_id", "min_health", "max_health")
VALUES(1, 1, 2, 5), (2, 2, 2, 3), (3, 3, 3, 6);

INSERT INTO "spawn" ("entity_id", "current_health")
VALUES (1, 5), (2, 3), (3, 4);

INSERT INTO "spawn" ("entity_id", "current_health")
VALUES (1, 4), (2, 4), (3, 5);

INSERT INTO "spawn_zone" ("spawn_id", "zone_id")
VALUES (1, 1), (2, 1), (3, 1);

INSERT INTO "spawn_zone" ("spawn_id", "zone_id")
VALUES (4, 2), (5, 2), (6, 2);