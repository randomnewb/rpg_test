const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

// GET player's stats

router.get("/", rejectUnauthenticated, async (req, res) => {
  const db = await pool.connect();

  try {
    await db.query("BEGIN");

    const sql = `
        SELECT stat.name, stat.LEVEL, stat.experience, stat.health, stat.strength, stat.dexterity, stat.wisdom, stat.damage, stat.armor
        FROM "stat", "user"
        WHERE 
        "user".id = $1
        AND "stat".user_id = $1;
        `;

    result = await db.query(sql, [req.user.id]);

    res.status(200).send(result.rows[0]);
  } catch (err) {
    console.log(err);
    sendStatus(500);
  } finally {
    db.release();
  }
});

module.exports = router;
