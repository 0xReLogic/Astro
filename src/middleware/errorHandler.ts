
import { Context } from "grammy";

export async function errorHandler(err: any, ctx: Context) {
  console.error(`Error in bot (${ctx.update.update_id}):`, err);
  
  const errorMessage = "Maaf, terjadi kesalahan internal. Tim kami telah diberitahu dan akan memperbaikinya segera.";
  
  try {
    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery({ text: "Terjadi kesalahan" });
      await ctx.reply(errorMessage);
    } else {
      await ctx.reply(errorMessage);
    }
  } catch (replyError) {
    console.error("Failed to send error message:", replyError);
  }
}
