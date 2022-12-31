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
 * POST route template
 */
router.post("/", (req, res) => {
  // POST route code here
});

module.exports = router;
