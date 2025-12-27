/**
 * Message Analyzer
 *
 * Utilities for analyzing user messages
 */

/**
 * Uses keyword matching for speed and predictability.
 * In production, this could come from database of supported destinations or any other lists
 * Alternative we can use LLM to classify intent (more accurate but adds latency/cost)
 */
const WEATHER_TRIGGERS = [
  // direct weather terms
  "weather", "forecast", "temperature", "climate",
  // clothing/packing
  "pack", "packing", "bring", "wear", "clothes", "clothing",
  // conditions
  "cold", "hot", "warm", "rain", "rainy", "snow", "sunny", "humid"
];

function isWeatherRelatedQuery(message) {
  const messageLower = message.toLowerCase();
  return WEATHER_TRIGGERS.some((trigger) => messageLower.includes(trigger));
}

/**
 * Popular destinations with aliases.
 * In production, this could come from a database, other option is LLM, but might be more expensive
 */
const DESTINATIONS = [
  { name: "New York", aliases: ["new york", "ny", "nyc", "manhattan"] },
  { name: "Los Angeles", aliases: ["los angeles", "la", "hollywood"] },
  { name: "London", aliases: ["london", "uk", "england"] },
  { name: "Paris", aliases: ["paris", "france"] },
  { name: "Tokyo", aliases: ["tokyo", "japan"] },
  { name: "Rome", aliases: ["rome", "italy"] },
  { name: "Barcelona", aliases: ["barcelona", "spain"] },
  { name: "Amsterdam", aliases: ["amsterdam", "netherlands"] },
  { name: "Sydney", aliases: ["sydney", "australia"] },
  { name: "Dubai", aliases: ["dubai", "uae"] }
];

/**
 * Extracts a travel destination from the conversation.
 */
function extractLocation(message, conversationHistory = []) {
  const text = [message, ...conversationHistory.map((m) => m.content)]
    .join(" ")
    .toLowerCase();

  // split into words for exact matching
  const words = text.split(/\s+/);

  for (const dest of DESTINATIONS) {
    // sort by length - match "new york" before "ny"
    const sorted = [...dest.aliases].sort((a, b) => b.length - a.length);
    for (const alias of sorted) {
      const isMultiWord = alias.includes(" ");

      if (isMultiWord) {
        // multi-word aliases like "new york" - safe to use includes
        if (text.includes(alias)) {
          return dest.name;
        }
      } else {
        // single-word aliases - must match exact word
        if (words.includes(alias)) {
          return dest.name;
        }
      }
    }
  }

  return null;
}

module.exports = {
  isWeatherRelatedQuery,
  extractLocation
};
