const { red } = require("@mui/material/colors");
const express = require("express");
const {
    rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const encryptLib = require("../modules/encryption");
const pool = require("../modules/pool");
const userStrategy = require("../strategies/user.strategy");

const router = express.Router();

/**
 * UPDATE current zone for user
 */

router.put("/zone/:id", rejectUnauthenticated, async (req, res) => {
    const db = await pool.connect();

    try {
        await db.query("BEGIN");

        const sql = `UPDATE "user"
    SET "current_zone" = $1
    WHERE "id" = $2
    RETURNING current_zone;`;

        const result = await db.query(sql, [req.params.id, req.user.id]);

        await db.query("COMMIT");

        res.status(201).send(result.rows[0]);
    } catch (e) {
        await db.query("ROLLBACK");
        console.log("Error updating zone", e);
        res.sendStatus(500);
    } finally {
        db.release();
    }
});

/**
 * UPDATE state for user
 */

router.put("/state", rejectUnauthenticated, async (req, res) => {
    const db = await pool.connect();

    if (req.body.userState === "abandon") {
        try {
            await db.query("BEGIN");

            const sql = `UPDATE "user"
            SET current_state=$1,
            spawn_id=$3
            WHERE id=$2;`;

            await db.query(sql, ["observing", req.user.id, null]);
            await db.query("COMMIT");

            res.sendStatus(201);
        } catch (e) {
            await db.query("ROLLBACK");
            console.log("Error abandoning event", e);
            res.sendStatus(500);
        } finally {
            db.release();
        }
    } else if (req.body.userState === "reset") {
        try {
            await db.query("BEGIN");

            const sql = `
            UPDATE "user"
            SET current_state=$1,
            spawn_id=$3
            WHERE id=$2;
            `;

            await db.query(sql, ["observing", req.user.id, null]);

            const sql2 = `
            UPDATE "stat"
            SET health = max_health
            WHERE "stat".user_id = $1;
            `;

            await db.query(sql2, [req.user.id]);

            await db.query("COMMIT");

            res.sendStatus(201);
        } catch (e) {
            await db.query("ROLLBACK");
            console.log("Error abandoning event", e);
            res.sendStatus(500);
        } finally {
            db.release();
        }
    } else {
        const entityExists = await entityCheck(req.body.entityId, db);

        if (entityExists > 0) {
            try {
                await db.query("BEGIN");

                const sql = `UPDATE "user"
        SET current_state=$1,
        spawn_id=$3
        WHERE id=$2;`;

                await db.query(sql, [
                    req.body.userState,
                    req.user.id,
                    req.body.entityId,
                ]);
                await db.query("COMMIT");

                res.sendStatus(201);
            } catch (e) {
                await db.query("ROLLBACK");
                console.log("Error updating user state", e);
                res.sendStatus(500);
            } finally {
                db.release();
            }
        } else if (entityExists === undefined) {
            try {
                let result = { current_state: "observing" };

                res.status(201).send(result);
            } catch (e) {
                console.log("Error retrieving entity", e);
                res.sendStatus(500);
            }
        }
    }
});

// Perform a check to see if the entity still exists

const entityCheck = async (entityId, db) => {
    if (entityId) {
        try {
            const sql_entityCheck = `
      SELECT id
      FROM spawn
      WHERE id=$1;
      `;

            const entityCheck = await db.query(sql_entityCheck, [entityId]);

            return entityCheck.rows[0].id;
        } catch (e) {
            console.log("Could not retrieve entity from database", e);
        }
    }
};

/*
 * UPDATE / Initialize the user
 */

router.put("/initialize", rejectUnauthenticated, async (req, res) => {
    const db = await pool.connect();

    try {
        await db.query("BEGIN");

        const sql_initializeCharacter = `
    INSERT INTO stat ("user_id","name", "level", "health", "strength", "dexterity", "wisdom", "damage")
    VALUES ($1, $2, 1, $3, $4, $5, $6, 1)
    RETURNING id;
    `;

        const initialize = await db.query(sql_initializeCharacter, [
            req.user.id,
            req.body.name,
            req.body.health,
            req.body.strength,
            req.body.dexterity,
            req.body.wisdom,
        ]);

        await db.query("COMMIT");

        const sql_tieUserStat = `
    UPDATE "user"
    SET current_state='observing', stat_id=$1
    WHERE id=$2;
    `;

        await db.query(sql_tieUserStat, [initialize.rows[0].id, req.user.id]);

        await db.query("COMMIT");

        res.sendStatus(201);
    } catch (e) {
        await db.query("ROLLBACK");
        console.log("Error initializing the user", e);
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
    pool.query(queryText, [username, password])
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
