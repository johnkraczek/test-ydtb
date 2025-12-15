# Development Mode - Single Unit Implementation

You are in development mode. Your role is to implement a single unit of work based on an existing plan. **IMPORTANT**: Focus ONLY on implementing the specified unit - do not expand scope or add features beyond what's in the plan.

## Development Process

### 1. Initial Setup
- Expect a plan file path as the first argument
- Load and understand the specific unit to be implemented
- Verify all prerequisites are met
- Set up the development environment

### 1.1. **CRITICAL: Prepare Git Workspace**
Before any development work:

1. **Check Git Status**:
   ```bash
   git status
   ```

2. **If Workspace is NOT Clean** (has uncommitted changes):
   - **STOP** - Do not proceed with a dirty workspace
   - Inform the user: "Workspace has uncommitted changes"
   - Ask to create a commit to save current state
   - Example commit message: "WIP: Save work before starting Unit X.X - [feature name]"

3. **Only Proceed When Workspace is Clean**

4. **Create Feature Branch**:
   ```bash
   # Branch naming convention: unit-x.x.x-[short-name]
   # Extract unit number and name from the plan
   git checkout -b unit-4.1-database-registry-core
   ```

5. **Branch Name Examples**:
   - Unit 4.0: `unit-4.0-schema-refactoring`
   - Unit 4.1: `unit-4.1-database-registry-core`
   - Unit 4.2: `unit-4.2-schema-validation`
   - Unit 4.3: `unit-4.3-migration-management`

#### **Git Workflow Rules**:
- **NEVER** develop on main or develop branches
- **ALWAYS** use a feature branch for unit implementation
- **ALWAYS** start with a clean workspace (no uncommitted changes)
- **Branch name must follow** the convention: `unit-x.x.x-[short-name]`

### 1.5. **CRITICAL: Ask Clarifying Questions**
Before writing any code, you MUST:

#### **Review for Ambiguities**
- Read through the entire plan looking for unclear requirements
- Identify any implementation choices that aren't specified
- Note any dependencies that might have multiple solutions
- Check for missing technical details

#### **Common Areas Needing Clarification**:
1. **File Structure**: When the plan says "create X" but doesn't specify exact location
2. **Naming Conventions**: If multiple naming options exist (camelCase vs snake_case)
3. **Implementation Approach**: When multiple patterns could achieve the goal
4. **Integration Details**: How exactly to connect with existing systems
5. **Error Handling**: What specific errors to handle and how
6. **Type Definitions**: What specific types should be used
7. **Configuration**: Where and how to store configuration

#### **When to Ask Questions**:
- **ALWAYS ASK** if you're considering multiple implementation options
- **ALWAYS ASK** if the plan seems incomplete or ambiguous
- **ALWAYS ASK** if you're unsure about existing patterns to follow
- **ALWAYS ASK** if technical details are missing

#### **How to Ask**:
1. **Stop before implementing**
2. **List the specific questions**
3. **Explain the options you're considering**
4. **Wait for answers before proceeding**

#### **Example Questions**:
```
Before I start implementing Unit 4.1, I have a few questions:

1. The plan mentions creating "/apps/core/src/types/database-registry.ts" - should this interface extend any existing base types?

2. For the DatabaseRegistry class storage, the plan says "in-memory for runtime" - should I use a simple Map or a more sophisticated data structure?

3. When integrating with the existing registry exports in "/apps/core/src/registry/index.ts", should I maintain backwards compatibility with the environment registry exports?

4. The schema validation rules mention "semantic versioning" - should I use a specific library like semver or implement basic version parsing myself?
```

### 2. Implementation Workflow

#### **Before Writing Code**
- Read the entire unit plan carefully
- Understand all dependencies and integration points
- Fetch any URLs mentioned in the Important URLs section
- Review related code mentioned in Integration Points
- Verify the current state of the codebase

#### **2.1. Check for Existing Work**
**CRITICAL**: Before implementing ANY step, check if the work has already been completed:

1. **Check Files**:
   - For each file in "Files to Create", check if it already exists
   - For each file in "Files to Update", check if changes are already applied
   - Use file existence and content comparison to verify

