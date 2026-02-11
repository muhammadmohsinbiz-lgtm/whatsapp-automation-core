require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

// =======================
// CONFIG
// =======================
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "my_verify_token";

// =======================
// REPLY ENGINE
// =======================
function generateReply(text = "") {
  const msg = text.toLowerCase();

  if (msg.includes("price") || msg.includes("pricing")) {
    return "Our plans start from $49/month. Want a demo or full details?";
  }

  if (msg.includes("demo")) {
    return "Sure 👍 Please tell me your business type and goal.";
  }

  if (msg.includes("hi") || msg.includes("hello")) {
    return "Hello 👋 How can I help you today?";
  }

  return "Thanks for your message! Our team will get back shortly.";
}

// =======================
// ROOT TEST
// =======================
app.get('/', (req, res) => {
  res.status(200).send('Automation Core is running 🚀');
});

// =======================
// META WEBHOOK VERIFY
// =======================
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ WEBHOOK VERIFIED');
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// =======================
// META WEBHOOK RECEIVE
// =======================
app.post('/webhook', (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    // WhatsApp
    if (value?.messages) {
      const msg = value.messages[0];
      const reply = generateReply(msg.text?.body);

      console.log("📩 WhatsApp:", msg.from, msg.text?.body);
      console.log("🤖 Reply:", reply);

      // Yahan future me WhatsApp API send logic ayega
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(200);
  }
});

// =======================
// DEMO MODE
// =======================
app.post('/demo/incoming', (req, res) => {
  const { from, name, message } = req.body || {};
  const reply = generateReply(message);

  console.log("📩 DEMO:", from, name, message);
  console.log("🤖 Reply:", reply);

  res.json({
    status: "processed",
    reply
  });
});

// =======================
// EXPORT FOR VERCEL
// =======================
module.exports = app;
