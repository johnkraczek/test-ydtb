# Architecture & Design Principles

## Component Architecture

### Component-First Development
We prefer a **component-first approach** where UI components are developed in isolation using Storybook before integration:

1. **Design System Foundation**: Start with shadcn/ui components as the base
2. **Storybook Development**: Build and test components in Storybook first
3. **Incremental Integration**: Integrate components into pages after thorough testing
4. **Reusable Patterns**: Create composable, reusable components that can be used across features

### Component Hierarchy
```
components/
├── ui/                  # Base shadcn/ui components (no customization)
├── base/                # Extended base components (custom variants, wrappers)
├── features/            # Feature-specific components
└── layouts/             # Layout and composition components

actions/
├── users/               # User domain server actions
│   ├── queries.ts       # Data fetching server actions
│   ├── mutations.ts     # Data mutation server actions
│   └── types.ts         # Type definitions
├── posts/               # Blog post domain
│   ├── queries.ts
│   ├── mutations.ts
│   └── types.ts
└── products/            # Product domain
    ├── queries.ts
    ├── mutations.ts
    └── types.ts

app/
├── api/                 # External API integrations only
│   ├── stripe/          # Payment processing
│   ├── email/           # Email services
│   └── webhooks/        # External webhooks
└── (pages)/             # Next.js App Router pages
```

### Design Philosophy

#### 1. Progressive Enhancement
- Start with accessible, functional HTML
- Layer on enhancements with JavaScript
- Ensure graceful degradation

#### 2. Mobile-First Responsive Design
- Design for mobile screens first (320px and up)
- Progressively enhance for tablet (768px) and desktop (1024px)
- Use Tailwind's responsive prefixes consistently

#### 3. Accessibility First
- WCAG 2.1 AA compliance as minimum standard
- Semantic HTML and ARIA labels
- Keyboard navigation support
- Screen reader compatibility

#### 4. Performance Optimized
- Server components by default
- Client components only when necessary
- Lazy loading for heavy components
- Optimized images and assets
- Avoid Implementing API routes for internal getters and setters. 

## State Management Patterns

### Client State
- **React State**: For simple, component-local state
- **useReducer**: For complex component state logic
- **React Context**: For global application state (theme, user session)
- **Zustand**: (if needed) For complex client-side state management

### Server State
- **🟡 Server Components**: Default for all data fetching operations, can directly access database
- **🟢 Server Actions**: For mutations, form submissions, and data operations (functions in `actions/` directory)
- **Better Auth Integration**: Access user session data through Better Auth hooks
- **No Internal API Routes**: Avoid API routes for internal data operations

### Form Handling
- **React Hook Form**: For form validation and state management
- **Zod**: For schema validation and type safety
- **Server Actions**: For form submissions and mutations with progressive enhancement
- ** useFormState**: For handling server action results and errors

### Data Fetching Patterns
```typescript
// Server Component with Server Action for data fetching
import { getUserById } from "~/actions/users/queries";

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  // 🟢 Server Action: Function in actions/ directory
  const user = await getUserById(params.id);

  if (!user) {
    notFound();
  }

  return <UserProfile user={user} />;
}

// Client component with Server Action for mutations
"use client";

import { updateUser } from "~/actions/users/mutations";
import { useFormState, useFormStatus } from "react-dom";

export function UpdateUserForm({ userId, initialData }: UpdateUserFormProps) {
  // 🟢 Server Action: Function in actions/ directory used in form
  const [state, formAction] = useFormState(updateUser.bind(null, userId), {
    success: false,
    error: null,
  });

  return (
    <form action={formAction}>
      {/* Form fields */}
      <SubmitButton />
      {state.error && <ErrorMessage error={state.error} />}
    </form>
  );
}

// Server Component with direct database access
export async function UserListPage() {
  // 🟡 Server Component: Can directly access database
  const users = await db.select().from(users).limit(10);

  return <UserList users={users} />;
}
```

## Data Layer Architecture

### Internal Data Operations
We use **Server Components + Server Actions** for all internal data operations:

```
src/actions/
├── users/                 # User domain
│   ├── queries.ts         # Data fetching server actions
│   ├── mutations.ts       # Data mutation server actions
│   └── types.ts           # Type definitions
├── posts/                 # Blog post domain
│   ├── queries.ts
│   ├── mutations.ts
│   └── types.ts
└── products/              # Product domain
    ├── queries.ts
    ├── mutations.ts
    └── types.ts
```

### Server Action Structure
```typescript
// src/actions/users/queries.ts
"use server";

import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { User } from "./types";

export async function getUserById(id: string): Promise<User | null> {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] || null;
}

export async function getUsersByEmail(email: string): Promise<User[]> {
  return db.select().from(users).where(eq(users.email, email));
}

// src/actions/users/mutations.ts
"use server";

import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { CreateUserInput, UpdateUserInput } from "./types";

export async function createUser(data: CreateUserInput): Promise<User> {
  const [user] = await db.insert(users).values(data).returning();
  revalidatePath("/admin/users");
  return user;
}

export async function updateUser(id: string, data: UpdateUserInput): Promise<User> {
  const [user] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();

  revalidatePath(`/admin/users/${id}`);
  revalidatePath("/admin/users");
  return user;
}

export async function deleteUser(id: string): Promise<void> {
  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/admin/users");
}
```

### External API Integrations
External services use **standard API routes** in `src/app/api/`:

```
src/app/api/
├── stripe/                # Payment processing
│   ├── webhooks/route.ts
│   └── checkout/route.ts
├── email/                 # Email services
│   └── send/route.ts
└── webhook/               # Generic webhooks
    └── route.ts
```

**External API Rules:**
- Standard HTTP response codes (200, 400, 401, 404, 500)
- Better Auth API key plugin for authentication
- Input validation with Zod schemas
- Proper error handling and logging

### Server Action Naming Convention
- **No Action Suffix**: Server actions do not use Action suffix since they're already in the `actions/` directory
- **CRUD Operations**: Use consistent naming patterns without Action suffix
  - `getUserById`, `getAllUsers`, `createUser`, `updateUser`, `deleteUser`
  - `getPostById`, `getAllPosts`, `createPost`, `updatePost`, `deletePost`

### Data Access Principles
1. **Type Safety**: Server actions provide full TypeScript type safety
2. **Direct Database Access**: No API overhead for internal operations
3. **Caching**: Leverage React's built-in server action caching
4. **Revalidation**: Automatic cache invalidation with `revalidatePath`
5. **Error Handling**: Consistent error patterns across domains
6. **Clear Naming**: Directory location makes server functions easily identifiable

## Database Architecture

### Schema Design Principles
1. **Type Safety**: Use Drizzle's type inference for all database operations
2. **Relations First**: Define clear relations between tables
3. **Migration Safety**: Always use generated migrations for schema changes
4. **Index Strategy**: Add indexes for frequently queried columns

### Naming Conventions
- **Tables**: `snake_case` (e.g., `user_profiles`, `blog_posts`)
- **Columns**: `snake_case` (e.g., `created_at`, `is_active`)
- **Foreign Keys**: `{table}_id` pattern (e.g., `user_id`, `post_id`)

## Security Architecture

### Authentication Flow
1. **Better Auth Configuration**: Centralized auth setup
2. **Session Management**: Secure cookie-based sessions
3. **Route Protection**: Middleware-based route guards
4. **Token Refresh**: Automatic token refresh mechanisms

### Data Protection
- **Input Validation**: Zod schemas for all inputs
- **SQL Injection Prevention**: Drizzle ORM parameterized queries
- **XSS Prevention**: React's built-in XSS protection
- **CSRF Protection**: SameSite cookies and CSRF tokens

### Environment Security
- **Secret Management**: Environment variables for all secrets
- **Database Security**: Connection pooling and restricted access
- **API Security**: Rate limiting and request validation

## Performance Architecture

### Rendering Strategy
- **Server Components**: Default for static and data-heavy content
- **Client Components**: Only for interactive elements
- **Streaming**: Progressive UI loading with React Suspense
- **Partial Prerendering**: Next.js 16's advanced caching for optimal performance
- **ISR**: Incremental Static Regeneration for semi-static content

