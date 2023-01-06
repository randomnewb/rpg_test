const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

/**
 * UPDATE state for user
 */

router.put("/state", rejectUnauthenticated, async (req, res) => {
  const db = await pool.connect();

  try {
    await db.query("BEGIN");

    const sql = `UPDATE "user"
    SET current_state=$1,
    spawn_id=$3
    WHERE id=$2;`;

    await db.query(sql, [req.body.userState, req.user.id, req.body.entityId]);
    await db.query("COMMIT");

    res.sendStatus(201);
  } catch (e) {
    await db.query("ROLLBACK");
    console.log("Error updating user state", e);
    res.sendStatus(500);
  } finally {
    db.release();
  }
});

/**
 * UPDATE current zone for user
 */

router.put("/zone/:id", rejectUnauthenticated, async (req, res) => {
  const db = await pool.connect();

  try {
    await db.query("BEGIN");

    const sql = `UPDATE "user"
    SET "current_zone" = $1
    WHERE "id" = $2;`;

    await db.query(sql, [req.params.id, req.user.id]);
    await db.query("COMMIT");

    res.sendStatus(201);
  } catch (e) {
    await db.query("ROLLBACK");
    console.log("Error updating zone", e);
    res.sendStatus(500);
  } finally {
    db.release();
  }
});

// Handles Ajax request for user information if user is authenticated
router.get("/", rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post("/register", (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = `INSERT INTO "user" (username, password)
    VALUES ($1, $2) RETURNING id`;
  pool
    .query(queryText, [username, password])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log("User registration failed: ", err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post("/login", userStrategy.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post("/logout", (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
