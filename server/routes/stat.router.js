const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

// GET player's stats

router.get("/", rejectUnauthenticated, (req, res) => {
  const sql = `
        SELECT *
        FROM "stat", "user"
        WHERE 
        "user".id = $1
        AND "stat".user_id = $1;
        `;

  pool
    .query(sql, [req.user.id])
    .then((result) => {
      res.status(200).send(result.rows[0]);
    })
    .catch((e) => {
      console.log("Error getting player's stats", e);
      console.log(500);
    });
});

module.exports = router;
