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
  const db = await pool.connect();

  const entityReward = await getEntityReward(req.params.id, db);

  // If for some reason the entity is null as the user's spawn_id
  // they are interacting with, set the player to observing

  if (!req.params.id) {
    try {
      res.send(updateUserState(req.user.id, "observing", db));
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    } finally {
      db.release();
    }
  } else {
    //  Check to see if the entity exists
    // This check needs to happen first before anything to avoid problems with updates
    // or 'multiplayer', where someone else has already defeated an entity
    // that a user wants to interact with

    const entityExists = await checkEntityExists(req.params.id, db);
    // If entity no longer exists, set the player's state back to observing
    if (!entityExists) {
      try {
        res.send(updateUserState(req.user.id, "observing", db));
      } catch (err) {
        console.error(err);
        res.sendStatus(500);
      } finally {
        db.release();
      }
      // Or else perform the damage calculation
    } else if (entityExists) {
      // If there is an entity (the id of the entity is not undefined basically)
      // We will want to use the entity's id in the future to know how to calculate
      // the damage against the player

      try {
        // First, check if the player would be defeated
        const healthOfPlayer = await getPlayerStats(req.user.id, db);
        const playerHurtCalculation = await performPlayerHurtCalculation(
          req.user.id,
          healthOfPlayer,
          db
        );
        if (playerHurtCalculation.current_state === "defeated") {
          let result = { current_state: "defeated" };
          res.status(200).send(result);
        }
        // If the player has not been defeated, perform steps below
        if (playerHurtCalculation.current_state !== "defeated") {
          // Get the health of the entity
          const healthOfEntity = await checkHealthOfEntity(req.params.id, db);

          // Get the stats of the player
          const playerStats = await getPlayerStats(req.user.id, db);

          // Perform the damage calculation
          const damageCalculation = await performDamageCalculation(
            req.params.id,
            playerStats,
            healthOfEntity,
            db
          );
          // If after the damage calculation, the entity has no more health
          // then send back info to update the user state to observing
          if (damageCalculation === "entity_defeated") {
            await generateLootAndRewardPlayer(req.user.id, entityReward, db);

            await updateUserState(req.user.id, "observing", db);

            // Perhaps also send the information about the reward
            // back to the client, can change generateLootAndRewardPlayer
            // to be const reward = generateLootAndRewardPlayer
            // and this stores the reward
            // Could also change the current_state to victorious
            // and show a different view with the reward information
            res.status(201).send({ current_state: "observing" });
          }

          // Or else send back the current health of the entity
          if (damageCalculation.current_health >= 1) {
            res.status(201).send(damageCalculation);
          }
        }
      } catch (err) {
        await db.query("ROLLBACK");
        console.error(err);
        res.sendStatus(500);
      } finally {
        db.release();
      }
    }
  }
});

const getEntityReward = async (entityId, db) => {
  // We need to know the stat_id of the entity so we can get its possible rewards
  // Loot table of entity player is interacting with

  const sql_getEntityReward = `
    SELECT stat_item.item_id, stat_item.rate
    FROM spawn, stat, stat_item
    WHERE 
    spawn.id = $1
    AND spawn.stat_id = stat.id
    AND stat.id = stat_item.stat_id;
  `;

  const result = await db.query(sql_getEntityReward, [entityId]);
  return result.rows;
};

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

const performDamageCalculation = async (
  entityId,
  playerStats,
  entityHealth,
  db
) => {
  let playerDamage = playerStats.damage;

  entityId = parseInt(entityId);

  entityHealth = entityHealth - playerDamage;

  if (entityHealth <= 0) {
    try {
      await db.query("BEGIN");

      const sql_performDamageCalculation = `
      DELETE FROM spawn
      WHERE id=$1;
      `;

      await db.query(sql_performDamageCalculation, [entityId]);

      await db.query("COMMIT");

      let result = "entity_defeated";

      return result;
    } catch (e) {
      await db.query("ROLLBACK");
      console.log(e);
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
    }
  }
};

const generateLootAndRewardPlayer = async (playerId, loot, db) => {
  // Generate a weighted random reward from the loot

  function weighted_random(options) {
    var i;

    var rates = [];

    for (i = 0; i < options.length; i++)
      rates[i] = options[i].rate + (rates[i - 1] || 0);

    var random = Math.random() * rates[rates.length - 1];

    for (i = 0; i < rates.length; i++) if (rates[i] > random) break;

    return options[i].item_id;
  }

  let chosenItem = weighted_random(loot);

  // Add an entry to the inventory table for the player

  // If it is a new entry, INSERT a new entry
  // If it is not, UPDATE the entry

  const sql_addItemToInventory = `
    INSERT INTO inventory (item_id, user_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (item_id, user_id)
    DO UPDATE SET quantity = inventory.quantity + $3;
    `;

  try {
    await db.query("BEGIN");

    await db.query(sql_addItemToInventory, [chosenItem, playerId, 1]);

    await db.query("COMMIT");
  } catch (e) {
    await db.query("ROLLBACK");
    console.log(e);
  }

  return chosenItem;
};

const getPlayerStats = async (playerId, db) => {
  // Get health of player

  try {
    const sql_checkHealthOfPlayer = `
        SELECT stat.name, stat.level, stat.experience, stat.health, stat.strength, stat.dexterity, stat.wisdom, stat.damage, stat.armor
        FROM "stat", "user"
        WHERE 
        "user".id = $1
        AND "stat".user_id = $1; 
        `;

    const checkHealthOfPlayer = await db.query(sql_checkHealthOfPlayer, [
      playerId,
    ]);

    return checkHealthOfPlayer.rows[0];
  } catch (e) {
    console.log("Couldn't get player's stats", e);
  }
};

const performPlayerHurtCalculation = async (playerId, playerHealth, db) => {
  /**
   * For now, just subtract 1 health from player
   *
   * If the player's health is equal to or less than 0
   * We set their state to defeated
   *
   * Or else, just update their health in the database and return this
   */

  let health = playerHealth.health;

  health = health - 1;

  if (health <= 0) {
    try {
      await db.query("BEGIN");

      // Set the player's state to "defeated"

      const sql_userDefeated = `
            UPDATE "user" 
            SET current_state='defeated'
            WHERE id=$1
            RETURNING current_state;
            `;

      await db.query(sql_userDefeated, [playerId]);

      await db.query("COMMIT");

      let result = { current_state: "defeated" };

      return result;
    } catch (e) {
      await db.query("ROLLBACK");
      console.log(e);
    }
  } else if (health >= 1) {
    try {
      await db.query("BEGIN");

      // Update the player's health
      const sql_updateHealth = `
            UPDATE "stat"
            SET health = $2
            WHERE "stat".user_id = $1
            RETURNING health;
            `;

      const updatedHealth = await db.query(sql_updateHealth, [
        playerId,
        health,
      ]);

      await db.query("COMMIT");

      return updatedHealth.rows[0];
    } catch (e) {
      await db.query("ROLLBACK");
      console.log(e);
    }
  }
};

async function updateUserState(id, state, db) {
  const sql = `
  UPDATE "user" 
  SET current_state = $1 
  WHERE id = $2 
  RETURNING current_state;`;
  const result = await db.query(sql, [state, id]);
  return result.rows[0];
}

module.exports = router;
