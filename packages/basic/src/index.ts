import { z } from "zod";

// This will be imported by the core app to register the env vars
export function registerEnvironment(envRegistry: any) {
  envRegistry.register("basic", {
    server: {
      BASIC_API_URL: z.string().url().describe("Base URL for the basic API"),
      BASIC_API_KEY: z.string().min(1).optional().describe("API key for the basic service"),
      BASIC_RETRY_ATTEMPTS: z.coerce.number().int().min(0).max(10).default(3).describe("Number of retry attempts"),
      BASIC_TIMEOUT_MS: z.coerce.number().int().min(100).default(5000).describe("Request timeout in milliseconds"),
    },
    client: {
      NEXT_PUBLIC_BASIC_ENABLED: z.coerce.boolean().default(true).describe("Enable the basic module"),
      NEXT_PUBLIC_BASIC_DEBUG: z.coerce.boolean().default(false).describe("Enable debug mode"),
      NEXT_PUBLIC_BASIC_VERSION: z.string().default("1.0.0").describe("Version of the basic module"),
    },
  });
}

// Basic service implementation that uses environment variables
export class BasicService {
  private apiUrl: string;
  private apiKey?: string;
  private retryAttempts: number;
  private timeoutMs: number;
  private enabled: boolean;
  private debug: boolean;
  private version: string;

  constructor(env: any) {
    // These will be validated by the environment system
    this.apiUrl = env.BASIC_API_URL;
    this.apiKey = env.BASIC_API_KEY;
    this.retryAttempts = env.BASIC_RETRY_ATTEMPTS;
    this.timeoutMs = env.BASIC_TIMEOUT_MS;
    this.enabled = env.NEXT_PUBLIC_BASIC_ENABLED;
    this.debug = env.NEXT_PUBLIC_BASIC_DEBUG;
    this.version = env.NEXT_PUBLIC_BASIC_VERSION;

    if (this.debug) {
      console.log(`[Basic Service] Initialized with:
  - API URL: ${this.apiUrl}
  - Has API Key: ${!!this.apiKey}
  - Retry Attempts: ${this.retryAttempts}
  - Timeout: ${this.timeoutMs}ms
  - Enabled: ${this.enabled}
  - Version: ${this.version}`);
    }
  }

  async fetchData(endpoint: string): Promise<any> {
    if (!this.enabled) {
      throw new Error("Basic service is disabled");
    }

    const url = `${this.apiUrl}${endpoint}`;

    if (this.debug) {
      console.log(`[Basic Service] Fetching from: ${url}`);
    }

    // Simulate API call with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...(this.apiKey && { "Authorization": `Bearer ${this.apiKey}` }),
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error(`Request timed out after ${this.timeoutMs}ms`);
        }
        throw error;
      }

      throw new Error("Unknown error occurred");
    }
  }

  getStatus() {
    return {
      enabled: this.enabled,
      version: this.version,
      configured: !!this.apiUrl,
      hasApiKey: !!this.apiKey,
    };
  }
}

// Export a factory function that creates the service with environment
export function createBasicService(env: any) {
  return new BasicService(env);
}