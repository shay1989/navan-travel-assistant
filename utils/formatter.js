/**
 * Formatter
 *
 * Formats external data into structured context blocks.
 */

/**
 * Formats weather data into a structured context block.
 */
function formatWeatherContext(weatherData) {
  if (!weatherData) return null;

  const forecastLines = weatherData.forecast
    .slice(0, 5)
    .map(
      (day) =>
        `  ${day.date}: ${day.condition}, High ${day.high}°C / Low ${day.low}°C, ` +
        `${day.precipitationChance}% chance of precipitation`
    )
    .join("\n");

  return `
[LIVE WEATHER DATA - Use this as the source of truth for current conditions]
Location: ${weatherData.location}
Current Conditions: ${weatherData.current.temperature}°C, ${weatherData.current.condition}
Humidity: ${weatherData.current.humidity}%
Wind: ${weatherData.current.windSpeed} km/h

5-Day Forecast:
${forecastLines}
[END WEATHER DATA]
`.trim();
}

module.exports = {
  formatWeatherContext
};
