
interface UserSession {
  userId: number;
  username?: string;
  joinedAt: number;
  totalCommands: number;
  favoriteFeatures: { [key: string]: number };
  lastActiveAt: number;
}

interface BotMetrics {
  totalUsers: number;
  activeUsers: number;
  commandsToday: number;
  mostUsedFeatures: { [key: string]: number };
  averageResponseTime: number;
  errorRate: number;
}

export class AnalyticsService {
  private userSessions: Map<number, UserSession> = new Map();
  private commandCounts: Map<string, number> = new Map();
  private responseTimes: number[] = [];
  private errorCount: number = 0;
  private totalRequests: number = 0;

  trackUser(userId: number, username?: string): void {
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, {
        userId,
        username,
        joinedAt: Date.now(),
        totalCommands: 0,
        favoriteFeatures: {},
        lastActiveAt: Date.now()
      });
    } else {
      const session = this.userSessions.get(userId)!;
      session.lastActiveAt = Date.now();
    }
  }

  trackCommand(userId: number, command: string): void {
    const session = this.userSessions.get(userId);
    if (session) {
      session.totalCommands++;
      session.favoriteFeatures[command] = (session.favoriteFeatures[command] || 0) + 1;
    }
    
    this.commandCounts.set(command, (this.commandCounts.get(command) || 0) + 1);
  }

  trackResponseTime(responseTime: number): void {
    this.responseTimes.push(responseTime);
    // Keep only last 100 response times
    if (this.responseTimes.length > 100) {
      this.responseTimes.shift();
    }
  }

  trackError(): void {
    this.errorCount++;
  }

  trackRequest(): void {
    this.totalRequests++;
  }

  getMetrics(): BotMetrics {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    const activeUsers = Array.from(this.userSessions.values())
      .filter(session => session.lastActiveAt > oneDayAgo).length;
    
    const commandsToday = Array.from(this.userSessions.values())
      .reduce((total, session) => {
        return total + Object.values(session.favoriteFeatures)
          .reduce((sum, count) => sum + count, 0);
      }, 0);

    const mostUsedFeatures = Object.fromEntries(
      Array.from(this.commandCounts.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
    );

    const averageResponseTime = this.responseTimes.length > 0
      ? this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length
      : 0;

    const errorRate = this.totalRequests > 0
      ? (this.errorCount / this.totalRequests) * 100
      : 0;

    return {
      totalUsers: this.userSessions.size,
      activeUsers,
      commandsToday,
      mostUsedFeatures,
      averageResponseTime,
      errorRate
    };
  }

  getUserProfile(userId: number): UserSession | undefined {
    return this.userSessions.get(userId);
  }

  getTopUsers(limit: number = 10): UserSession[] {
    return Array.from(this.userSessions.values())
      .sort((a, b) => b.totalCommands - a.totalCommands)
      .slice(0, limit);
  }
}
