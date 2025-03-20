/**
 * Logging utility for Notion MCP Server
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = 'info';

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private isLevelEnabled(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };

    return levels[level] >= levels[this.logLevel];
  }

  private formatLog(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
  ): string {
    const logMsg: LogMessage = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    return JSON.stringify(logMsg);
  }

  public debug(message: string, context?: Record<string, any>): void {
    if (this.isLevelEnabled('debug')) {
      console.debug(this.formatLog('debug', message, context));
    }
  }

  public info(message: string, context?: Record<string, any>): void {
    if (this.isLevelEnabled('info')) {
      console.info(this.formatLog('info', message, context));
    }
  }

  public warn(message: string, context?: Record<string, any>): void {
    if (this.isLevelEnabled('warn')) {
      console.warn(this.formatLog('warn', message, context));
    }
  }

  public error(message: string, context?: Record<string, any>): void {
    if (this.isLevelEnabled('error')) {
      console.error(this.formatLog('error', message, context));
    }
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
