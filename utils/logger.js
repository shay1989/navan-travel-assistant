/**
 * Simple logger with debug flag.
 */

const DEBUG = process.env.DEBUG === "true";

function log(tag, message) {
  if (DEBUG) {
    console.log(`[${tag}] ${message}`);
  }
}

module.exports = { log };