### Caching Strategy
- **Browser Caching**: Appropriate cache headers
- **Server Actions Caching**: Leverage React's built-in server action caching with `unstable_cache`
- **Database Caching**: Query result caching where appropriate
- **Component Caching**: React.memo and useMemo optimizations
- **Revalidation**: Automatic cache invalidation with `revalidatePath` and `revalidateTag`

### Server Action Performance
```typescript
// Cached server action for data fetching
import { unstable_cache } from "next/cache";
import { getUserById } from "~/actions/users/queries";

export const getCachedUser = unstable_cache(
  async (id: string) => getUserById(id),
  ["user"],
  {
    revalidate: 3600, // 1 hour
    tags: ["user"],
  }
);

// Mutation with selective revalidation
export async function updateUserWithRevalidation(id: string, data: UpdateUserInput) {
  const user = await updateUser(id, data);

  // Revalidate specific cache tags
  revalidateTag("user");
  revalidateTag(`user-${id}`);

  return user;
}
```

### Partial Prerendering with Next.js 16
Next.js 16 introduces powerful partial prerendering capabilities that we leverage for optimal performance:

#### Partial Prerendering Patterns
```typescript
// Page with static shell and dynamic content
export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      {/* Static header - always prerendered */}
      <ProductHeader />

      {/* Dynamic product data - fetched at request time */}
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails id={params.id} />
      </Suspense>

      {/* Static footer - always prerendered */}
      <ProductFooter />
    </div>
  );
}

// Dynamic component with streaming
async function ProductDetails({ id }: { id: string }) {
  const product = await getProductById(id);

  return (
    <div>
      <h1>{product.name}</h1>
      <ProductPrice price={product.price} />
      <ProductDescription description={product.description} />
    </div>
  );
}
```

#### Partial Caching Strategy
```typescript
// Partially cached page layout
export default async function DashboardPage() {
  const session = await auth();

  return (
    <DashboardLayout user={session.user}>
      {/* Static navigation - cached */}
      <DashboardNav />

      {/* Dynamic content - fresh data */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent userId={session.user.id} />
      </Suspense>
    </DashboardLayout>
  );
}

// Cached static components
const DashboardNav = cache(async function DashboardNav() {
  const navigation = await getNavigationItems();
  return <Nav items={navigation} />;
});
```

#### Advanced Partial Rendering
```typescript
// Route groups with different caching strategies
export default function ShopPage() {
  return (
    <div>
      {/* Always static - product categories */}
      <ShopCategories />

      {/* Cached for 5 minutes - featured products */}
      <FeaturedProducts />

      {/* Dynamic - user-specific recommendations */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <UserRecommendations />
      </Suspense>
    </div>
  );
}

// TTL-based caching for components
const FeaturedProducts = cache(
  async () => {
    const products = await getFeaturedProducts();
    return <ProductGrid products={products} />;
  },
  ["featured-products"],
  { revalidate: 300 } // 5 minutes
);
```

### Bundle Optimization
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Remove unused code
- **Dynamic Imports**: Lazy load heavy dependencies
- **Image Optimization**: Next.js Image component usage
- **Partial Bundle Loading**: Load only necessary code for partial updates

## Testing Architecture

### Testing Pyramid
1. **Unit Tests (70%)**: Component logic, utility functions
2. **Integration Tests (20%)**: Component interactions, API endpoints
3. **E2E Tests (10%)**: Critical user journeys

### Testing Tools
- **Vitest**: Unit and integration testing
- **Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing
- **MSW**: API mocking for tests

## Deployment Architecture

### Environment Strategy
- **Development**: Local development with hot reload
- **Staging**: Production-like environment for testing
- **Production**: Optimized for performance and reliability

### CI/CD Pipeline
1. **Code Quality**: Biome linting and formatting
2. **Type Checking**: TypeScript compilation
3. **Testing**: Automated test suite execution
4. **Build**: Production build optimization
5. **Deployment**: Automated deployment to staging/production

### Monitoring and Observability
- **Error Tracking**: Sentry or similar for error monitoring
- **Performance Monitoring**: Web Vitals and custom metrics
- **Logging**: Structured logging for debugging
- **Health Checks**: API health endpoints