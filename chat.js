#!/usr/bin/env node

/**
 * Simple CLI for chatting with the travel assistant.
 */

const readline = require("readline");

const API_URL = process.env.API_URL || "http://localhost:3001";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("\nTravel Assistant");
console.log("Type your questions, or 'quit' to exit.\n");

async function chat(message) {
  try {
    const res = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    return data.reply || data.error;
  } catch (err) {
    return "Error: Could not connect to server. Is it running?";
  }
}

function prompt() {
  rl.question("You: ", async (input) => {
    const message = input.trim();

    if (!message) {
      prompt();
      return;
    }

    if (message.toLowerCase() === "quit") {
      console.log("\nGoodbye!\n");
      rl.close();
      return;
    }

    if (message.toLowerCase() === "reset") {
      await fetch(`${API_URL}/reset`, { method: "POST" });
      console.log("\n[Conversation reset]\n");
      prompt();
      return;
    }

    const reply = await chat(message);
    console.log(`\nAssistant: ${reply}\n`);
    prompt();
  });
}

prompt();
