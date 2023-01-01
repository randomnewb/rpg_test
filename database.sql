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
	"current_zone" INT REFERENCES "zone",
	"state" VARCHAR (255) DEFAULT 'observing'
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
	"rate" NUMERIC
);

INSERT INTO "zone" ("name")
VALUES ('Forest'), ('Mountain');

INSERT INTO "stat" ("name", "type", "min_health", "max_health")
VALUES('Zombie', 'mob', 2, 5), ('Oak Tree', 'woodcutting', 2, 3), ('Boulder', 'mining', 3, 6);

INSERT INTO "spawn" ("stat_id", "zone_id", "current_health")
VALUES (1, 1, 5), (1, 1, 3), (3, 1, 4);

INSERT INTO "spawn" ("stat_id","zone_id", "current_health")
VALUES (1, 2, 4), (3, 2, 4), (3, 2, 5);

-- For example, zombies and trees spawn in zone 1 (Forest!)
-- Zombies and boulder spawn in zone 2 (Mountain!)
INSERT INTO "zone_stat" ("zone_id", "stat_id", "rate")
VALUES (1, 1, 0.75), (1, 2, 0.60), (2, 1, 0.75), (2, 3, 0.60);

-- Shows all spawned entities in a visited zone

SELECT spawn.id as spawn_id, spawn.current_health, stat.name, stat.type, zone.id as zone_id
FROM spawn, stat, zone
where
	zone_id = 1
	and spawn.stat_id = stat.id
	AND spawn.zone_id = zone.id;
