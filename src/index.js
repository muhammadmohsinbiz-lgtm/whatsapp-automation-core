require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

// =======================
// CONFIG
// =======================
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "my_verify_token";

// =======================
// ROOT ROUTE (TEST)
// =======================
app.get('/', (req, res) => {
  res.send('WhatsApp Automation Server is running');
});

// =======================
// WEBHOOK VERIFY (GET)
// =======================
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    console.log('WEBHOOK VERIFICATION FAILED');
    res.sendStatus(403);
  }
});

// =======================
// WEBHOOK RECEIVE (POST)
// =======================
app.post('/webhook', (req, res) => {
  console.log('INCOMING WEBHOOK DATA:');
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// =======================
// SERVER START
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
