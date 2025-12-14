# Basic Package

The `@ydtb/basic` package serves as a generic testing and development package for the YDTB CRM Toolkit. It provides:
- A sandbox for testing new concepts and features
- Example implementations that can be reused across the application
- A test bed for new UI components and patterns
- Environment variable integration examples

## Environment Variables

This package registers the following environment variables:

### Server-side
- `BASIC_API_URL` (required): Base URL for the basic API
- `BASIC_API_KEY` (optional): API key for authentication
- `BASIC_RETRY_ATTEMPTS` (optional, default: 3): Number of retry attempts (0-10)
- `BASIC_TIMEOUT_MS` (optional, default: 5000): Request timeout in milliseconds (min: 100)

### Client-side
- `NEXT_PUBLIC_BASIC_ENABLED` (optional, default: true): Enable/disable the package
- `NEXT_PUBLIC_BASIC_DEBUG` (optional, default: false): Enable debug logging
- `NEXT_PUBLIC_BASIC_VERSION` (optional, default: "1.0.0"): Package version

## Usage

```typescript
import { createBasicService } from "@ydtb/basic";
import { env } from "./env";

// Create the service instance
const basicService = createBasicService(env);

// Use the service
const status = basicService.getStatus();
const data = await basicService.fetchData("/endpoint");
```

## Testing

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Generate .env.example:**
   ```bash
   cd apps/core
   bun env:generate
   ```

3. **Validate environment:**
   ```bash
   # Create a .env file with required variables
   cat > .env << EOF
   DATABASE_URL=postgresql://postgres:password@localhost:5432/crm_toolkit
   BETTER_AUTH_SECRET=test-secret-key-that-is-at-least-32-characters-long
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   BASIC_API_URL=https://api.example.com
   EOF

   # Validate
   bun env:validate
   ```

## Current Implementation

### Environment Variables
The package registers its environment variables with the core application's environment registry system. This demonstrates how packages should declare their environment requirements in a monorepo setup.

### Basic API Service
A configurable service class (`BasicService`) that demonstrates:
- Environment variable usage
- API request handling with fetch
- Configurable retry logic and timeouts
- Debug mode for development
- Type-safe configuration

## Usage Example

```typescript
// In your app (environment is automatically registered by env.ts)
import { createBasicService } from "@ydtb/basic";
import { env } from "./env";

// Create the service instance
const basicService = createBasicService(env);

// Check if the service is configured
const status = basicService.getStatus();
console.log(status); // { enabled: true, version: "1.0.0", ... }

// Make an API call (will use environment configuration)
try {
  const data = await basicService.fetchData("/api/endpoint");
  console.log(data);
} catch (error) {
  console.error("API call failed:", error.message);
}

## Development

This package will continue to evolve as we add new features to the CRM Toolkit. It serves as:

1. **Test Ground**: New features are often prototyped here first
2. **Example Code**: Demonstrates best practices for other packages
3. **Component Library**: Reusable components and utilities
4. **Integration Tests**: Verifies that various parts of the system work together

## Testing

4. **Run the test script:**
   ```bash
   # From root directory
   bun test-basic-package.ts
   ```