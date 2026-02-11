const express = require("express");
const axios = require("axios");
const pool = require("../db");
const auth = require("../middleware");

const router = express.Router();

router.post("/connect", auth, async (req, res) => {
  const { phone_number_id, access_token } = req.body;

  await pool.query(
    `insert into whatsapp_accounts 
     (client_id, phone_number_id, access_token)
     values ($1,$2,$3)`,
    [req.user.id, phone_number_id, access_token]
  );

  res.json({ status: "connected" });
});

router.post("/send", auth, async (req, res) => {
  const { to, message } = req.body;

  const result = await pool.query(
    "select * from whatsapp_accounts where client_id=$1",
    [req.user.id]
  );

  const account = result.rows[0];

  await axios.post(
    `https://graph.facebook.com/v18.0/${account.phone_number_id}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      text: { body: message }
    },
    {
      headers: {
        Authorization: `Bearer ${account.access_token}`,
        "Content-Type": "application/json"
      }
    }
  );

  res.json({ status: "sent" });
});

module.exports = router;
