# AI Collaboration Guidelines

## Working Together with AI Partners

### Our Collaboration Philosophy
We view AI as **collaborative partners** in development, not just tools. This means:

1. **Shared Understanding**: AI partners should understand our project context, patterns, and preferences
2. **Constructive Dialogue**: Open discussions about technical decisions and trade-offs
3. **Iterative Refinement**: Working together to improve code quality and architecture
4. **Learning Partnership**: Both humans and AI learn from each other's perspectives

### Communication Patterns

#### Asking for Help
When asking AI partners for assistance, provide:
- **Context**: What you're trying to achieve
- **Constraints**: Any technical or design limitations
- **Current State**: What you've already tried or implemented
- **Desired Outcome**: What success looks like

**Example:**
> "I need to implement a user profile component that displays user information, allows editing, and handles validation. I've already set up the user service with Better Auth integration. The component should use our design system patterns and be accessible."

#### Receiving Suggestions
When receiving AI suggestions:
1. **Understand the Rationale**: Ask "why" for significant architectural decisions
2. **Consider Alternatives**: Discuss different approaches and their trade-offs
3. **Adapt to Context**: Modify suggestions to fit our specific patterns and preferences
4. **Validate**: Test and review AI-generated code before integrating

## Decision-Making Process

### Technical Decisions
We use a **collaborative decision-making framework**:

1. **Problem Identification**: Clearly define the problem or requirement
2. **Option Exploration**: Generate multiple approaches (AI + human)
3. **Trade-off Analysis**: Evaluate pros/cons of each option
4. **Context Application**: Consider our specific constraints and patterns
5. **Decision**: Choose the best approach for our situation
6. **Documentation**: Record the decision and rationale

### When to Override AI Suggestions
Override AI suggestions when:
- **Security Concerns**: Potential security vulnerabilities
- **Performance Issues**: Better approaches for our specific use case
- **User Experience**: Better UX patterns for our users
- **Maintainability**: More maintainable code for our team
- **Brand Standards**: Alignment with our design system and brand

### When to Trust AI Suggestions
Trust AI suggestions when:
- **Best Practices**: Industry-standard approaches
- **Code Quality**: Cleaner, more maintainable code
- **Type Safety**: Better TypeScript patterns
- **Accessibility**: Improved accessibility implementation
- **Testing**: Better testing strategies and coverage

## Code Review Guidelines

### Reviewing AI-Generated Code
When reviewing code from AI partners:

#### Functional Review
- ✅ **Correctness**: Does it work as intended?
- ✅ **Edge Cases**: Are error conditions handled properly?
- ✅ **Performance**: Is it optimized for our use case?
- ✅ **Security**: Are there potential security issues?

#### Code Quality Review
- ✅ **TypeScript Types**: Are types properly defined and used?
- ✅ **Naming**: Are variables, functions, and components well-named?
- ✅ **Structure**: Does it follow our architectural patterns?
- ✅ **Documentation**: Is it well-documented and easy to understand?

#### Integration Review
- ✅ **Design System**: Does it use our component patterns correctly?
- ✅ **Dependencies**: Are dependencies appropriate and minimal?
- ✅ **Accessibility**: Does it meet our accessibility standards?
- ✅ **Testing**: Is it testable and well-tested?

### Providing Feedback to AI
When providing feedback to AI partners:

#### Constructive Feedback
```typescript
// Instead of: "This code is wrong"
// Use: "This approach has a potential issue with X. Consider Y instead because..."
```

#### Specific Guidance
```typescript
// Instead of: "Make it better"
// Use: "Can you refactor this to use our custom hook pattern and add proper error handling?"
```

#### Contextual Information
```typescript
// Provide relevant context
"We prefer to use our Button component instead of native buttons for consistency"
"Make sure to follow our form validation patterns with Zod schemas"
```

## Project Context Awareness

### What AI Partners Should Know
AI partners working on this project should understand:

