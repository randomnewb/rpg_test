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
    console.log(err);
    sendStatus(500);
  } finally {
    db.release();
  }
  // }
});

/**
 * INTERACT with specific entity by its id
 */
router.put("/:id", async (req, res) => {
  // Get the entity by its id
  // Subtract the entity's current_health by 1
  // Return the entity

  const db = await pool.connect();

  const entityExists = await checkEntityExists(req.params.id, db);

  console.log("what is entityExists", entityExists);

  if (entityExists === undefined) {
    try {
      const sql_setUserState = `
      UPDATE "user" 
      SET current_state='observing'
      WHERE id=$1;
      `;

      await db.query(sql_setUserState, [req.user.id]);

      res.send("observing");
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    } finally {
      db.release();
    }
  } else if (req.params.id > 0) {
    try {
      const healthOfEntity = await checkHealthOfEntity(req.params.id, db);
      const damageCalculation = await performDamageCalculation(
        req.params.id,
        healthOfEntity,
        db
      );

      if (damageCalculation <= 0) {
        const sql_setUserState = `
      UPDATE "user" 
      SET current_state='observing'
      WHERE id=$1;
      `;

        await db.query(sql_setUserState, [req.user.id]);

        let resetState = { current_state: "observing" };
        res.status(201).send(resetState);
      }

      if (damageCalculation.current_health >= 1) {
        res.status(201).send(damageCalculation);
      }
    } catch (err) {
      await db.query("ROLLBACK");
      console.error(err);
      res.sendStatus(500);
    } finally {
      db.release();
    }
  }
});

const checkEntityExists = async (entityId, db) => {
  // Check to see if the spawned entity the user is interacting with still exists
  try {
    const sql_checkEntityExists = `
    SELECT id
    FROM spawn
    WHERE id=$1;
    `;

    const constCheckEntityExists = await db.query(sql_checkEntityExists, [
      entityId,
    ]);

    return constCheckEntityExists.rows[0];
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const checkHealthOfEntity = async (entityId, db) => {
  // Get health of the entity
  try {
    const sql_checkHealthOfEntity = `
      SELECT id, current_health
      FROM spawn
      WHERE id=$1;
    `;

    const checkHealthOfEntity = await db.query(sql_checkHealthOfEntity, [
      entityId,
    ]);

    return checkHealthOfEntity.rows[0].current_health;
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};

const performDamageCalculation = async (entityId, entityHealth, db) => {
  // For now, just subtract 1 health from entity
  // If the entity's health is equal to or less than 0
  // Remove the entity
  // Or else just send the entity with updated health
  entityId = parseInt(entityId);

  entityHealth = entityHealth - 1;

  if (entityHealth <= 0) {
    try {
      await db.query("BEGIN");

      const sql_performDamageCalculation = `
      DELETE FROM spawn
      WHERE id=$1;
      `;

      await db.query(sql_performDamageCalculation, [entityId]);

      await db.query("COMMIT");

      let result = 0;

      return result;
    } catch (e) {
      await db.query("ROLLBACK");
      console.log(e);
      res.sendStatus(500);
    }
  } else if (entityHealth >= 1) {
    try {
      await db.query("BEGIN");

      const sql_performDamageCalculation = `
        UPDATE spawn
        SET current_health=$2
        WHERE id=$1
        RETURNING *;
        `;

      const damageCalculation = await db.query(sql_performDamageCalculation, [
        entityId,
        entityHealth,
      ]);

      await db.query("COMMIT");

      return damageCalculation.rows[0];
    } catch (e) {
      await db.query("ROLLBACK");
      console.log(e);
      res.sendStatus(500);
    }
  }
};

module.exports = router;
