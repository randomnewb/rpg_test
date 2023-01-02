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
 * GENERATE entities in a zone if there are none
 */

// This needs to be converted to async/await...

// This is triggered when a player enters a zone that has no entities

// 1st step, first query, using the zone_id the player entered
// We grab all entities that could spawn in that zone

router.post("/:id", (req, res) => {
  const entitiesInZone = (callback) => {
    const sql = `
      SELECT zone_id, stat_id, rate
      FROM zone_stat
      WHERE zone_id = $1;`;
    pool.query(sql, [req.params.id], (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, result);
      }
    });
  };

  entitiesInZone((error, result) => {
    if (error) {
      console.log(error);
    } else {
      createChosenEntity(result, (error, result2) => {
        if (error) {
          console.log(error);
        } else {
          let chosenEntity = result2.rows[0];

          const randomNumRange = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
          };

          chosenEntity.current_health = randomNumRange(
            chosenEntity.min_health,
            chosenEntity.max_health
          );

          const sql = `
            INSERT INTO spawn
            (stat_id, zone_id, current_health)
            VALUES($1, $2, $3);
          `;

          pool.query(
            sql,
            [
              chosenEntity.id,
              chosenEntity.zone_id,
              chosenEntity.current_health,
            ],
            (error, result) => {
              if (error) {
                console.log(error);
              } else {
              }
            }
          );
        }
      });
    }
  });

  // 2nd step, take the entities and choose one randomly based on weighting

  const createChosenEntity = (result, callback) => {
    /*
    Article about weighted random
    Feed an array with a weight (renamed to "rate" to match database table)
    And return the id or the name of the item that you want (in this case, stat_id)

    https://stackoverflow.com/a/55671924/20398230
    */

    let entities = result.rows;

    function weighted_random(options) {
      var i;

      var rates = [];

      for (i = 0; i < options.length; i++)
        rates[i] = options[i].rate + (rates[i - 1] || 0);

      var random = Math.random() * rates[rates.length - 1];

      for (i = 0; i < rates.length; i++) if (rates[i] > random) break;

      return options[i].stat_id;
    }

    // Instantiate the chosen entity as an empty object
    // Choose an entity with random weighting (set to stat_id)
    // Pass the zone_id as well

    let chosenEntity = {};

    chosenEntity.stat_id = weighted_random(entities);
    chosenEntity.zone_id = entities[0].zone_id;

    // Send the zone as well

    const sql2 = `
    SELECT stat.id, stat.min_health, stat.max_health, zone_stat.zone_id
    FROM stat, zone_stat
    WHERE
        zone_stat.zone_id = $2
        AND zone_stat.stat_id = stat.id
        AND stat.id = $1;
    `;
    pool.query(
      sql2,
      [chosenEntity.stat_id, chosenEntity.zone_id],
      (error, result) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, result);
        }
      }
    );
  };
});

module.exports = router;
