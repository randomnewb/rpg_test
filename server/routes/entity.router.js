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

  const db = await pool.connect();

  try {
    const healthOfEntity = await checkHealthOfEntity(req.params.id, db);
    const damageCalculation = await performDamageCalculation(
      req.params.id,
      healthOfEntity,
      db
    );

    // console.log("health after calculation", damageCalculation);

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

    console.log("what is damage calc", damageCalculation.current_health);
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
});

// Check health of entity
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

// For now, just subtract 1 health from entity
// If the entity's health is equal to or less than 0
// Remove the entity
// Or else just send the entity with updated health
const performDamageCalculation = async (entityId, entityHealth, db) => {
  console.log("entityId is", parseInt(entityId), "entityHealth", entityHealth);

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