#### Technology Stack
- Next.js 16 with App Router, Partial Prerendering, and React 19.2
- TypeScript with strict mode
- Tailwind CSS v4 and shadcn/ui components
- Better Auth for authentication
- Drizzle ORM with PostgreSQL
- Biome for code quality

#### Architectural Patterns
- Component-first development with Storybook
- Server components by default
- Repository pattern for database operations
- Custom hooks for shared logic
- Error boundaries and error handling

#### Design Principles
- Mobile-first responsive design
- Accessibility-first approach (WCAG 2.1 AA)
- Progressive enhancement
- Performance optimization

#### Code Quality Standards
- 100% TypeScript coverage
- Comprehensive testing requirements
- Biome formatting and linting
- Conventional commit messages

### Context Updates
When project context changes:
1. **Update Documentation**: Keep context files current
2. **Notify AI Partners**: Reference relevant changes in requests
3. **Pattern Evolution**: Document new patterns and deprecate old ones
4. **Decision Rationale**: Record why decisions were made

## Development Workflow Integration

### Feature Development with AI
1. **Planning Phase**: Collaborate on architecture and approach
2. **Implementation Phase**: AI assists with code generation and patterns
3. **Review Phase**: Human reviews AI-generated code
4. **Refinement Phase**: Collaborative improvements and optimizations
5. **Testing Phase**: AI helps generate test cases and coverage
6. **Documentation Phase**: AI assists with documentation updates

### Problem-Solving Approach
Technical challenges:

1. **Explain the Problem**: Clear description of the issue
2. **Share Context**: Relevant code, error messages, and constraints
3. **Brainstorm Solutions**: Generate multiple approaches together
4. **Evaluate Options**: Discuss pros and cons of each approach
5. **Implement Solution**: Collaborative implementation and testing
6. **Learn and Document**: Record lessons learned for future reference

### Code Generation Patterns

#### Preferred Patterns for AI Assistance
- **Component Generation**: Following our design system patterns
- **Hook Creation**: Reusable logic with proper TypeScript types
- **Utility Functions**: Pure functions with comprehensive typing
- **Test Generation**: Comprehensive test coverage following our patterns
- **Documentation**: Clear, concise documentation with examples

#### Generation Guidelines
- **Use Our Patterns**: Follow existing code patterns and conventions
- **Type Safety**: Prioritize TypeScript type safety
- **Accessibility**: Include accessibility features from the start
- **Performance**: Consider performance implications
- **Testability**: Write code that's easy to test

## Quality Assurance

### AI Code Verification
Before integrating AI-generated code:

1. **Automated Checks**: Run linting, formatting, and type checking
2. **Manual Review**: Human review for logic and architecture
3. **Testing**: Verify tests pass and provide good coverage
4. **Integration**: Test in the broader application context
5. **Performance**: Check for performance regressions

### Continuous Improvement
We continuously improve our AI collaboration by:
- **Documenting Patterns**: Recording successful patterns and approaches
- **Learning from Mistakes**: Analyzing and learning from issues
- **Updating Guidelines**: Keeping collaboration guidelines current
- **Feedback Loops**: Regular feedback on collaboration effectiveness

## Troubleshooting AI Collaboration

### Common Challenges
- **Context Loss**: AI doesn't have enough project context
- **Pattern Mismatch**: Generated code doesn't follow our patterns
- **Over-Engineering**: AI suggests overly complex solutions
- **Assumption Errors**: AI makes incorrect assumptions about requirements

### Resolution Strategies
- **Provide More Context**: Share relevant files and requirements
- **Reference Patterns**: Point to existing code as examples
- **Simplify Requirements**: Break down complex requests
- **Iterative Refinement**: Work iteratively towards the solution

### Escalation Guidelines
When collaboration isn't working effectively:
1. **Reset Context**: Start fresh with clear requirements
2. **Different Approach**: Try a different approach or pattern
3. **Human Override**: Human takes over implementation
4. **Learn and Adapt**: Document lessons for future collaborations