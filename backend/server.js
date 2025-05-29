require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { createClient } = require("redis");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// 🔌 Redis Client Setup
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect()
  .then(() => console.log("🔌 Connected to Redis"))
  .catch((err) => console.error("❌ Redis connection error:", err));

// Export for controllers
module.exports.redisClient = redisClient;

// 🌐 Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🛢️ Connect MongoDB
connectDB();

// 🚏 API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/hashtags", require("./routes/hashtagRoutes"));

// 🧱 Error Handler
app.use(errorHandler);

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
