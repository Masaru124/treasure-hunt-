require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");

// ✅ This works even in Node.js v14–16
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 3000;

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

app.use(bodyParser.json());
app.use(express.static(__dirname)); 

app.post("/notify", async (req, res) => {
  const name = req.body.name || "Anonymous";
  console.log("Name received:", name); // Log for debugging

  const message = {
    content: `🚨 Someone visited your site!\n**Name:** ${name}`,
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    const text = await response.text();

    if (!response.ok) {
      console.error(`Discord error (${response.status}):`, text);
      return res.status(500).send("Discord webhook failed");
    }

    res.status(200).send("Notification sent");
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).send("Fetch exception");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
