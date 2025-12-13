# Development Workflow & Processes

## Git Workflow

### Branch Strategy
We use a **feature branch workflow** with the following branching conventions:

```bash
# Main branches
main                    # Production-ready code
develop                 # Integration branch (if using)

# Feature branches
feature/feature-name    # New features
fix/bug-description     # Bug fixes
chore/maintenance-task  # Maintenance tasks
refactor/component-name # Code refactoring
docs/documentation     # Documentation updates
```

### Branch Naming Conventions
- **Features**: `feature/qr-scanner-component`, `feature/user-authentication`
- **Bug Fixes**: `fix/login-validation-error`, `fix/mobile-menu-bug`
- **Chores**: `chore/update-dependencies`, `chore/add-eslint-rule`
- **Refactoring**: `refactor/user-service-optimization`
- **Documentation**: `docs/api-endpoint-guide`

### Commit Message Standards
We follow **Conventional Commits** format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting, missing semi colons, etc. (no functional changes)
- `refactor`: Code refactoring that is neither a fix nor a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Maintenance tasks, dependency updates, build process changes

#### Examples
```bash
feat(auth): add GitHub OAuth integration
fix(button): resolve mobile layout issue
docs(readme): update installation instructions
refactor(user-service): extract validation logic
test(auth): add login form unit tests
chore(deps): update Next.js to v15.2.3
```

## Code Quality Standards

### TypeScript Requirements
- **Strict Mode**: All TypeScript strict options enabled
- **Type Coverage**: 100% type coverage for new code
- **No `any` Types**: Use proper types or `unknown` instead of `any`
- **Interface Naming**: Use `PascalCase` for interfaces and types
- **Enum Usage**: Prefer string enums over const enums

### Code Style and Formatting
- **Biome**: Primary formatter and linter
- **Import Organization**: Automatic import sorting with Biome
- **Line Length**: Maximum 100 characters
- **Indentation**: 2 spaces (Biome default)
- **Quote Style**: Single quotes for strings

### Code Review Process
1. **Self-Review**: Review your own code before creating PR
2. **PR Creation**: Use descriptive title and detailed description
3. **Automated Checks**: All CI checks must pass
4. **Peer Review**: At least one team member approval required
5. **Testing**: Ensure tests are written for new functionality
6. **Documentation**: Update relevant documentation

### Pull Request Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] TypeScript types are correct
- [ ] Performance impact considered
```

## Development Process

### Feature Development Workflow
1. **Planning**
   - Create feature branch from `main`
   - Define acceptance criteria
   - Create task breakdown

2. **Development**
   - Set up development environment
   - Implement feature in small, testable chunks
   - Write tests alongside code
   - Use Storybook for component development

3. **Testing**
   - Run unit tests: `npm run test`
   - Run integration tests: `npm run test:integration`
   - Run E2E tests: `npm run test:e2e`
   - Manual testing in development environment

4. **Code Quality**
   - Type checking: `npm run typecheck`
   - Linting: `npm run check`
   - Format code: `npm run check --fix`

5. **Review and Merge**
   - Create pull request with detailed description
   - Address review feedback
   - Ensure all checks pass
   - Merge to `main` after approval

### Daily Development Workflow
```bash
# Start of day
git checkout main
git pull origin main
npm run dev                    # Start development server

# Before committing
npm run typecheck             # Check TypeScript
npm run check                 # Run linter and formatter
npm run test                  # Run tests

# Commit workflow
git add .                     # Stage changes
git commit -m "feat: add feature description"
git push origin feature/branch-name
```

## Testing Strategy

### Unit Testing
- **Framework**: Vitest with Testing Library
- **Coverage Goal**: 80%+ coverage for critical paths
- **Test Location**: Co-located with source files (`component.test.ts`)
- **Mock Strategy**: Mock external dependencies and APIs

### Integration Testing
- **Component Integration**: Test component interactions
- **API Integration**: Test API endpoints with test database
- **Database Integration**: Test database operations and migrations

### E2E Testing
- **Framework**: Playwright
- **Test Environment**: Dedicated test database
- **Test Scope**: Critical user journeys only
- **CI Integration**: Automated execution on PR

### Testing Commands
```bash
# All tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# UI mode
npm run test:ui

# E2E tests
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui
```

## Database Workflow

### Migration Process
1. **Schema Changes**: Modify `src/server/db/schema.ts`
2. **Generate Migration**: `npm run db:generate`
3. **Review Migration**: Check generated SQL file
4. **Apply Migration**: `npm run db:migrate`
5. **Test Changes**: Verify in development environment

### Database Commands
```bash
# Generate new migration
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema (development only)
npm run db:push

# Open Drizzle Studio
npm run db:studio

# Reset database (development only)
npm run db:reset
```

## Component Development Workflow

### Storybook-First Development
1. **Create Component**: Set up component file structure
2. **Storybook Stories**: Create stories for all component states
3. **Visual Testing**: Test component in Storybook
4. **Unit Tests**: Write component unit tests
5. **Integration**: Integrate component into application
6. **Cross-Browser Testing**: Test in different browsers

### Component File Structure
```
components/
├── ui/
│   ├── button.tsx          # shadcn/ui component
│   └── button.stories.tsx  # Storybook stories
├── base/
│   ├── custom-button/
│   │   ├── index.tsx       # Component implementation
│   │   ├── types.ts        # Type definitions
│   │   ├── hooks.ts        # Custom hooks
│   │   ├── utils.ts        # Utility functions
│   │   ├── test.tsx        # Unit tests
│   │   └── stories.tsx     # Storybook stories
```

## Release Process

### Version Management
- **Semantic Versioning**: Follow semver for version bumps
- **Changelog**: Maintain changelog for all releases
- **Release Notes**: Detailed notes for each release

### Deployment Checklist
1. **Code Quality**: All linting and formatting checks pass
2. **Tests**: All test suites pass with acceptable coverage
3. **Build**: Production build succeeds
4. **Database**: Migrations applied successfully
5. **Environment**: Environment variables configured
6. **Monitoring**: Error tracking and monitoring set up

### Hotfix Process
1. **Branch Creation**: `git checkout -b hotfix/critical-bug`
2. **Minimal Fix**: Implement the smallest possible fix
3. **Testing**: Thorough testing of the fix
4. **Fast Merge**: Merge directly to main with appropriate review
5. **Release**: Immediate release deployment

## Collaboration Guidelines

### Communication Channels
- **Daily Standups**: Share progress and blockers
- **Pull Request Reviews**: Constructive, timely feedback
- **Documentation**: Keep documentation up to date
- **Knowledge Sharing**: Regular tech talks and code reviews

### Code Ownership
- **Primary Owner**: One person responsible for each major component
- **Secondary Reviewers**: Team members familiar with the codebase
- **Collective Ownership**: Everyone can contribute to any code area

### Conflict Resolution
1. **Technical Discussions**: Base decisions on technical merit
2. **Data-Driven**: Use performance metrics and user feedback
3. **Team Consensus**: Strive for team agreement on major decisions
4. **Documentation**: Document architectural decisions and rationale