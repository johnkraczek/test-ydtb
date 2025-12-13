# Code Quality Standards

## TypeScript Standards

### Strict Configuration
We maintain **100% strict TypeScript** with the following requirements:

#### Compiler Options
```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "noImplicitOverride": true
}
```

#### Type Safety Rules
- **No `any` Types**: Use proper types instead
- **Explicit Returns**: All functions must have explicit return types
- **Complete Coverage**: 100% type coverage for new code
- **Interface over Type**: Prefer interfaces for object shapes
- **Readonly Properties**: Use `readonly` for immutable data

#### Type Definitions
```typescript
// ✅ Good: Explicit interface with readonly properties
interface UserProfile {
  readonly id: string;
  readonly email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

// ❌ Bad: Using any, missing readonly
interface UserProfile {
  id: any;
  email: any;
  firstName: string;
  lastName: string;
}
```

### Advanced TypeScript Patterns

#### Utility Types
```typescript
// Common utility types for our project
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

#### Discriminated Unions
```typescript
// API response types
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

// Component props with variants
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

## Code Organization Standards

### File Naming Conventions
```
components/
├── ui/                    # shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   └── card.tsx
├── features/              # Feature-specific components
│   ├── auth/
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   └── auth-guard.tsx
│   └── user-profile/
│       ├── profile-header.tsx
│       └── profile-edit.tsx
└── layouts/               # Layout components
    ├── app-layout.tsx
    └── auth-layout.tsx

hooks/
├── use-auth.ts
├── use-user-data.ts
└── use-local-storage.ts

lib/
├── utils.ts              # General utilities
├── constants.ts          # Application constants
├── types.ts              # Shared type definitions
└── validations.ts        # Zod schemas
```

### Import Organization
```typescript
// 1. React imports
import { useState, useEffect } from 'react';
import type { NextPage } from 'next';

// 2. Third-party libraries
import { z } from 'zod';
import { clsx } from 'clsx';

// 3. Internal imports (absolute paths)
import { Button } from '~/components/ui/button';
import { useAuth } from '~/hooks/use-auth';
import { api } from '~/lib/api';
import { formatDate } from '~/lib/utils';

// 4. Relative imports (for co-located files)
import { LocalComponent } from './local-component';
import type { LocalType } from './types';
```

### Component Structure Standards

#### Component Template
```typescript
import { useState, useCallback, useMemo } from 'react';
import type { ComponentProps } from 'react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';

// Props interface with explicit types
interface CustomButtonProps extends ComponentProps<typeof Button> {
  loading?: boolean;
  onClick?: () => void | Promise<void>;
}

// Component implementation
export function CustomButton({
  children,
  loading = false,
  onClick,
  className,
  ...props
}: CustomButtonProps) {
  // Hooks at the top
  const [isClicked, setIsClicked] = useState(false);

  // Memoized values
  const isDisabled = useMemo(() => {
    return loading || props.disabled;
  }, [loading, props.disabled]);

  // Event handlers
  const handleClick = useCallback(async () => {
    if (isDisabled || !onClick) return;

    setIsClicked(true);
    try {
      await onClick();
    } finally {
      setIsClicked(false);
    }
  }, [isDisabled, onClick]);

  // Render
  return (
    <Button
      className={cn(
        'transition-all duration-200',
        isClicked && 'scale-95',
        className
      )}
      disabled={isDisabled}
      onClick={handleClick}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
}
```

## Testing Standards

### Unit Testing Requirements
- **Coverage**: 80%+ line coverage for critical paths
- **Framework**: Vitest with Testing Library
- **Assertion Library**: Vitest built-in assertions
- **Mocking**: MSW for API mocking, vi.fn() for function mocking

#### Test File Template
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CustomButton } from './custom-button';

