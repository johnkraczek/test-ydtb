# Commit Changes

Commits all staged and unstaged changes in the current branch with a conventional commit message.

**⚠️ IMPORTANT**: This command will prevent commits to protected branches (master) and require feature/ or fix/ branches for development.

**⚠️ IMPORTANT**: Avoid tagging commit messages with Claude: Co-Authored-By: Claude <noreply@anthropic.com> or 🤖 Generated with [Claude Code](https://claude.com/claude-code)

This command will:
1. Check current branch and prevent commits to protected branches
2. Check current git status
3. Show what changes will be committed
4. Ask for commit type and description
5. Add all changes to staging
6. Create commit with proper conventional commit format (avoid tagging claude in the commit message)
7. Show the commit result

Usage: `/commit`

## Branch Protection Rules

- **Protected Branches**: `master` (no direct commits allowed)
- **Required Branch Types**: `feature/*`, `fix/*`, `chore/*`, `refactor/*`
- **Workflow**: Work on feature/fix branches → PR → merge to master

## Conventional Commit Format

- feat: for new features
- fix: for bug fixes
- refactor: for code refactoring
- docs: for documentation changes
- style: for formatting/linting changes
- test: for adding/updating tests
- chore: for maintenance tasks

Example interaction:
- Command checks if current branch is allowed for commits
- Command asks for commit type (feat/fix/refactor/etc.)
- Command asks for description
- Creates commit like "feat: add QR scanner component"

## Error Handling

If you're on a protected branch (master):
- The command will refuse to commit
- It will suggest creating a feature branch instead
- Example: `git checkout -b feature/your-feature-name`