2. **Check Implementation Steps**:
   - Review each step in Implementation Steps
   - Look for ✅ checkmarks indicating completion
   - Verify the actual implementation matches the step requirements

3. **Check Definition of Done**:
   - Verify if Definition of Done items are already met
   - Test if the functionality is working as specified

4. **How to Check**:
   ```bash
   # Check if files exist
   ls -la /path/to/file/to/create.ts

   # Check git status for recent changes
   git status
   git log --oneline -10

   # Check if build passes
   bun run build

   # Look for completed markers in the plan
   grep "✅" /path/to/plan.md
   ```

5. **If Work is Already Done**:
   - Mark the step as completed with ✅ in the plan
   - Verify with a build test
   - Report: "Step X was already completed - skipping"
   - Move to the next step

6. **If Partially Complete**:
   - Identify what's missing
   - Ask for clarification if the partial work doesn't match the plan
   - Complete only the missing portions

#### **During Implementation**
1. **Verify step needs work** - always check before starting
2. **Follow the plan exactly** - implement what's specified, nothing more
3. **Create files in the order listed** - follow the Implementation Steps sequence
4. **Build after each major step** - run `bun run build` after each Implementation Step
5. **Fix errors immediately** - never proceed with build errors
6. **Update the plan** - mark completed items with ✅

#### **3.1. Commit After Each Successful Build**
**CRITICAL**: After EVERY successful build, you MUST commit your work:

1. **When Build Succeeds**:
   ```bash
   # Run build
   bun run build

   # If build succeeds (exit code 0), commit immediately
   git add .
   git commit -m "feat: implement [specific step completed]"
   ```

2. **Conventional Commit Format**:
   ```
   <type>[optional scope]: <description>

   [optional body]

   [optional footer(s)]
   ```

3. **Commit Types**:
   - `feat`: New feature or implementation
   - `fix`: Bug fix
   - `refactor`: Code refactoring without functional change
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting, etc.)
   - `test`: Adding or updating tests
   - `build`: Build system or dependency changes
   - `plan`: Updating plan files, breaking down units, or clarifying requirements

4. **Commit Examples**:
   ```bash
   # After creating types
   git commit -m "feat(db-registry): add core database registry types"

   # After implementing validation
   git commit -m "feat(db-registry): implement schema validation rules"

   # After fixing build errors
   git commit -m "fix: resolve TypeScript compilation errors"

   # After refactoring
   git commit -m "refactor(db-registry): improve validation error messages"

   # After updating plan files
   git commit -m "plan: break down Unit 4.4 into smaller implementation steps"

   # After clarifying requirements
   git commit -m "plan: add migration examples to Unit 4.3"
   ```

5. **Commit Message Guidelines**:
   - Use present tense ("add" not "added")
   - Be specific about what was implemented
   - Include the scope in parentheses: `(db-registry)`, `(schema)`, etc.
   - Keep first line under 50 characters
   - Add body if more detail is needed

6. **NEVER Skip Commits**:
   - Every successful build = one commit
   - No exceptions, even for "small" changes
   - This ensures progress is tracked and reversible

#### **Code Implementation Guidelines**
- **Write actual code** - unlike planning mode, you will implement the features
- **Use existing patterns** - follow established code patterns in the codebase
- **Maintain functionality** - do not break existing features
- **Add necessary imports** - ensure all imports are correct
- **Type safety** - maintain TypeScript compliance

### 3. Build Verification Requirements

#### **Mandatory Builds**
- **After each file creation**: Run `bun run build` to ensure TypeScript compilation
- **After each major feature**: Run `bun run build` to verify integration
- **Before marking step complete**: Run `bun run build` to confirm no errors

#### **Error Handling**
- **Zero tolerance**: All errors must be fixed before continuing
- **Change-first debugging**: When builds fail:
  1. Stop all other work
  2. Run `git diff` to see recent changes
  3. Identify the cause of the failure
  4. Fix the issue
  5. Verify with another build
- **Never proceed** with errors

### 4. Quality Standards

#### **Code Quality**
- Follow existing code style and conventions
- Add appropriate comments for complex logic
- Ensure proper error handling
- Write clean, maintainable code

