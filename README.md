# Crypto Report Telegram Bot

This Telegram bot provides daily cryptocurrency analytics at 9:00 AM, fetching the latest exchange rates and cryptocurrency prices. It uses the node-telegram-bot-api for Telegram bot interactions and axios for API requests.

## Features

- Daily reports at 9:00 AM based on the server's timezone.
- Fetches real-time cryptocurrency data from CoinGecko and exchange rates from ExchangeRate-API.
- Responsive to /start command to initialize and confirm user subscription.

## Prerequisites

- Node.js (Recommended version 14 or higher)
- npm (Node Package Manager)
- Telegram account and a bot token from BotFather

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ArtAnna01/crypto_bot.git
   cd crypto_bot
2. Install dependencies:
   ```bash
   npm install
3. Set up environment variables:   
Create a .env file in the root directory of your project and add the following line:
   ```bash
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   
## Usage

1. Start the bot:
   ```bash
   node cryptoBot.js
2. Interact with the bot:
   - Send /start to the bot in Telegram to initialize your chat ID and start receiving daily crypto reports.

## Scheduled Jobs

The bot uses node-schedule to send out reports every day at 9:00 AM. You can modify the schedule in the index.js file if a different time or frequency is required.

## APIs Used

- CoinGecko API: For fetching current cryptocurrency data.
- ExchangeRate-API: For fetching USD to RUB conversion rates.
