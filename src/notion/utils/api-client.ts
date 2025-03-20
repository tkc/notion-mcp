/**
 * Base API client with error handling, retries, and rate limiting
 */
import { logger } from './logger';
import { rateLimiter } from './rate-limiter';

export interface ApiRequestOptions {
  method: string;
  path: string;
  body?: any;
  query?: Record<string, string>;
  maxRetries?: number;
  retryDelay?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    status?: number;
  };
}

export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private timeout: number;

  constructor(
    baseUrl: string,
    headers: Record<string, string>,
    timeout: number = 30000, // Default timeout value
  ) {
    this.baseUrl = baseUrl;
    this.headers = headers;
    this.timeout = timeout;
  }

  /**
   * Send API request with retry and rate limiting
   */
  public async request<T = any>(
    options: ApiRequestOptions,
  ): Promise<ApiResponse<T>> {
    const {
      method,
      path,
      body,
      query,
      maxRetries = 3,
      retryDelay = 1000,
    } = options;

    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts <= maxRetries) {
      try {
        // Wait for rate limiter
        await rateLimiter.acquire();

        // Build URL with query parameters
        let url = `${this.baseUrl}${path}`;
        if (query && Object.keys(query).length > 0) {
          const params = new URLSearchParams();
          Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              params.append(key, value);
            }
          });
          url = `${url}?${params.toString()}`;
        }

        // Prepare request
        const requestOptions: RequestInit = {
          method,
          headers: this.headers,
          signal: AbortSignal.timeout(this.timeout),
        };

        if (body) {
          requestOptions.body = JSON.stringify(body);
        }

        // Log request (without sensitive data)
        logger.debug('API request', {
          method,
          path,
          hasBody: !!body,
          attempt: attempts + 1,
        });

        // Send request
        const startTime = Date.now();
        const response = await fetch(url, requestOptions);
        const requestTime = Date.now() - startTime;

        // Parse response
        const responseData = await response.json();

        // Log response time
        logger.debug('API response received', {
          method,
          path,
          status: response.status,
          time: `${requestTime}ms`,
        });

        // Handle error responses
        if (!response.ok) {
          const error = new Error(
            `API Error: ${response.status} ${responseData.message || response.statusText}`,
          );
          Object.assign(error, { status: response.status, data: responseData });
          throw error;
        }

        // Return successful response
        return {
          success: true,
          data: responseData as T,
        };
      } catch (error) {
        lastError = error as Error;
        attempts += 1;

        // Log the error
        logger.warn(
          `API request failed (attempt ${attempts}/${maxRetries + 1})`,
          {
            method,
            path,
            error: error instanceof Error ? error.message : String(error),
            status: (error as any).status,
          },
        );

        // Check if we should retry
        if (attempts <= maxRetries) {
          // Exponential backoff with jitter
          const delay =
            retryDelay *
            Math.pow(2, attempts - 1) *
            (0.5 + Math.random() * 0.5);
          logger.debug(`Retrying in ${Math.round(delay)}ms`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // All attempts failed
    return {
      success: false,
      error: {
        code: 'request_failed',
        message: lastError?.message || 'Request failed after multiple attempts',
        status: (lastError as any)?.status,
      },
    };
  }
}
