CREATE TABLE "zone" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR (255),
	"level" INT,
	"requirement" VARCHAR (255)
);

CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
	"current_zone" INT REFERENCES "zone" DEFAULT 1,
	"current_state" VARCHAR (255) DEFAULT 'initialize'
);


CREATE TABLE "stat" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INT REFERENCES "user",
	"name" VARCHAR (255),
	"type" VARCHAR (255),
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
	"stat_id" INT references "stat",
	"zone_id" INT references "zone",
	"current_health" INT
);

-- Determines what entities spawn in a zone, this is a many-to-many relationship
-- A zone could potentially be able to spawn many entities
-- That might spawn in other zones as well (like Zombie overlaps Zone 1 and 2)

CREATE TABLE "zone_stat" (
	"zone_id" INT REFERENCES "zone",
	"stat_id" INT REFERENCES "stat",
	"rate" INT
);


INSERT INTO "zone" ("name")
VALUES ('Forest'), ('Mountain');

INSERT INTO "stat" ("name", "type", "min_health", "max_health")
VALUES('Zombie', 'mob', 2, 5), ('Oak Tree', 'woodcutting', 2, 3), ('Boulder', 'mining', 3, 6);


-- Altering the user table to add a reference to spawn_id because
-- PostgresQL is struggling to create it when there's no reference

ALTER TABLE "user"
ADD "spawn_id" INT REFERENCES "spawn" ON DELETE SET NULL,
ADD	"stat_id" INT REFERENCES "stat" ON DELETE CASCADE;

-- Sample Data

INSERT INTO "spawn" ("stat_id", "zone_id", "current_health")
VALUES (1, 1, 5), (1, 1, 3), (2, 1, 4);

INSERT INTO "spawn" ("stat_id","zone_id", "current_health")
VALUES (1, 2, 4), (3, 2, 4), (3, 2, 5);

-- For example, zombies and trees spawn in zone 1 (Forest!)
-- Zombies and boulder spawn in zone 2 (Mountain!)
INSERT INTO "zone_stat" ("zone_id", "stat_id", "rate")
VALUES (1, 1, 85), (1, 2, 60), (2, 1, 85), (2, 3, 60);


INSERT INTO stat ("user_id","name", "level", "health", "strength", "dexterity", "wisdom", "damage")
VALUES (1,'test', 1, 10, 1, 1, 1, 1)
RETURNING id;

UPDATE "user"
SET current_state='observing', stat_id='5'
WHERE id=1;