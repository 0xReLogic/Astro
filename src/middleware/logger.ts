
import { Context, NextFunction } from "grammy";

export async function loggerMiddleware(ctx: Context, next: NextFunction) {
  const start = Date.now();
  const username = ctx.from?.username || ctx.from?.first_name || "unknown";
  const chatType = ctx.chat?.type || "unknown";
  const command = ctx.message?.text?.split(" ")[0] || "callback_query";
  
  console.log(`[${new Date().toISOString()}] ${username} (${chatType}): ${command}`);
  
  await next();
  
  const duration = Date.now() - start;
  console.log(`[${new Date().toISOString()}] Request completed in ${duration}ms`);
}
