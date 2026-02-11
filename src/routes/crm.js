const express = require("express");
const pool = require("../db");
const auth = require("../middleware");

const router = express.Router();

router.get("/messages", auth, async (req, res) => {
  const result = await pool.query(
    "select * from messages where client_id=$1 order by created_at desc",
    [req.user.id]
  );

  res.json(result.rows);
});

module.exports = router;
