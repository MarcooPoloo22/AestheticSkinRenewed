// server/index.js
const express = require("express");
const app = express();
require("dotenv").config(); // Loads .env variables including LIVECHAT_PAT
const liveChatRoutes = require("./routes/livechat");

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the LiveChat routes under /api/livechat
app.use("/api/livechat", liveChatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
