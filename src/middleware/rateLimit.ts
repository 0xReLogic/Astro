
import { Context, NextFunction } from "grammy";

interface RateLimitData {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<number, RateLimitData>();
const RATE_LIMIT = 10; // requests per minute
const WINDOW_MS = 60 * 1000; // 1 minute

export async function rateLimitMiddleware(ctx: Context, next: NextFunction) {
  const userId = ctx.from?.id;
  if (!userId) return next();

  const now = Date.now();
  const userData = rateLimitMap.get(userId);

  if (!userData || now > userData.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + WINDOW_MS });
    return next();
  }

  if (userData.count >= RATE_LIMIT) {
    return ctx.reply("Rate limit exceeded. Please wait a moment before sending another request.");
  }

  userData.count++;
  return next();
}
