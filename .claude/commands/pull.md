# Pull Merged Changes and Start New Feature

This command helps you pull merged changes from master and prepare for new development work.

## Process

### 1. Switch to Master Branch
The command will check out the master branch to ensure you're working from the latest merged changes.

### 2. Pull Latest Changes
It will pull the latest changes from the remote master branch, including any squashed commits from recent merges.

### 3. Show Recent Commits
It will display the recent commit history so you can see what was merged.

### 4. Create New Feature Branch
The command will prompt you to create a new feature branch using conventional naming:
- `feature/your-feature-name` - for new functionality
- `fix/your-fix-name` - for bug fixes
- `refactor/your-refactor-name` - for code refactoring
- `chore/your-chore-name` - for maintenance tasks

### 5. Switch to New Branch
Finally, it will switch you to your new feature branch so you can start working immediately.

## Usage

Run `/pull` to execute the complete workflow. The command will guide you through each step with clear instructions.

## Example Workflow

```bash
/pull
# ✅ Switched to master branch
# ✅ Pulled latest changes from origin/master
# ✅ Recent commits:
#   17a6e37 feat: implement complete Better Auth integration with enhanced UI (#5)
#   5988325 fix: resolve CORS origin issues (#4)
#
# 🎯 What type of work are you starting?
# 1. feature - new functionality
# 2. fix - bug fixes
# 3. refactor - code refactoring
# 4. chore - maintenance tasks
#
# Please enter branch name (without feature/ prefix):
# user-authentication
#
# ✅ Created and switched to feature/user-authentication
# ✅ Ready to start development!
```

## Git Workflow Integration

This command follows the project's established Git workflow:
- **Protected Branch**: `master` branch is protected and requires PRs
- **Feature Branches**: All development work happens on feature/*, fix/*, refactor/*, or chore/* branches
- **Pull Request Workflow**: Changes are submitted via PR to master branch
- **Squashed Commits**: Merged commits are squashed to maintain clean history

## Branch Naming Conventions

- `feature/` - For new features and functionality
- `fix/` - For bug fixes and patches
- `refactor/` - For code refactoring and cleanup
- `chore/` - For maintenance, dependencies, configuration

## Benefits

- ✅ **Always Latest**: Ensures you're working from the most recent merged code
- ✅ **Clean History**: Master branch maintains clean, squashed commit history
- ✅ **Proper Workflow**: Follows established branch protection rules
- ✅ **Quick Setup**: Automatically creates new branch with proper naming
- ✅ **Consistency**: Standardizes branch creation process

Use `/pull` whenever you've merged a PR and want to start working on the next feature or fix!