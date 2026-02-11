require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const whatsappRoutes = require("./routes/whatsapp");
const crmRoutes = require("./routes/crm");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("WA Automation CRM Pro Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/crm", crmRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started"));