describe('CustomButton', () => {
  const defaultProps = {
    children: 'Click me',
  };

  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  it('renders correctly with default props', () => {
    render(<CustomButton {...defaultProps} />);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it('handles click events correctly', async () => {
    const handleClick = vi.fn();
    render(
      <CustomButton {...defaultProps} onClick={handleClick} />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  it('shows loading state correctly', () => {
    render(<CustomButton {...defaultProps} loading />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Loading...');
  });

  it('applies custom className correctly', () => {
    render(
      <CustomButton {...defaultProps} className="custom-class" />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
```

### Integration Testing
```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProfile } from './user-profile';

describe('UserProfile Integration', () => {
  let queryClient: QueryClient;

  beforeAll(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  afterAll(() => {
    queryClient.clear();
  });

  it('loads and displays user profile data', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UserProfile userId="123" />
      </QueryClientProvider>
    );

    expect(screen.getByText('Loading profile...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

## Performance Standards

### React Performance
- **React.memo**: Use for expensive components
- **useMemo**: Memoize expensive calculations
- **useCallback**: Memoize event handlers
- **Code Splitting**: Lazy load heavy components

#### Performance Patterns
```typescript
// Expensive component with memoization
export const ExpensiveComponent = React.memo(function ExpensiveComponent({
  data,
  onItemClick,
}: ExpensiveComponentProps) {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: expensiveCalculation(item),
    }));
  }, [data]);

  const handleClick = useCallback((id: string) => {
    onItemClick(id);
  }, [onItemClick]);

  return (
    <div>
      {processedData.map(item => (
        <Item
          key={item.id}
          item={item}
          onClick={handleClick}
        />
      ))}
    </div>
  );
});
```

### Bundle Optimization
- **Tree Shaking**: Ensure unused code is eliminated
- **Dynamic Imports**: Lazy load non-critical code
- **Image Optimization**: Use Next.js Image component
- **Font Optimization**: Use font-display: swap

## Security Standards

### Input Validation
```typescript
// Zod schemas for validation
const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
});

type CreateUserInput = z.infer<typeof CreateUserSchema>;
```

### API Security
```typescript
// Secure API route handler
export async function POST(request: Request) {
  try {
    // Validate input
    const body = await request.json();
    const validatedData = CreateUserSchema.parse(body);

    // Process data
    const result = await createUserService(validatedData);

    return Response.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: error.errors
          }
        },
        { status: 400 }
      );
    }

    // Log server errors, don't expose details
    console.error('API Error:', error);
    return Response.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred'
        }
      },
      { status: 500 }
    );
  }
}
```

## Server Action Standards

### Server Action Structure
All server actions must follow these patterns:

#### File Organization
```typescript
// src/actions/users/queries.ts
"use server";

import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import type { User } from "./types";

// Cached query with revalidation
export const getCachedUser = unstable_cache(
  async (id: string) => {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  },
  ["user"],
  {
    revalidate: 3600, // 1 hour
    tags: ["user"],
  }
);

// Direct query (no caching)
export async function getUserByEmail(email: string): Promise<User[]> {
  return db.select().from(users).where(eq(users.email, email));
}
```

```typescript
// src/actions/users/mutations.ts
"use server";

import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import type { CreateUserInput, UpdateUserInput } from "./types";

export async function createUser(data: CreateUserInput): Promise<User> {
  try {
    const [user] = await db.insert(users).values(data).returning();

    // Revalidate related pages
    revalidatePath("/admin/users");

    return user;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw new Error("Failed to create user");
  }
}

export async function updateUser(id: string, data: UpdateUserInput): Promise<User> {
  try {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    // Selective revalidation
    revalidatePath(`/admin/users/${id}`);
    revalidatePath("/admin/users");
    revalidateTag("user");
    revalidateTag(`user-${id}`);

    return user;
  } catch (error) {
    console.error(`Failed to update user ${id}:`, error);
    throw new Error("Failed to update user");
  }
}
```

### Server Action Testing
```typescript
// src/actions/users/queries.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserById, getCachedUser } from "./queries";

// Mock database
vi.mock("~/server/db", () => ({
  db: {
    select: vi.fn(),
  },
}));

// Mock schema
vi.mock("~/server/db/schema", () => ({
  users: {},
  eq: vi.fn(),
}));

describe("User Queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return user by ID", async () => {
    const mockUser = { id: "1", email: "test@example.com" };

    // Test implementation
    const result = await getUserById("1");

    expect(result).toEqual(mockUser);
  });

  it("should return null for non-existent user", async () => {
    const result = await getUserById("non-existent");
    expect(result).toBeNull();
  });
});
```

### Server Action Quality Rules
- **"use server" directive**: Required at top of all server action files
- **No Action Suffix**: Server actions do not use Action suffix since they're already in the `actions/` directory
- **Type Safety**: All functions must have explicit return types
- **Error Handling**: Wrap operations in try-catch with meaningful error messages
- **Revalidation**: Use `revalidatePath` and `revalidateTag` for cache management
- **Logging**: Log errors for debugging, don't expose internal details
- **Input Validation**: Validate inputs with Zod schemas before processing

## Documentation Standards

### Component Documentation
```typescript
/**
 * Custom button component with loading state and enhanced styling.
 *
 * @example
 * ```tsx
 * <CustomButton
 *   loading={isLoading}
 *   onClick={handleSubmit}
 *   variant="primary"
 * >
 *   Submit Form
 * </CustomButton>
 * ```
 */
export function CustomButton(props: CustomButtonProps) {
  // Implementation
}
```

### Code Comments
```typescript
// TODO: Improve error handling for edge cases
// FIXME: This is a temporary workaround for the API limitation
// NOTE: This component will be deprecated in v2.0
// HACK: Required due to browser compatibility issues

// Complex business logic explanation
function calculateUserPermissions(user: User): Permission[] {
  // Users with admin role get all permissions
  if (user.role === 'admin') {
    return ALL_PERMISSIONS;
  }

  // Regular users get permissions based on their subscription
  const subscriptionPermissions = getSubscriptionPermissions(user.subscriptionId);

  // Add any custom permissions granted to this user
  const customPermissions = user.customPermissions || [];

  return [...subscriptionPermissions, ...customPermissions];
}
```

## Error Handling Standards

### Error Boundaries
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error tracking service
    trackError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

### Async Error Handling
```typescript
// Safe async wrapper
export async function safeAsync<T>(
  asyncFn: () => Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const result = await asyncFn();
    return [result, null];
  } catch (error) {
    return [null, error as Error];
  }
}

// Usage
const [user, error] = await safeAsync(() => fetchUser(userId));
if (error) {
  // Handle error
  return;
}
// Use user data
```

## Code Review Checklist

### Pre-Submission Checklist
- [ ] TypeScript compilation passes without errors
- [ ] All tests pass with adequate coverage
- [ ] Code follows Biome formatting and linting rules
- [ ] Components are properly typed with interfaces
- [ ] No `any` types or unsafe type assertions
- [ ] Performance considerations addressed
- [ ] Security best practices followed
- [ ] Accessibility requirements met
- [ ] Documentation is complete and accurate

### Review Focus Areas
- **Type Safety**: Are types comprehensive and correct?
- **Performance**: Are there performance bottlenecks?
- **Security**: Are there security vulnerabilities?
- **Accessibility**: Does it meet WCAG standards?
- **Testing**: Is test coverage adequate?
- **Maintainability**: Is the code easy to understand and modify?