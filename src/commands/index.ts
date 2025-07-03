
import { Context } from "grammy";
import { GeminiService } from "../services/geminiService.js";
import { TranslatorService } from "../services/translatorService.js";
import { MultimodalService } from "../services/multimodalService.js";
import { RAGService } from "../services/ragService.js";
import { AnalyticsService } from "../services/analyticsService.js";
import { createMainMenu, createLanguageMenu } from "../utils/keyboards.js";

interface UsageStats {
  totalRequests: number;
  textGenerated: number;
  quotesGenerated: number;
  jokesGenerated: number;
  writerAssists: number;
  recipesGenerated: number;
  uptime: number;
}

export class CommandHandlers {
  private gemini: GeminiService;
  private translator: TranslatorService;
  private multimodal: MultimodalService;
  private rag: RAGService;
  private analytics: AnalyticsService;
  private stats: UsageStats;
  private ownerIds: number[];

  constructor(geminiApiKey: string, stats: UsageStats, ownerIds: number[] = []) {
    this.gemini = new GeminiService(geminiApiKey);
    this.translator = new TranslatorService(geminiApiKey);
    this.multimodal = new MultimodalService(geminiApiKey);
    this.rag = new RAGService(geminiApiKey);
    this.analytics = new AnalyticsService();
    this.stats = stats;
    this.ownerIds = ownerIds;
  }

  async handleStart(ctx: Context) {
    this.stats.totalRequests++;
    await ctx.reply(
      "Selamat datang di Bot AI Generatif v2.0!\n\n" +
      "Pilih fitur yang ingin Anda gunakan:",
      { reply_markup: createMainMenu() }
    );
  }

  async handleHelp(ctx: Context) {
    this.stats.totalRequests++;
    await ctx.reply(
      "Bantuan Bot AI Generatif:\n\n" +
      "/teks [prompt] - Membuat teks kreatif\n" +
      "/quotes - Kutipan inspiratif harian\n" +
      "/jokes - Lelucon lucu\n" +
      "/resep - Resep masakan random\n" +
      "/inspire - Quote motivasi\n" +
      "/writer [topik] - Asisten menulis\n" +
      "/info - Informasi bot\n" +
      "/stats - Statistik penggunaan\n\n" +
      "Atau gunakan menu interaktif dengan /start",
      { reply_markup: createMainMenu() }
    );
  }

  async handleText(ctx: Context) {
    const prompt = ctx.match as string;
    this.stats.totalRequests++;
    
    if (!prompt) {
      return ctx.reply("Silakan berikan prompt! Contoh: /teks cerita tentang robot");
    }

    await ctx.reply("Sedang menulis...");
    
    try {
      const generatedText = await this.gemini.generateCreativeText(prompt);
      this.stats.textGenerated++;
      await ctx.reply(`Hasil:\n\n${generatedText}`);
    } catch (error) {
      console.error("Error generating text:", error);
      throw error;
    }
  }

  async handleQuotes(ctx: Context) {
    this.stats.totalRequests++;
    await ctx.reply("Sedang mencari kutipan inspiratif...");
    
    try {
      const quote = await this.gemini.generateQuote();
      this.stats.quotesGenerated++;
      await ctx.reply(`Kutipan Hari Ini:\n\n${quote}`);
    } catch (error) {
      console.error("Error generating quote:", error);
      throw error;
    }
  }

  async handleJokes(ctx: Context) {
    this.stats.totalRequests++;
    await ctx.reply("Sedang menyiapkan lelucon...");
    
    try {
      const joke = await this.gemini.generateJoke();
      this.stats.jokesGenerated++;
      await ctx.reply(`Lelucon Hari Ini:\n\n${joke}`);
    } catch (error) {
      console.error("Error generating joke:", error);
      throw error;
    }
  }

  async handleRecipe(ctx: Context) {
    this.stats.totalRequests++;
    await ctx.reply("Sedang menyiapkan resep...");
    
    try {
      const recipe = await this.gemini.generateRecipe();
      this.stats.recipesGenerated++;
      await ctx.reply(`Resep Hari Ini:\n\n${recipe}`);
    } catch (error) {
      console.error("Error generating recipe:", error);
      throw error;
    }
  }

  async handleInspire(ctx: Context) {
    this.stats.totalRequests++;
    await ctx.reply("Sedang mencari inspirasi...");
    
    try {
      const inspiration = await this.gemini.generateContent(
        "Buatlah quote motivasi yang sangat inspiratif dan mendalam dalam bahasa Indonesia. Quote harus memberikan semangat dan energi positif."
      );
      await ctx.reply(`Inspirasi Hari Ini:\n\n${inspiration}`);
    } catch (error) {
      console.error("Error generating inspiration:", error);
      throw error;
    }
  }

