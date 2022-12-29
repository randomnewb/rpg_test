const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

/**
 * GET zone by id
 */
// router.get("/:id", rejectUnauthenticated, async (req, res) => {
//   const db = await pool.connect();

//   try {
//     await db.query("BEGIN");

//     const sql = `SELECT * FROM "zone" WHERE "id" = $1;`;

//     const result = await db.query(sql, [req.params.id]);

//     await db.query("COMMIT");
//     console.log(result.rows[0]);
//     res.send(result.rows[0]);
//     res.sendStatus(201);
//   } catch (e) {
//     await db.query("ROLLBACK");
//     console.log(e);
//     res.sendStatus(500);
//   } finally {
//     db.release();
//   }
// });

router.get("/:id", rejectUnauthenticated, (req, res) => {
  const sql = `SELECT * FROM "zone" WHERE id=$1;`;
  pool
    .query(sql, [req.params.id])
    .then((result) => {
      res.send(result.rows[0]);
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
