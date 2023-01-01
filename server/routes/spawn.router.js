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
      let entities = result.rows;

      // Generate a random index
      const randomIndex = Math.floor(Math.random() * entities.length);

      // Get the value at the random index
      const chosenEntity = entities[randomIndex];

      console.log(chosenEntity);

      const randomNumRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      console.log(
        "Chosen entity's health is",
        randomNumRange(chosenEntity.min_health, chosenEntity.max_health)
      );
    }
  });
});

module.exports = router;
