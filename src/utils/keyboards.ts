import { InlineKeyboard } from "grammy";

export function createMainMenu() {
  return new InlineKeyboard()
    .text("Teks Kreatif", "generate_text")
    .text("Kutipan Harian", "daily_quote").row()
    .text("Lelucon", "joke")
    .text("Resep Masakan", "recipe").row()
    .text("Inspirasi", "inspire")
    .text("Asisten Menulis", "writer_assist").row()
    .text("Terjemahan", "translate")
    .text("Review Kode", "code_review").row()
    .text("Explain Kode", "explain_code")
    .text("Info Bot", "bot_info").row()
    .text("Statistik", "stats")
    .text("Bantuan", "help");
}

export function createLanguageMenu() {
  const keyboard = [
    [
      { text: "🇺🇸 English", callback_data: "translate_english" },
      { text: "🇯🇵 Japanese", callback_data: "translate_japanese" },
    ],
    [
      { text: "🇰🇷 Korean", callback_data: "translate_korean" },
      { text: "🇨🇳 Chinese", callback_data: "translate_chinese" },
    ],
    [
      { text: "🇪🇸 Spanish", callback_data: "translate_spanish" },
      { text: "🇫🇷 French", callback_data: "translate_french" },
    ],
    [
      { text: "🔙 Back to Menu", callback_data: "main_menu" },
    ],
  ];

  return { inline_keyboard: keyboard };
}