  async handleWriter(ctx: Context) {
    const topic = ctx.match as string;
    this.stats.totalRequests++;
    
    if (!topic) {
      return ctx.reply("Silakan berikan topik! Contoh: /writer cara menulis artikel");
    }

    await ctx.reply("Sedang menyiapkan bantuan menulis...");
    
    try {
      const assistance = await this.gemini.generateWritingAssistance(topic);
      this.stats.writerAssists++;
      await ctx.reply(`Bantuan Menulis:\n\n${assistance}`);
    } catch (error) {
      console.error("Error generating writing assistance:", error);
      throw error;
    }
  }

  async handleInfo(ctx: Context) {
    this.stats.totalRequests++;
    await ctx.reply(
      "Bot AI Generatif v2.0\n\n" +
      "Teknologi:\n" +
      "- Bun.js untuk runtime\n" +
      "- grammY untuk Telegram API\n" +
      "- Gemini API untuk AI generatif\n" +
      "- TypeScript untuk development\n\n" +
      "Fitur:\n" +
      "- Rate limiting\n" +
      "- Error handling\n" +
      "- Request logging\n" +
      "- Session management\n\n" +
      "Source code: https://github.com/0xReLogic/telegram-ai-bot\n" +
      "Developer: 0xReLogic"
    );
  }

  async handleStats(ctx: Context) {
    this.stats.totalRequests++;
    const uptimeHours = Math.floor((Date.now() - this.stats.uptime) / (1000 * 60 * 60));
    await ctx.reply(
      "Statistik Bot:\n\n" +
      `Total permintaan: ${this.stats.totalRequests}\n` +
      `Teks kreatif: ${this.stats.textGenerated}\n` +
      `Kutipan: ${this.stats.quotesGenerated}\n` +
      `Lelucon: ${this.stats.jokesGenerated}\n` +
      `Resep: ${this.stats.recipesGenerated}\n` +
      `Bantuan menulis: ${this.stats.writerAssists}\n` +
      `Uptime: ${uptimeHours} jam\n\n` +
      `Status: Online dan berjalan`,
      { reply_markup: createMainMenu() }
    );
  }

  async handleDebug(ctx: Context) {
    const userId = ctx.from?.id;
    if (!userId || !this.ownerIds.includes(userId)) {
      return ctx.reply("Command ini hanya untuk owner bot.");
    }

    this.stats.totalRequests++;
    const memoryUsage = process.memoryUsage();
    await ctx.reply(
      "Debug Information:\n\n" +
      `User ID: ${userId}\n` +
      `Chat Type: ${ctx.chat?.type}\n` +
      `Memory Usage: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB\n` +
      `Uptime: ${Math.floor(process.uptime())}s\n` +
      `Node Version: ${process.version}\n` +
      `Platform: ${process.platform}`
    );
  }

  async handleTranslate(ctx: Context) {
    this.stats.totalRequests++;
    const text = ctx.message?.text?.replace("/translate", "").trim();
    
    if (!text) {
      return ctx.reply("Gunakan: /translate [teks yang ingin diterjemahkan]\n\nContoh: /translate Hello world");
    }
    
    await ctx.reply("Menerjemahkan...", { reply_markup: createLanguageMenu() });
  }

  async handleTranslateToLanguage(ctx: Context, targetLanguage: string) {
    const text = ctx.session?.lastTranslateText;
    if (!text) {
      return ctx.reply("Silakan kirim teks yang ingin diterjemahkan terlebih dahulu dengan /translate [teks]");
    }
    
    try {
      const translation = await this.translator.translateText(text, targetLanguage);
      await ctx.reply(`Terjemahan ke ${targetLanguage}:\n\n${translation}`);
    } catch (error) {
      console.error("Translation error:", error);
      throw error;
    }
  }

  async handleCodeReview(ctx: Context) {
    this.stats.totalRequests++;
    const code = ctx.message?.text?.replace("/review", "").trim();
    
    if (!code) {
      return ctx.reply("Kirim kode yang ingin direview:\n\n/review [kode Anda]");
    }
    
    await ctx.reply("Menganalisis kode...");
    
    try {
      const review = await this.gemini.generateCreativeText(
        `Lakukan code review untuk kode berikut. Berikan feedback konstruktif tentang: 1) Kualitas kode 2) Best practices 3) Potential bugs 4) Saran perbaikan. Kode: ${code}`
      );
      await ctx.reply(`Code Review:\n\n${review}`);
    } catch (error) {
      console.error("Code review error:", error);
      throw error;
    }
  }

  async handleExplainCode(ctx: Context) {
    this.stats.totalRequests++;
    const code = ctx.message?.text?.replace("/explain", "").trim();
    
    if (!code) {
      return ctx.reply("Kirim kode yang ingin dijelaskan:\n\n/explain [kode Anda]");
    }
    
    await ctx.reply("Menganalisis dan menjelaskan kode...");
    
    try {
      const explanation = await this.gemini.generateCreativeText(
        `Jelaskan kode berikut dengan detail: 1) Apa yang dilakukan kode ini 2) Bagaimana cara kerjanya 3) Konsep programming yang digunakan. Gunakan bahasa yang mudah dipahami. Kode: ${code}`
      );
      await ctx.reply(`Penjelasan Kode:\n\n${explanation}`);
    } catch (error) {
      console.error("Code explanation error:", error);
      throw error;
    }
  }

