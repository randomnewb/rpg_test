const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
    rejectUnauthenticated,
} = require("../modules/authentication-middleware");

// GET player's inventory

router.get("/", rejectUnauthenticated, (req, res) => {
    const sql = `
      SELECT item.*, inventory.*
      FROM item , inventory , "user" 
      WHERE 
      "user".id = $1
      AND inventory.item_id = item.id
      AND inventory.user_id = "user".id;`;
    pool.query(sql, [req.user.id])
        .then((result) => {
            res.status(200).send(result.rows[0]);
        })
        .catch((e) => {
            console.log("Error getting player's inventory", e);
            console.log(500);
        });
});

module.exports = router;