#### **Testing**
- Create test ONLY if specified in the plan
- Verify functionality manually
- Check edge cases mentioned in the plan
- Ensure no console errors

#### **Documentation**
- Update relevant documentation
- Add inline comments where necessary
- Update README files if required

### 5. Completion Checklist

Before marking a unit as complete, verify:
- [ ] All Implementation Steps completed
- [ ] All Files to Create/Update are done
- [ ] Build passes without errors (`bun run build`)
- [ ] All Definition of Done items checked
- [ ] Validation Checklist items verified
- [ ] No console errors in development
- [ ] Existing functionality still works

### 6. Communication Patterns

#### **Internal Communication**
- Use direct function calls for internal operations
- Use RSC (server components) for client <-> server communcations and mutations. 
- Follow the patterns specified in the plan
- Do not create HTTP endpoints unless explicitly required

#### **External Integration**
- Only integrate with external systems if specified
- Use proper authentication for external calls
- Follow security best practices

### 7. Progress Updates

#### **Marking Progress**
After completing each Implementation Step:
1. Update the plan file to mark the step as completed (add ✅)
2. Run `bun run build` to verify
3. Briefly summarize what was accomplished
4. State what's next according to the plan

#### **Example Update (New Work)**:
```
✅ Step 1 completed: Created database registry types
- Defined PackageSchema, Migration, and RegistryConfig interfaces
- Added semantic versioning support
- Build passes successfully
- Committed with: "feat(db-registry): add core database registry types"

Next: Step 2 - Implement DatabaseRegistry class
```

#### **Example Update (Work Already Done)**:
```
✅ Step 1 already completed: Database registry types exist
- File /apps/core/src/types/database-registry.ts already exists
- Contains all required interfaces from the plan
- Build passes successfully
- Marking as complete in plan

Next: Step 2 - Check if DatabaseRegistry class is implemented
```

### 8. Scope Management

#### **Stay Within Scope**
- **Only implement what's in the plan** - no extra features
- **Don't optimize** beyond what's specified
- **Don't refactor** unrelated code
- **Don't add** optional enhancements

#### **When in Doubt - STOP AND ASK**
- **NEVER guess** - always ask for clarification when unsure
- **NEVER assume** - don't make assumptions about requirements
- **NEVER choose** between options without asking first
- **ALWAYS pause** when you identify multiple implementation paths
- **ALWAYS document** your questions and the reasoning behind them

#### **Rule of Thumb**: If you find yourself thinking "should I do X or Y?", STOP - that's a signal you need to ask for clarification.

### 9. Handling Blockers

#### **If Blocked By**:
- **Missing dependencies**: Install them or document what's needed
- **Unclear requirements**: Ask for specific clarification
- **Technical limitations**: Document the issue and propose alternatives
- **External services**: Note the dependency and continue where possible

### 10. Final Verification

Before concluding the session:
1. **Final build**: Run `bun run build` one last time
2. **Review changes**: Run `git diff` to review all modifications
3. **Test manually**: Verify the implementation works
4. **Update plan**: Mark the unit as fully complete
5. **Summarize**: Provide a brief summary of what was implemented

## Important Reminders

- **You are implementing**, not planning
- **Follow the plan exactly**
- **Build after every step**
- **Never proceed with errors**
- **Stay within scope**
- **Focus on the single unit** specified
- **CHECK FOR EXISTING WORK** - verify what's already done before starting
- **ASK QUESTIONS** - when in doubt, always ask before implementing
- **NEVER ASSUME** - clarify ambiguities before choosing an approach
- **ALWAYS VERIFY** - don't just assume work needs to be done
- **CLEAN GIT WORKSPACE** - start with no uncommitted changes
- **USE FEATURE BRANCH** - never work directly on main
- **COMMIT AFTER EACH BUILD** - every successful build must be committed

## Critical Rule: 🛑 STOP AND ASK

**Before writing any code**, if you encounter:
- Multiple implementation options
- Unclear requirements
- Missing technical details
- Ambiguous integration points

**STOP** what you're doing and ask for clarification. It's better to ask first than to implement the wrong solution.

The goal is to efficiently and correctly implement the planned unit of work, maintaining code quality and system stability throughout the process.