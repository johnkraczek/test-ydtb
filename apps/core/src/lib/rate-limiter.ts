interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
}

export class EmailRateLimiter {
  private config: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 3,
  };

  private storage: Map<string, { count: number; resetTime: number }> = new Map();

  async canSendEmail(email: string): Promise<{ allowed: boolean; remaining?: number; resetTime?: Date }> {
    const now = Date.now();
    const key = email.toLowerCase();
    const record = this.storage.get(key);

    if (!record) {
      // No record found, allow sending
      return { allowed: true, remaining: this.config.maxAttempts - 1 };
    }

    if (now > record.resetTime) {
      // Window expired, reset counter
      this.storage.delete(key);
      return { allowed: true, remaining: this.config.maxAttempts - 1 };
    }

    if (record.count >= this.config.maxAttempts) {
      // Rate limit exceeded
      return {
        allowed: false,
        resetTime: new Date(record.resetTime)
      };
    }

    // Under the limit
    const remaining = this.config.maxAttempts - (record.count + 1);
    return { allowed: true, remaining };
  }

  async recordEmailSent(email: string): Promise<void> {
    const now = Date.now();
    const key = email.toLowerCase();
    const record = this.storage.get(key);

    if (!record || now > record.resetTime) {
      // New window
      this.storage.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
    } else {
      // Increment counter
      record.count++;
    }
  }

  // Clean up expired entries
  async cleanup(): Promise<void> {
    const now = Date.now();
    for (const [key, record] of this.storage.entries()) {
      if (now > record.resetTime) {
        this.storage.delete(key);
      }
    }
  }
}

// Export singleton instance
export const emailRateLimiter = new EmailRateLimiter();

// Clean up expired entries every 5 minutes
setInterval(() => {
  emailRateLimiter.cleanup();
}, 5 * 60 * 1000);