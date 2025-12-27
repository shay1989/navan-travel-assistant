/**
 * Weather Service
 *
 * Handles external weather data fetching with caching.
 * Uses Open-Meteo API (free, no key required).
 */

const { log } = require("../utils/logger");

/**
 * Simple in-memory cache with TTL.
 * In production: I would consider Redis or similar for distributed caching
 */
class Cache {
  constructor(ttlMs = 30 * 60 * 1000) {
    this.store = new Map();
    this.ttl = ttlMs;
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.ttl;
    if (isExpired) {
      this.store.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key, data) {
    this.store.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.store.clear();
  }

  has(key) {
    return this.get(key) !== null;
  }
}

// weather cache with 30 minute TTL
const weatherCache = new Cache(30 * 60 * 1000);


/**
 * Fetches weather forecast from Open-Meteo API with caching.
 */
async function fetchWeatherData(location) {
  const cacheKey = location.toLowerCase().trim();

  // Check cache first
  const cached = weatherCache.get(cacheKey);
  if (cached) {
    log("Cache", `HIT - Weather data for "${location}"`);
    return cached;
  }

  log("Cache", `MISS - Fetching weather for "${location}"`);

  try {
    // geocode the location to get coordinates
    log("Weather", `Geocoding "${location}"...`);
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`
    );
    const geoData = await geoResponse.json();

    if (!geoData.results?.length) {
      log("Weather", "Location not found");
      return null;
    }

    const { latitude, longitude, name, country } = geoData.results[0];
    log("Weather", `Found: ${name}, ${country} (${latitude}, ${longitude})`);

    // fetch weather forecast using coordinates
    log("Weather", "Fetching forecast...");
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code` +
        `&timezone=auto&forecast_days=7`
    );
    const weatherData = await weatherResponse.json();
    log("Weather", "Forecast received");

    const result = {
      location: `${name}, ${country}`,
      current: {
        temperature: Math.round(weatherData.current.temperature_2m),
        humidity: weatherData.current.relative_humidity_2m,
        windSpeed: Math.round(weatherData.current.wind_speed_10m),
      },
      forecast: weatherData.daily.time.map((date, index) => ({
        date,
        high: Math.round(weatherData.daily.temperature_2m_max[index]),
        low: Math.round(weatherData.daily.temperature_2m_min[index]),
        precipitationChance: weatherData.daily.precipitation_probability_max[index],
      }))
    };

    // store in cache
    weatherCache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error("Weather API error:", error.message);
    return null;
  }
}

/**
 * Clears the weather cache.
 */
function clearWeatherCache() {
  weatherCache.clear();
}

/**
 * Checks if a location's weather data is cached.
 */
function isWeatherCached(location) {
  if (!location) return false;
  return weatherCache.has(location.toLowerCase().trim());
}

module.exports = {
  fetchWeatherData,
  clearWeatherCache,
  isWeatherCached
};
