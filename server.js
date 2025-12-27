/**
 * Travel Assistant API - Server
 *
 * Main entry point.
 * In a Real application this file will be slim and all other logic distributed,
 * such as routes, validation, models.. etc..
 */

require("dotenv").config();
const express = require("express");
const { processMessage, clearConversation } = require("./services/chatService");
const { clearWeatherCache } = require("./services/weatherService");

// app setup
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/**
 * POST /chat
 * Send a message to the travel assistant.
 */
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  // Validate input
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({
      error: "Message is required and must be a non-empty string"
    });
  }

  try {
    const result = await processMessage(message.trim());
    return res.json(result);
  } catch (error) {
    console.error("Chat error:", error.message);

    // handle rate limiting specifically
    if (error.status === 429) {
      return res.status(429).json({
        error: "Too many requests. Please wait a moment and try again."
      });
    }

    return res.status(500).json({
      error: "Something went wrong. Please try again."
    });
  }
});

/**
 * POST /reset
 * Clear conversation history.
 */
app.post("/reset", (req, res) => {
  clearConversation();
  clearWeatherCache();
  res.json({
    message: "Conversation history cleared",
    success: true
  });
});

/**
 * GET /health
 * Health check endpoint.
 */
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// start server
app.listen(PORT, () => {
  console.log(`Travel Assistant API running on port ${PORT}`);
});
