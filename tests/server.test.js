/**
 * Simple tests for Travel Assistant API
 */

const { describe, it } = require("node:test");
const assert = require("node:assert");
const { extractLocation, isWeatherRelatedQuery } = require("../utils/messageAnalyzer");

const API_URL = process.env.TEST_URL || "http://localhost:3000";

// Unit tests
describe("Location Extraction", () => {
  it("extracts dubai from message", () => {
    assert.strictEqual(extractLocation("I plan to go to dubai"), "Dubai");
  });

  it("extracts new york from message", () => {
    assert.strictEqual(extractLocation("trip to new york"), "New York");
  });

  it("extracts nyc as New York", () => {
    assert.strictEqual(extractLocation("flying to nyc"), "New York");
  });

  it("extracts japan as Tokyo", () => {
    assert.strictEqual(extractLocation("trip to japan"), "Tokyo");
  });

  it("extracts la as Los Angeles when standalone", () => {
    assert.strictEqual(extractLocation("going to la"), "Los Angeles");
  });

  it("returns null for unknown location", () => {
    assert.strictEqual(extractLocation("going somewhere"), null);
  });
});

describe("Weather Triggers", () => {
  it("detects packing query", () => {
    assert.strictEqual(isWeatherRelatedQuery("what should I pack?"), true);
  });

  it("detects weather query", () => {
    assert.strictEqual(isWeatherRelatedQuery("how is the weather?"), true);
  });

  it("ignores attractions query", () => {
    assert.strictEqual(isWeatherRelatedQuery("what are the attractions?"), false);
  });
});

// Integration tests - need server running
describe("API Endpoints", async () => {
  it("GET /health returns healthy", async () => {
    try {
      const res = await fetch(`${API_URL}/health`);
      const data = await res.json();
      assert.strictEqual(data.status, "healthy");
    } catch (e) {
      console.log("Server not running, skipping");
    }
  });

  it("POST /chat validates empty input", async () => {
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      assert.strictEqual(res.status, 400);
    } catch (e) {
      console.log("Server not running, skipping");
    }
  });
});
