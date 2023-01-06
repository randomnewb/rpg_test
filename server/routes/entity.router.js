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

    console.log("entity detail", result.rows[0]);

    res.send(result.rows[0]);
  } catch (err) {
    console.error(err);
    sendStatus(500);
  } finally {
    db.release();
  }
});

module.exports = router;
