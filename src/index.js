require("dotenv").config();
const express = require("express");
const pool = require("./db");
const { register, login } = require("./auth");
const { sendWhatsAppMessage } = require("./whatsapp");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("WhatsApp SaaS Running 🚀");
});

app.post("/register", register);
app.post("/login", login);

app.post("/add-whatsapp", async (req, res) => {
  const { client_id, phone_number_id, access_token } = req.body;

  await pool.query(
    `insert into whatsapp_accounts 
    (client_id, phone_number_id, access_token)
    values ($1,$2,$3)`,
    [client_id, phone_number_id, access_token]
  );

  res.json({ status: "connected" });
});

app.post("/send", async (req, res) => {
  const { phone_number_id, access_token, to, message } = req.body;

  await sendWhatsAppMessage(
    phone_number_id,
    access_token,
    to,
    message
  );

  res.json({ status: "sent" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running...");
});
