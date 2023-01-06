const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

/**
 * FETCH current entities in a zone
 */
router.get("/zone/:id", rejectUnauthenticated, async (req, res) => {
  const db = await pool.connect();

  try {
    await db.query("BEGIN");

    const sql = `
    SELECT spawn.id as spawn_id, spawn.current_health, stat.name, stat.type, zone.id as zone_id
    FROM spawn, stat, zone
    WHERE
      zone_id = $1
      and spawn.stat_id = stat.id
      AND spawn.zone_id = zone.id;
  `;

    result = await db.query(sql, [req.params.id]);

    res.send(result.rows);
  } catch (err) {
    console.error(err);
    sendStatus(500);
  } finally {
    db.release();
  }
});

/**
 * GENERATE entities in a zone
 *
 * getEntitesInZone returns a list of entities that could be spawned in a zone
 * chooseRandomEntity returns a random entity from the list above
 * The POST takes all that information and INSERTS the newly made entity into the database
 */

router.post("/zone/:id", rejectUnauthenticated, async (req, res) => {
  db = await pool.connect();

  try {
    const entitiesAmount = await checkForEntities(req.params.id, db);
    const entitiesInZone = await getEntitiesInZone(req.params.id, db);
    const randomEntity = await chooseRandomEntity(entitiesInZone, db);
    const randomHealth = await randomizeHealth(randomEntity);

    if (entitiesAmount.length <= 2) {
      await db.query("BEGIN");

      const sql_instantiateEntity = `
                  INSERT INTO spawn
                  (stat_id, zone_id, current_health)
                  VALUES($1, $2, $3);
                `;

      await db.query(sql_instantiateEntity, [
        randomEntity.id,
        randomEntity.zone_id,
        randomHealth.current_health,
      ]);

      await db.query("COMMIT");
      res.sendStatus(201);
    } else {
      res.sendStatus(200);
    }
  } catch (error) {
    await db.query("ROLLBACK");
    console.log("Error creating a new entity", error);
    res.sendStatus(500);
  } finally {
    db.release();
  }
});

const checkForEntities = async (zone_id, db) => {
  try {
    const sql_checkForEntities = `
    SELECT * FROM spawn
    WHERE zone_id = $1;
    `;

    const checkForEntities = await db.query(sql_checkForEntities, [zone_id]);

    return checkForEntities.rows;
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const getEntitiesInZone = async (zone_id, db) => {
  // Using the zone_id the player entered
  // We grab all entities that could spawn in that zone
  try {
    const sql_spawnableEntities = `
    SELECT zone_id, stat_id, rate
    FROM zone_stat
    WHERE zone_id = $1;`;

    const spawnableEntities = await db.query(sql_spawnableEntities, [zone_id]);

    // db.release();
    return spawnableEntities.rows;
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const chooseRandomEntity = async (entitiesInZone, db) => {
  try {
    //   /*
    //   Article about weighted random
    //   Feed an array with a weight (renamed to "rate" to match database table)
    //   And return the id or the name of the item that you want (in this case, stat_id)

    //   https://stackoverflow.com/a/55671924/20398230
    //   */

    function weighted_random(options) {
      var i;

      var rates = [];

      for (i = 0; i < options.length; i++)
        rates[i] = options[i].rate + (rates[i - 1] || 0);

      var random = Math.random() * rates[rates.length - 1];

      for (i = 0; i < rates.length; i++) if (rates[i] > random) break;

      return options[i].stat_id;
    }

    //   // Instantiate the chosen entity as an empty object
    //   // Choose an entity with random weighting (set to stat_id)
    //   // Pass the zone_id as well

    let randomChosenEntity = {};

    randomChosenEntity.stat_id = weighted_random(entitiesInZone);
    randomChosenEntity.zone_id = entitiesInZone[0].zone_id;

    const sql_chooseRandomEntity = `
      SELECT stat.id, stat.min_health, stat.max_health, zone_stat.zone_id
      FROM stat, zone_stat
      WHERE
          zone_stat.zone_id = $2
          AND zone_stat.stat_id = stat.id
          AND stat.id = $1;
      `;

    const chosenEntity = await db.query(sql_chooseRandomEntity, [
      randomChosenEntity.stat_id,
      randomChosenEntity.zone_id,
    ]);

    // db.release();
    return chosenEntity.rows[0];
  } catch (error) {
    res.sendStatus(500);
  }
};

const randomizeHealth = async (randomEntity) => {
  try {
    const randomNumRange = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    randomEntity.current_health = randomNumRange(
      randomEntity.min_health,
      randomEntity.max_health
    );

    return randomEntity;
  } catch (error) {
    console.log(error);
  }
};

module.exports = router;
