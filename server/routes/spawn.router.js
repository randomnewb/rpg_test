const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

/**
 * GET route template
 */
router.get("/:id", rejectUnauthenticated, (req, res) => {
  // Obtains the...
  //    spawn.id which is the id of the mob that has been spawned into some zone
  //    entity.name is the entity's name
  //    spawn.current_health is the current health of the mob

  const sql = `
  SELECT spawn.id, entity.name, spawn.current_health 
  FROM spawn_zone,spawn, entity
  WHERE 
      zone_id = $1
      AND spawn_zone.spawn_id = spawn.id
      AND spawn.entity_id = entity.id;`;
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
 * POST route template
 */
router.post("/", (req, res) => {
  // POST route code here
});

module.exports = router;
