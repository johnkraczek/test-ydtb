# Build and Test

Build the software and run comprehensive tests to verify everything is working properly.

This command performs the following validation checks:

## Build Validation
- **TypeScript compilation**: Ensures all types are correct and no TypeScript errors
- **Next.js build**: Verifies the application can be built for production
- **Database schema validation**: Checks Drizzle ORM schema consistency

## Code Quality
- **ESLint**: Runs linting to catch code quality issues and fixes them
- **Issue Resolution**: Automatically fixes any minor issues found during build
  - Removes unused variables and imports
  - Fixes TypeScript strict mode violations
  - Resolves formatting inconsistencies
  - Addresses code quality warnings
- **Import organization**: Ensures imports are properly organized
- **Format validation**: Verifies code formatting consistency

## Runtime Tests
- **Unit tests**: Runs test suite if available
- **Database connection**: Tests database connectivity
- **Environment validation**: Ensures required environment variables are available

## Security & Dependencies
- **Dependency audit**: Checks for security vulnerabilities
- **Bundle analysis**: Analyzes bundle size and structure
- **Performance metrics**: Validates build performance

This gives you confidence that your codebase is healthy, production-ready, and working as expected before deploying or merging changes. When issues are found, this command resolves them automatically to maintain code quality standards.