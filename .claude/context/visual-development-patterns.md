# Visual Development Patterns & UI Guidelines

## Design System Architecture

### Base Design System
We use **shadcn/ui** as our foundation with the following configuration:
- **Style Variant**: New York
- **Color Scheme**: Slate (default with dark mode support)
- **Border Radius**: Medium (0.5rem)
- **Icon Library**: Lucide React

### Component Layering Strategy
```
1. shadcn/ui Components (Base Layer)
   ├── Button, Input, Card, Dialog, etc.
   └── No customization - use as provided

2. Extended Base Components (Design System Layer)
   ├── Custom variants and compositions
   ├── Brand-specific styling
   └── Reusable patterns

3. Feature Components (Application Layer)
   ├── Business logic integration
   ├── Feature-specific compositions
   └── Page-level components
```

## Design Tokens & Theming

### Color System
```css
/* Primary Brand Colors (extending shadcn/ui) */
--primary: 222.2 84% 4.9%;
--primary-foreground: 210 40% 98%;

/* Semantic Colors */
--success: 142.1 76.2% 36.3%;
--warning: 32.6 94.6% 43.7%;
--error: 0 84.2% 60.2%;
--info: 221.2 83.2% 53.3%;

/* Neutral Grays */
--neutral-50: 0 0% 98%;
--neutral-100: 0 0% 96%;
--neutral-200: 0 0% 90%;
--neutral-300: 0 0% 81%;
--neutral-400: 0 0% 64%;
--neutral-500: 0 0% 45%;
--neutral-600: 0 0% 27%;
--neutral-700: 0 0% 15%;
--neutral-800: 0 0% 9%;
--neutral-900: 0 0% 3%;
```

### Typography Scale
```css
/* Font Sizes (using Tailwind v4 CSS variables) */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System
```css
/* Spacing Scale (Tailwind v4) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

## Component Design Patterns

### Button System
```typescript
// Base shadcn/ui Button variants
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### Form Patterns
```typescript
// Consistent form structure
export function FormSection({ children, title, description }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

// Input group pattern
export function InputGroup({
  label,
  description,
  error,
  required,
  children,
}: InputGroupProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={children.props.id}>
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
```

### Card Patterns
```typescript
// Base card wrapper
export function CardWrapper({
  title,
  description,
  actions,
  children,
  className,
}: CardWrapperProps) {
  return (
    <Card className={cn("", className)}>
      {(title || description || actions) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            {title && <CardTitle>{title}</CardTitle>}
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </div>
          {actions && <div className="flex space-x-2">{actions}</div>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
```

## Layout Patterns

### Container System
```typescript
// Responsive container
export function Container({
  children,
  size = "default",
  className,
}: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-2xl",
    default: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}
```

### Section Patterns
```typescript
// Consistent section spacing
export function Section({
  children,
  title,
  description,
  id,
  className,
  containerSize = "default",
}: SectionProps) {
  return (
    <section id={id} className={cn("py-16 sm:py-20", className)}>
      <Container size={containerSize}>
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
```

### Grid System
```typescript
// Responsive grid utilities
const gridVariants = {
  // Standard grids
  "grid-cols-1": "grid-cols-1",
  "grid-cols-2": "grid-cols-1 md:grid-cols-2",
  "grid-cols-3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  "grid-cols-4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",

  // Feature grids
  "features-grid": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
  "card-grid": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
};
```

## Responsive Design Patterns

### Mobile-First Breakpoints
```css
/* Tailwind v4 responsive prefixes */
/* sm: 640px and up */
/* md: 768px and up */
/* lg: 1024px and up */
/* xl: 1280px and up */
/* 2xl: 1536px and up */
```

### Navigation Patterns
```typescript
// Mobile-responsive navigation
export function ResponsiveNav({ items }: ResponsiveNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop navigation */}
      <nav className="hidden md:flex space-x-8">
        {items.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b">
          <nav className="flex flex-col p-4 space-y-2">
            {items.map((item) => (
              <NavItem key={item.href} {...item} mobile />
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
```

## Animation Patterns

### Transition Utilities
```css
/* Standard transitions */
.transition-base {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-slow {
  transition-duration: 300ms;
}

.transition-fast {
  transition-duration: 75ms;
}
```

### Common Animations
```typescript
// Fade in animation
export function FadeIn({ children, delay = 0 }: FadeInProps) {
  return (
    <div
      className="animate-in fade-in duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Slide up animation
export function SlideUp({ children, delay = 0 }: SlideUpProps) {
  return (
    <div
      className="animate-in slide-in-from-bottom duration-500"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
```

## Accessibility Patterns

### Focus Management
```typescript
// Focus trap for modals
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    firstElement?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [isActive]);

  return containerRef;
}
```

### Screen Reader Patterns
```typescript
// Accessible button with loading state
export function AccessibleButton({
  children,
  loading,
  loadingText = "Loading...",
  ...props
}: AccessibleButtonProps) {
  return (
    <Button disabled={loading} {...props}>
      <span className={loading ? "sr-only" : undefined}>
        {children}
      </span>
      {loading && (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          <span aria-live="polite">{loadingText}</span>
        </>
      )}
      {!loading && children}
    </Button>
  );
}
```

## State-Specific Styling

### Loading States
```typescript
// Skeleton loading pattern
export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  );
}
```

### Error States
```typescript
// Error boundary display
export function ErrorDisplay({ error, reset }: ErrorDisplayProps) {
  return (
    <div className="text-center py-12">
      <div className="text-destructive text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-6">
        {error.message || "An unexpected error occurred"}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

## Icon Usage Patterns

### Icon System
```typescript
// Consistent icon wrapper
export function Icon({
  name,
  size = "md",
  className,
}: IconProps) {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-8 w-8",
  };

  const IconComponent = icons[name];
  if (!IconComponent) return null;

  return (
    <IconComponent
      className={cn("shrink-0", sizeClasses[size], className)}
    />
  );
}
```

## Color Usage Guidelines

### Semantic Color Mapping
- **Success**: Form submissions, successful actions
- **Warning**: Warnings, cautions, attention needed
- **Error**: Validation errors, failed actions
- **Info**: Information, help text, tips
- **Primary**: Main actions, primary CTAs
- **Secondary**: Secondary actions, less prominent elements

### Dark Mode Considerations
- Ensure sufficient contrast ratios in both themes
- Use semantic color tokens for consistency
- Test all components in both light and dark modes
- Consider user preference for reduced motion