import { Bot, Context, webhookCallback, session } from "grammy";
import { loggerMiddleware } from "./src/middleware/logger.js";
import { rateLimitMiddleware } from "./src/middleware/rateLimit.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { CommandHandlers } from "./src/commands/index.js";
import { createMainMenu } from "./src/utils/keyboards.js";

// Environment variables
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const WEBHOOK_URL = process.env.WEBHOOK_URL || "";
const OWNER_IDS = process.env.OWNER_IDS?.split(",").map(id => parseInt(id)) || [];

if (!BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}

// Initialize bot with session support
const bot = new Bot(BOT_TOKEN);

// Session configuration
bot.use(session({
  initial: () => ({ 
    lastPrompt: "",
    requestCount: 0,
    joinedAt: Date.now()
  })
}));

// Middleware
bot.use(loggerMiddleware);
bot.use(rateLimitMiddleware);

// Set bot commands for menu
bot.api.setMyCommands([
  { command: "start", description: "Mulai menggunakan bot" },
  { command: "help", description: "Menampilkan bantuan" },
  { command: "teks", description: "Membuat teks kreatif" },
  { command: "quotes", description: "Kutipan inspiratif harian" },
  { command: "jokes", description: "Lelucon lucu" },
  { command: "resep", description: "Resep masakan random" },
  { command: "inspire", description: "Quote motivasi" },
  { command: "writer", description: "Asisten menulis" },
  { command: "translate", description: "Terjemahkan teks" },
  { command: "review", description: "Review kode programming" },
  { command: "explain", description: "Jelaskan kode programming" },
  { command: "search", description: "Cari informasi web" },
  { command: "weather", description: "Info cuaca" },
  { command: "info", description: "Informasi bot" },
  { command: "stats", description: "Statistik penggunaan" },
  { command: "analytics", description: "Analytics dashboard (owner)" },
  { command: "debug", description: "Debug info (owner only)" }
]);

// Usage statistics
let usageStats = {
  totalRequests: 0,
  textGenerated: 0,
  quotesGenerated: 0,
  jokesGenerated: 0,
  writerAssists: 0,
  recipesGenerated: 0,
  uptime: Date.now()
};

// Initialize command handlers
const commandHandlers = new CommandHandlers(GEMINI_API_KEY, usageStats, OWNER_IDS);

// Command handlers
bot.command("start", (ctx) => commandHandlers.handleStart(ctx));
bot.command("help", (ctx) => commandHandlers.handleHelp(ctx));
bot.command("teks", (ctx) => commandHandlers.handleText(ctx));
bot.command("quotes", (ctx) => commandHandlers.handleQuotes(ctx));
bot.command("jokes", (ctx) => commandHandlers.handleJokes(ctx));
bot.command("resep", (ctx) => commandHandlers.handleRecipe(ctx));
bot.command("inspire", (ctx) => commandHandlers.handleInspire(ctx));
bot.command("writer", (ctx) => commandHandlers.handleWriter(ctx));
bot.command("info", (ctx) => commandHandlers.handleInfo(ctx));
bot.command("stats", (ctx) => commandHandlers.handleStats(ctx));
bot.command("translate", (ctx) => commandHandlers.handleTranslate(ctx));
bot.command("review", (ctx) => commandHandlers.handleCodeReview(ctx));
bot.command("explain", (ctx) => commandHandlers.handleExplainCode(ctx));
bot.command("debug", (ctx) => commandHandlers.handleDebug(ctx));
bot.command("search", (ctx) => commandHandlers.handleWebSearch(ctx));
bot.command("weather", (ctx) => commandHandlers.handleWeather(ctx));
bot.command("analytics", (ctx) => commandHandlers.handleAnalytics(ctx));

// Handle different message types
bot.on("message:voice", (ctx) => commandHandlers.handleVoiceMessage(ctx));
bot.on("message:photo", (ctx) => commandHandlers.handleImageMessage(ctx));

// Callback query handlers for inline keyboard
bot.callbackQuery("generate_text", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Silakan kirim prompt Anda untuk membuat teks kreatif!\n\nContoh: \"Cerita tentang kucing astronot\"");
});

bot.callbackQuery("daily_quote", async (ctx) => {
  await ctx.answerCallbackQuery();
  await commandHandlers.handleQuotes(ctx);
});

bot.callbackQuery("joke", async (ctx) => {
  await ctx.answerCallbackQuery();
  await commandHandlers.handleJokes(ctx);
});

bot.callbackQuery("recipe", async (ctx) => {
  await ctx.answerCallbackQuery();
  await commandHandlers.handleRecipe(ctx);
});

bot.callbackQuery("inspire", async (ctx) => {
  await ctx.answerCallbackQuery();
  await commandHandlers.handleInspire(ctx);
});

bot.callbackQuery("writer_assist", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Silakan kirim topik yang ingin Anda tulis!\n\nContoh: \"Cara menulis artikel yang menarik\"");
});

bot.callbackQuery("bot_info", async (ctx) => {
  await ctx.answerCallbackQuery();
  await commandHandlers.handleInfo(ctx);
});

bot.callbackQuery("stats", async (ctx) => {
  await ctx.answerCallbackQuery();
  await commandHandlers.handleStats(ctx);
});

bot.callbackQuery("translate", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Silakan kirim teks yang ingin diterjemahkan!\n\nContoh: \"Hello world\" atau gunakan /translate [teks]");
});

bot.callbackQuery("code_review", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Silakan kirim kode yang ingin direview!\n\nContoh: /review [kode Anda]");
});

bot.callbackQuery("explain_code", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Silakan kirim kode yang ingin dijelaskan!\n\nContoh: /explain [kode Anda]");
});

bot.callbackQuery("help", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    "Bantuan Bot AI Generatif:\n\n" +
    "Gunakan menu interaktif atau ketik:\n" +
    "/teks [prompt] - Teks kreatif\n" +
    "/quotes - Kutipan harian\n" +
    "/jokes - Lelucon\n" +
    "/resep - Resep masakan\n" +
    "/inspire - Quote motivasi\n" +
    "/writer [topik] - Bantuan menulis\n" +
    "/translate [teks] - Terjemahan\n" +
    "/review [kode] - Review kode\n" +
    "/explain [kode] - Explain kode\n\n" +
    "Kirim pesan langsung untuk teks kreatif",
    { reply_markup: createMainMenu() }
  );
});

// Handle regular messages as text generation
bot.on("message:text", (ctx) => commandHandlers.handleRegularMessage(ctx));

// Error handling
bot.catch(errorHandler);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Bot stopping...');
  bot.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Bot stopping...');
  bot.stop();
  process.exit(0);
});

// Start server
const server = Bun.serve({
  port: 3000,
  hostname: "0.0.0.0",
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/webhook" && request.method === "POST") {
      const webhookHandler = webhookCallback(bot, "std/http");
      return webhookHandler(request);
    }

    if (url.pathname === "/") {
      return new Response(JSON.stringify({
        status: "Bot Telegram AI Generatif v2.0 aktif",
        uptime: Math.floor((Date.now() - usageStats.uptime) / 1000),
        stats: usageStats,
        features: ["rate_limiting", "error_handling", "session_management", "modular_architecture"]
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (url.pathname === "/health") {
      return new Response("OK", { status: 200 });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server berjalan di http://0.0.0.0:${server.port}`);
console.log("Bot Telegram siap menerima pesan!");

// Start bot in development mode (polling)
if (process.env.NODE_ENV !== "production") {
  bot.start();
  console.log("Bot berjalan dalam mode polling untuk development");
}