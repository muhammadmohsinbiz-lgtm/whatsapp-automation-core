require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

// =======================
// CONFIG
// =======================
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "my_verify_token";

// =======================
// IN-MEMORY CRM (DEMO)
// =======================
const leads = [];

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

// ===============================
// DEMO MODE ROUTES (NO META)
// ===============================

// GET test (browser open ke liye)
app.get('/demo/incoming', (req, res) => {
  res.json({
    status: 'Demo endpoint is live',
    usage: 'Send POST request with message payload'
  });
});

// POST demo message with AUTOMATION + CRM
app.post('/demo/incoming', (req, res) => {
  const { from, name, message } = req.body || {};

  if (!message) {
    return res.status(400).json({
      error: 'Message field is required'
    });
  }

  const text = message.toLowerCase();
  let reply = 'Thanks for contacting Automation Core! How can we help you?';
  let tag = 'general';

  if (text.includes('price') || text.includes('pricing')) {
    reply = 'Our plans start from $49/month. Would you like a demo or full details?';
    tag = 'pricing';
  } else if (text.includes('demo')) {
    reply = 'Sure! Please tell us your business type and expected message volume.';
    tag = 'demo';
  } else if (text.includes('support')) {
    reply = 'Our support team is here. Please describe your issue.';
    tag = 'support';
  }

  // Save lead (CRM demo)
  leads.push({
    from,
    name,
    message,
    tag,
    at: new Date().toISOString()
  });

  console.log('📩 DEMO MESSAGE:', { from, name, message, tag });

  res.json({
    status: 'processed',
    tag,
    reply
  });
});

// ===============================
// VIEW SAVED LEADS (CRM)
// ===============================
app.get('/demo/leads', (req, res) => {
  res.json({
    count: leads.length,
    leads
  });
});

// =======================
// SERVER START
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
