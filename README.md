# Travel Assistant

A conversational travel planning assistant. Home Assignemt

## Installation

```bash
npm install
```

## Run Server

```bash
PORT=3001 npm start
```

## Run Chat

```bash
API_URL=http://localhost:3001 npm run chat
```

## Example Conversation
#### first I ask for the location, then add a trigger for weather

```
Travel Assistant
Type your questions, or 'quit' to exit.

You: What are the best attractions to visit in Tokyo?

Assistant: Tokyo has incredible attractions! To give you the best recommendations, I'd love to know:

1. **What interests you most?** (temples/culture, modern attractions, food scene, shopping, nightlife, etc.)
2. **How long will you be visiting?** This helps me prioritize the must-sees vs. hidden gems.

That said, here are some top attractions that appeal to most visitors:

**Cultural & Traditional:**
- Senso-ji Temple (Asakusa) - Tokyo's oldest temple with great street food nearby
- Meiji Shrine - peaceful shrine in the heart of the city
- Imperial Palace East Gardens - beautiful traditional gardens

**Modern & Unique:**
- Shibuya Crossing & Hachiko Statue - the famous "scramble" intersection
- Tokyo Skytree or Tokyo Tower - amazing city views
- Harajuku - youth culture and quirky fashion
- Akihabara - electronics and anime culture

**Food & Markets:**
- Tsukiji Outer Market - incredible street food and fresh seafood
- Memory Lane (Omoide Yokocho) - tiny bars and yakitori stalls

**Day Trips:**
- Nikko - temples and nature (2 hours from Tokyo)
- Kamakura - the Great Buddha statue (1 hour south)

What catches your eye most? I can dive deeper into specific areas!

You: What should I pack for the trip next week?

Assistant: Perfect timing! I'm looking at current Tokyo weather data, and you'll be visiting during winter with quite chilly temperatures.

**Based on the live weather (currently 1°C):**

**Essential Layers:**
- **Warm winter coat** - temperatures range from 0-14°C (32-57°F) next week
- **Thermal underwear/base layers** - especially for those 0-4°C nights
- **Sweaters or fleece** for layering
- **Warm pants** - jeans with thermals underneath or insulated pants

**Accessories:**
- **Gloves, scarf, and warm hat** - essential with current temps at 1°C
- **Warm socks** and comfortable waterproof boots
- **Light rain layer** - there's a 16% chance of precipitation on Jan 1st

**Smart Packing Tips:**
- **Layers are key** - you can adjust as you move between heated buildings and cold streets
- **Comfortable walking shoes** with good grip (Tokyo sidewalks can be slippery when cold)
- **Hand warmers** - cheap to buy locally and very helpful

**Don't Forget:**
- Moisturizer (68% humidity isn't too bad, but heating systems can be drying)
- Power adapter for Japan (Type A/B plugs)

The good news is no major precipitation expected, so you won't need heavy rain gear! Are you planning mostly outdoor sightseeing or a mix of indoor/outdoor activities?
```
