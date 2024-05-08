require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const schedule = require("node-schedule");

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

let chatId;

async function getExchangeRate() {
  try {
    const response = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    const rates = response.data.rates;
    const usdToRub = rates.RUB;
    return usdToRub;
  } catch (error) {
    console.error("Error fetching exchange rate: ", error);
    return null;
  }
}

async function getCryptoReport() {
  try {
    const exchangeRate = await getExchangeRate();
    if (!exchangeRate) {
      throw new Error("Failed to fetch exchange rate");
    }
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,zenfuse,the-open-network&vs_currencies=usd,rub&price_change_percentage=24h,7d";
    const response = await axios.get(url);
    const report = response.data
      .map((coin) => {
        const usdPrice = coin.current_price?.toFixed(2) || "N/A";
        const rubPrice = exchangeRate
          ? (coin.current_price * exchangeRate).toFixed(2)
          : "N/A";
        const change24h =
          coin["price_change_percentage_24h_in_currency"]?.toFixed(2) || "N/A";
        const change7d =
          coin["price_change_percentage_7d_in_currency"]?.toFixed(2) || "N/A";
        return `${coin.name} - USD ${usdPrice} | RUB ${rubPrice} | ${change24h}% (24hr) ${change7d}% (7d)`;
      })
      .join("\n");
    return `Инфа по крипте:\n${report}`;
  } catch (error) {
    console.error("Error during API call: ", error.response || error.message);
    return "Error fetching data.";
  }
}

bot.on("message", (msg) => {
  chatId = msg.chat.id;
  console.log("Chat ID set to:", chatId);
});

function sendCryptoReport() {
  if (chatId) {
    getCryptoReport()
      .then((report) => {
        bot.sendMessage(chatId, report);
      })
      .catch((error) => {
        console.error("Failed to send crypto report:", error);
      });
  } else {
    console.log("Chat ID not set. Please message the bot to initialize.");
  }
}

bot.onText(/\/start/, (msg) => {
  chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Welcome! You will now receive crypto reports daily at 9:00 AM."
  );
});

schedule.scheduleJob("0 9 * * *", () => {
  sendCryptoReport();
});
