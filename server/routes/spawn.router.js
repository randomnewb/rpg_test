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
  SELECT spawn.id, type.description, entity.name, spawn.current_health 
  FROM stat, type, spawn_zone, spawn, entity
  WHERE 
    zone_id = $1
    AND	stat.type_id = type.id
    AND	spawn_zone.spawn_id = spawn.id
    AND spawn.entity_id = entity.id
    AND stat.id = entity.id;
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
router.post("/:id", (req, res) => {
  const entitiesInfo = (callback) => {
    const sql = `
    select entity.name, entity.id, stat.min_health, stat.max_health
  from entity, stat
  where
    entity.id = stat.id;`;

    pool.query(sql, (error, result) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, result);
      }
    });
  };

  entitiesInfo((error, result) => {
    if (error) {
      console.log(error);
    } else {
      addEntitiesToZone(result, (error, result2) => {
        if (error) {
          console.log(error);
        } else {
          // console.log("Is this the chosenEntity?", result2);
        }
      });
    }
  });

  const addEntitiesToZone = (result2, callback) => {
    console.log("adding entities to zone", result2.rows);

    let entities = result2.rows;

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * entities.length);

    // Get the value at the random index
    const chosenEntity = entities[randomIndex];

    // console.log(chosenEntity);

    const randomNumRange = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    chosenEntity.current_health = randomNumRange(
      chosenEntity.min_health,
      chosenEntity.max_health
    );

    console.log("Chosen entity's health is", chosenEntity);

    // This inserts a randomly chosen entity into the database properly
    // after its health has also been randomly generated
    // The next step is to also insert it into the spawn_zone table
    // So that this can be fed back to the client

    const sql = `
      INSERT INTO spawn
      (entity_id, current_health)
      VALUES($1, $2);
      `;
    pool.query(
      sql,
      [chosenEntity.id, chosenEntity.current_health],
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
