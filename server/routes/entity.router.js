const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

/**
 * FETCH specific entity by its id
 */
router.get("/:id", rejectUnauthenticated, async (req, res) => {
  const db = await pool.connect();

  try {
    await db.query("BEGIN");

    const sql = `
        SELECT spawn.current_health, stat.name, stat.type
        FROM spawn spawn, stat stat
        WHERE 
        spawn.stat_id = stat.id
        AND spawn.id = $1;
    `;

    result = await db.query(sql, [req.params.id]);

    res.status(200).send(result.rows[0]);
  } catch (err) {
    console.error(err);
    sendStatus(500);
  } finally {
    db.release();
  }
});

/**
 * INTERACT with specific entity by its id
 */
router.put("/:id", async (req, res) => {
  // Get the entity by its id
  // Subtract the entity's current_health by 1
  // Return the entity

  console.log(req.params.id);

  const db = await pool.connect();

  try {
    await db.query("BEGIN");

    const sql = `
        UPDATE spawn
        SET current_health=0
        WHERE id=$1
    `;

    result = await db.query(sql, [req.params.id]);

    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    sendStatus(500);
  } finally {
    db.release();
  }
});

module.exports = router;
