const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

// GET player's equipped items

router.get("/", rejectUnauthenticated, (req, res) => {
  const sql = `
    SELECT item.*, equipped.*
    FROM item, equipped, "user" 
    WHERE 
    "user".id = $1
    AND equipped.item_id = item.id
    AND equipped.user_id = "user".id;
      `;
  pool
    .query(sql, [req.user.id])
    .then((result) => {
      res.status(200).send(result.rows);
    })
    .catch((e) => {
      console.log("Error getting player's equipped items", e);
      console.log(500);
    });
});

// UPDATE player's equipped items (from inventory to equipped)

router.put("/:id", rejectUnauthenticated, async (req, res) => {
  const db = await pool.connect();

  const itemValid = await checkItem(req.params.id, req.user.id, db);

  if (itemValid) {
    try {
      await db.query("BEGIN");

      await removeItem(req.params.id, req.user.id, db, itemValid);

      const sql_equipItem = `
      INSERT INTO equipped (item_id, user_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (item_id, user_id)
      DO UPDATE SET quantity = equipped.quantity + $3;
      `;

      await db.query(sql_equipItem, [req.params.id, req.user.id, 1]);

      await db.query("COMMIT");

      res.sendStatus(200);
    } catch (e) {
      await db.query("ROLLBACK");
      console.log(e);
    } finally {
      db.release();
    }
  } else {
    res.sendStatus(200);
    db.release();
  }
});

const checkItem = async (itemId, user, db) => {
  try {
    const sql_checkItem = `
    SELECT inventory.item_id, inventory.quantity, "user".id
    FROM  inventory, "user" 
    WHERE 
    "user".id = $1
    AND inventory.item_id = $2;
    `;

    const result = await db.query(sql_checkItem, [user, itemId]);
    return result.rows[0];
  } catch (e) {
    console.log(e);
  }
};

const removeItem = async (itemId, user, db, itemValid) => {
  if (itemValid.quantity === 1) {
    try {
      const sql_removeItem = `
            DELETE FROM inventory
            WHERE item_id=$1 AND user_id=$2 AND quantity=1;
            `;
      await db.query(sql_removeItem, [itemId, user]);
    } catch (e) {
      console.log(e);
    }
  } else {
    try {
      const sql_updateItemQuantity = `
        UPDATE inventory
        SET item_id=$1, user_id=$2, quantity=quantity - 1
        WHERE item_id=$1 AND user_id=$2;
        `;

      await db.query(sql_updateItemQuantity, [itemId, user]);

      await db.query("COMMIT");
    } catch (e) {
      await db.query("ROLLBACK");
      console.log(e);
    }
  }
};

module.exports = router;
