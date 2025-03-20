/**
 * Rate limiter for Notion API requests
 */
import { logger } from './logger';

export class RateLimiter {
  private static instance: RateLimiter;
  private queue: Array<{
    resolve: () => void;
    timestamp: number;
  }> = [];
  private maxRequests: number;
  private windowMs: number;
  private requestTimestamps: number[] = [];

  private constructor() {
    // Default values for rate limiting
    this.maxRequests = 3; // Max 3 requests
    this.windowMs = 1000; // Per 1 second (1000ms)

    logger.debug('RateLimiter initialized', {
      maxRequests: this.maxRequests,
      windowMs: this.windowMs,
    });
  }

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  private cleanOldTimestamps(): void {
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter(
      (timestamp) => now - timestamp < this.windowMs,
    );
  }

  /**
   * Check if we can make a request right now
   * @returns true if request can be made, false if rate limited
   */
  private canMakeRequest(): boolean {
    this.cleanOldTimestamps();
    return this.requestTimestamps.length < this.maxRequests;
  }

  /**
   * Process the next item in the queue if possible
   */
  private processQueue(): void {
    if (this.queue.length === 0) return;

    if (this.canMakeRequest()) {
      const now = Date.now();
      const item = this.queue.shift();
      if (item) {
        // Check if this item has been waiting too long and log it
        const waitTime = now - item.timestamp;
        if (waitTime > 1000) {
          logger.warn(`Request waited ${waitTime}ms due to rate limiting`);
        }

        this.requestTimestamps.push(now);
        item.resolve();
      }
    }

    // Schedule next queue processing
    setTimeout(() => this.processQueue(), 50);
  }

  /**
   * Wait for permission to make a request
   * @returns Promise that resolves when request can be made
   */
  public async acquire(): Promise<void> {
    if (this.canMakeRequest()) {
      this.requestTimestamps.push(Date.now());
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.queue.push({
        resolve,
        timestamp: Date.now(),
      });

      // Start queue processing if this is the first item
      if (this.queue.length === 1) {
        this.processQueue();
      }
    });
  }

  /**
   * Update rate limit configuration
   */
  public updateConfig(maxRequests: number, windowMs: number): void {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    logger.info('RateLimiter configuration updated', { maxRequests, windowMs });
  }
}

// Export singleton instance
export const rateLimiter = RateLimiter.getInstance();