  async handleVoiceMessage(ctx: Context) {
    const voice = ctx.message?.voice;
    if (!voice) return;

    this.stats.totalRequests++;
    await ctx.reply("Memproses pesan suara...");

    try {
      // Get file from Telegram
      const file = await ctx.api.getFile(voice.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      
      const response = await fetch(fileUrl);
      const audioBuffer = Buffer.from(await response.arrayBuffer());
      
      // Convert voice to text
      const transcription = await this.multimodal.processVoiceMessage(audioBuffer);
      
      // Generate creative response
      const generatedText = await this.gemini.generateCreativeText(transcription);
      
      await ctx.reply(`Transkripsi: "${transcription}"\n\nHasil:\n\n${generatedText}`);
    } catch (error) {
      console.error("Error processing voice:", error);
      await ctx.reply("Maaf, gagal memproses pesan suara. Silakan coba lagi.");
    }
  }

  async handleImageMessage(ctx: Context) {
    const photo = ctx.message?.photo;
    if (!photo) return;

    this.stats.totalRequests++;
    await ctx.reply("Menganalisis gambar...");

    try {
      // Get the largest photo
      const largestPhoto = photo[photo.length - 1];
      const file = await ctx.api.getFile(largestPhoto.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;
      
      const response = await fetch(fileUrl);
      const imageBuffer = Buffer.from(await response.arrayBuffer());
      
      // Analyze image
      const analysis = await this.multimodal.analyzeImage(imageBuffer, "image/jpeg");
      
      await ctx.reply(`Analisis Gambar:\n\n${analysis}`);
    } catch (error) {
      console.error("Error analyzing image:", error);
      await ctx.reply("Maaf, gagal menganalisis gambar. Silakan coba lagi.");
    }
  }

  async handleWebSearch(ctx: Context) {
    const query = ctx.match as string;
    this.stats.totalRequests++;
    
    if (!query) {
      return ctx.reply("Silakan berikan query pencarian! Contoh: /search teknologi AI terbaru");
    }

    await ctx.reply("Mencari informasi...");
    
    try {
      const enhancedResponse = await this.rag.enhanceWithWebContext(query);
      await ctx.reply(`Hasil Pencarian:\n\n${enhancedResponse}`);
    } catch (error) {
      console.error("Error web search:", error);
      throw error;
    }
  }

  async handleWeather(ctx: Context) {
    const location = ctx.match as string;
    this.stats.totalRequests++;
    
    if (!location) {
      return ctx.reply("Silakan berikan lokasi! Contoh: /weather Jakarta");
    }

    await ctx.reply("Mengambil informasi cuaca...");
    
    try {
      const weatherInfo = await this.rag.getWeatherInfo(location);
      await ctx.reply(weatherInfo);
    } catch (error) {
      console.error("Error getting weather:", error);
      throw error;
    }
  }

  async handleAnalytics(ctx: Context) {
    const userId = ctx.from?.id;
    if (!userId || !this.ownerIds.includes(userId)) {
      return ctx.reply("Command ini hanya untuk owner bot.");
    }

    this.stats.totalRequests++;
    const metrics = this.analytics.getMetrics();
    
    await ctx.reply(
      `Analytics Dashboard:\n\n` +
      `Total Users: ${metrics.totalUsers}\n` +
      `Active Users (24h): ${metrics.activeUsers}\n` +
      `Commands Today: ${metrics.commandsToday}\n` +
      `Avg Response Time: ${metrics.averageResponseTime.toFixed(0)}ms\n` +
      `Error Rate: ${metrics.errorRate.toFixed(2)}%\n\n` +
      `Most Used Features:\n` +
      Object.entries(metrics.mostUsedFeatures)
        .map(([feature, count]) => `- ${feature}: ${count}`)
        .join('\n')
    );
  }

  async handleRegularMessage(ctx: Context) {
    const text = ctx.message?.text;
    if (!text || text.startsWith("/")) return;
    
    this.stats.totalRequests++;
    this.analytics.trackUser(ctx.from?.id || 0, ctx.from?.username);
    this.analytics.trackCommand(ctx.from?.id || 0, "regular_message");
    
    await ctx.reply("Membuat sesuatu yang kreatif...");
    
    try {
      const startTime = Date.now();
      const generatedText = await this.gemini.generateCreativeText(text);
      const responseTime = Date.now() - startTime;
      
      this.analytics.trackResponseTime(responseTime);
      this.stats.textGenerated++;
      await ctx.reply(`Hasil:\n\n${generatedText}`);
    } catch (error) {
      this.analytics.trackError();
      console.error("Error generating text:", error);
      throw error;
    }
  }
}
