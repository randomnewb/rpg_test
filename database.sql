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
	"class" VARCHAR (255), 
	"type" VARCHAR (255),
	"damage_type" text[],
	"rarity" INT DEFAULT 1,
	"level" INT DEFAULT 0,
	"experience" INT DEFAULT 0,
	"health" INT DEFAULT 0,
	"min_health" INT DEFAULT 0,
	"max_health" INT DEFAULT 10,
	"stamina" INT DEFAULT 0,
	"min_stamina" INT DEFAULT 0,
	"max_stamina" INT DEFAULT 10,
	"mana" INT DEFAULT 0,
	"min_mana" INT DEFAULT 0,
	"max_mana" INT DEFAULT 10,
	"strength" INT DEFAULT 0,
	"dexterity" INT DEFAULT 0,
	"wisdom" INT DEFAULT 0,
	"damage" INT DEFAULT 0,
	"min_damage" INT DEFAULT 0,
	"max_damage" INT DEFAULT 0,
	"armor" INT DEFAULT 0,
	"resistance" INT DEFAULT 0
);

CREATE TABLE "item" (
	"id" SERIAL PRIMARY KEY,
	"name" varchar(255),
	"attribute" varchar (255),
	"type" varchar(255),
	"equippable" boolean,
	"value" INT,
	"damage_type" text[],
	"min_damage" INT,
	"max_damage" INT
);

CREATE TABLE "stat_item" (
	"stat_id" INT REFERENCES "stat",
	"item_id" INT REFERENCES "item",
	"rate" INT
);

CREATE TABLE "spawn" (
	"id" SERIAL PRIMARY KEY,
	"stat_id" INT REFERENCES "stat",
	"zone_id" INT REFERENCES "zone",
	"current_health" INT
);

CREATE TABLE "inventory" (
	"item_id" INT REFERENCES "item",
	"user_id" INT REFERENCES "user",
	"quantity" INT,
	UNIQUE ("item_id", "user_id")
);

CREATE TABLE "equipped" (
	"item_id" INT REFERENCES "item",
	"user_id" INT REFERENCES "user",
	"quantity" INT,
	UNIQUE ("item_id", "user_id")
);
-- Determines what entities spawn in a zone, this is a many-to-many relationship
-- A zone could potentially be able to spawn many entities
-- That might spawn in other zones as well (like Zombie overlaps Zone 1 and 2)

CREATE TABLE "zone_stat" (
	"zone_id" INT REFERENCES "zone",
	"stat_id" INT REFERENCES "stat",
	"rate" INT
);

-- Create zones (forest and mountain)

INSERT INTO "zone" ("name")
VALUES ('Forest'), ('Mountain');

-- Create entities 
-- 1: zombie
-- 2: oak tree
-- 3: boulder

INSERT INTO "stat" ("name", "type", "min_health", "max_health")
VALUES('Zombie', 'mob', 2, 5), ('Oak Tree', 'woodcutting', 2, 3), ('Boulder', 'mining', 3, 6);

-- Altering the user table to add a reference to spawn_id because
-- PostgresQL is struggling to create it when there's no reference

ALTER TABLE "user"
ADD "spawn_id" INT REFERENCES "spawn" ON DELETE SET NULL,
ADD	"stat_id" INT REFERENCES "stat" ON DELETE CASCADE;

-- Sample data to load when the database is initialized for the very first time

INSERT INTO "spawn" ("stat_id", "zone_id", "current_health")
VALUES (1, 1, 5), (1, 1, 3), (2, 1, 4);

INSERT INTO "spawn" ("stat_id","zone_id", "current_health")
VALUES (1, 2, 4), (3, 2, 4), (3, 2, 5);

-- Create the zone/entity spawning table data
-- For example, zombies and trees spawn in zone 1 (Forest!)
-- Zombies and boulder spawn in zone 2 (Mountain!)
-- These entities have weighted probabilities associated to their spawning
INSERT INTO "zone_stat" ("zone_id", "stat_id", "rate")
VALUES (1, 1, 85), (1, 2, 60), (2, 1, 85), (2, 3, 60);

-- Create items
-- 1: Heartstone
-- 2: Protein Powder
-- 3: Root
-- 4: Not a Coin
-- 5: Lint

INSERT INTO "item" ("name", "attribute", "value", "type", "equippable")
VALUES ('Heartstone', 'health', 1, 'pog', TRUE), ('Protein Powder', 'strength', 1, 'pog', TRUE), 
('Root', 'wisdom', 1, 'pog', TRUE), ('Not a Coin', 'experience', 1, 'experience', FALSE), ('Lint', 'miscellaneous', 1, 'pog', FALSE);

INSERT INTO "item" ("name", "type", "damage_type", "min_damage", "max_damage", "equippable")
VALUES ('Wooden Bat', 'weapon', '{"physical", "melee"}', 1, 3, TRUE), ('Slingshot', 'weapon', '{"physical", "ranged"}', 1, 3, TRUE), 
('Calculator', 'weapon', '{"digital", "ranged"}', 1, 3, TRUE);

-- Create the item/entity table (loot table)

INSERT INTO "stat_item" ("stat_id", "item_id", "rate")
VALUES (1, 2, 50), (1, 4, 75), (2, 3, 50), (2, 4, 75), (3, 1, 50), (3, 4, 75);