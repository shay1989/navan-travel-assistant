/**
 * Chat Service
 *
 * Handles LLM interactions and message augmentation.
 */

const Anthropic = require("@anthropic-ai/sdk");
const { SYSTEM_PROMPT } = require("../config/systemPrompt");
const { fetchWeatherData, isWeatherCached } = require("./weatherService");
const { isWeatherRelatedQuery, extractLocation } = require("../utils/messageAnalyzer");
const { formatWeatherContext } = require("../utils/formatter");
const { log } = require("../utils/logger");

// init ai api 
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});


// simple conversation history for demo
let conversationHistory = [];

/**
 * Processes a user message and generates an assistant response.
 */
async function processMessage(message) {
  log("Chat", `Processing: "${message}"`);

  // check if this query need weather data
  const isWeatherRequired = isWeatherRelatedQuery(message);
  log("Chat", `Needs weather: ${isWeatherRequired}`);

  // only extract location if weather is needed
  let location = null;
  let weatherData = null;
  if (isWeatherRequired) {
    location = extractLocation(message, conversationHistory);
    log("Chat", `Location: ${location || "not found"}`);
    if (location) {
      weatherData = await fetchWeatherData(location);
    }
  }

  // build augmented message with external data context
  let augmentedMessage = message;
  if (weatherData) {
    const weatherContext = formatWeatherContext(weatherData);
    augmentedMessage = `${message}\n\n${weatherContext}`;
  }

  // add user message to history (store original, not augmented)
  conversationHistory.push({
    role: "user",
    content: message
  });

  try {
    // prepare messages for LLM - inject augmented context in the latest message only
    const messagesForLLM = [
      ...conversationHistory.slice(0, -1),
      { role: "user", content: augmentedMessage }
    ];

    // call the LLM (In a real app I would have a seperated service for the api calls)
    log("Claude", `Calling API with ${messagesForLLM.length} messages...`);
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messagesForLLM
    });

    const assistantReply = response.content[0].text;
    log("Claude", `Response received (${assistantReply.length} chars)`);

    // add assistant response to history
    conversationHistory.push({
      role: "assistant",
      content: assistantReply
    });

    return {
      success: true,
      reply: assistantReply,
      dataSourcesUsed: {
        weather: weatherData !== null,
        location: location,
        cached: location ? isWeatherCached(location) : false
      },
      conversationLength: conversationHistory.length
    };
  } catch (error) {
    // Rollback: Remove the user message since we failed
    conversationHistory.pop();

    // Re-throw with additional context
    throw error;
  }
}

/**
 * Clears conversation history.
 */
function clearConversation() {
  conversationHistory = [];
}

/**
 * Gets current conversation length.
 */
function getConversationLength() {
  return conversationHistory.length;
}

module.exports = {
  processMessage,
  clearConversation,
  getConversationLength
};
