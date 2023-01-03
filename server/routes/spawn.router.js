const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

/**
 * FETCH current entities in a zone
 */
router.get("/:id", rejectUnauthenticated, (req, res) => {
  const sql = `
    SELECT spawn.id as spawn_id, spawn.current_health, stat.name, stat.type, zone.id as zone_id
    FROM spawn, stat, zone
    WHERE
      zone_id = $1
      and spawn.stat_id = stat.id
      AND spawn.zone_id = zone.id;
  `;
  pool
    .query(sql, [req.params.id])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
});

/**
 * GENERATE entities in a zone
 *
 * getEntitesInZone returns a list of entities that could be spawned in a zone
 * chooseRandomEntity returns a random entity from the list above
 * The POST takes all that information and INSERTS the newly made entity into the database
 */

const getEntitiesInZone = async (zone_id) => {
  // 1st step, first query, using the zone_id the player entered
  // We grab all entities that could spawn in that zone
  try {
    const sql_entitiesInZone = `
    SELECT zone_id, stat_id, rate
    FROM zone_stat
    WHERE zone_id = $1;`;

    const entitiesInZone = await pool.query(sql_entitiesInZone, [zone_id]);

    return entitiesInZone.rows;
  } catch (error) {
    res.sendStatus(500);
  }
};

const chooseRandomEntity = async (entitiesInZone) => {
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

    const chosenEntity = await pool.query(sql_chooseRandomEntity, [
      randomChosenEntity.stat_id,
      randomChosenEntity.zone_id,
    ]);

    return chosenEntity.rows[0];
  } catch (error) {
    res.sendStatus(500);
  }
};

router.post("/:id", rejectUnauthenticated, async (req, res) => {
  db = await pool.connect();

  try {
    const entitiesInZone = await getEntitiesInZone(req.params.id);
    const randomEntity = await chooseRandomEntity(entitiesInZone);

    const randomNumRange = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    randomEntity.current_health = randomNumRange(
      randomEntity.min_health,
      randomEntity.max_health
    );

    const sql_instantiateEntity = `
                INSERT INTO spawn
                (stat_id, zone_id, current_health)
                VALUES($1, $2, $3);
              `;

    await db.query(sql_instantiateEntity, [
      randomEntity.id,
      randomEntity.zone_id,
      randomEntity.current_health,
    ]);

    await db.query("COMMIT");
  } catch (error) {
    await db.query("ROLLBACK");
    res.sendStatus(500);
  } finally {
    db.release();
  }
});

// Test another post method by zone id to see if that is the issue

module.exports = router;
