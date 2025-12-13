# Push and Create PR

Pushes the current branch to remote and creates/updates a pull request to master.

This command will:
1. Check current git status (ensure no uncommitted changes)
2. Get current branch name
3. Push branch to remote origin
4. Check if PR already exists from this branch to master
5. Create new PR or update existing one
6. Open the PR in browser for review

Usage: `/push`

Integrates with the project's Git workflow:
- Works with feature/ and fix/ branches
- Targets master branch (which is protected)
- Uses GitHub CLI for PR management
- Follows conventional commit format from commits

The PR will include:
- Proper title from branch name and recent commits
- Auto-generated description with changes
- Links to the relevant commits
- Ready for team review and merge

Example flow:
- Pushes feature/qr-scanner-ui to origin
- Creates PR: feature/qr-scanner-ui � master
- Opens https://github.com/johnkraczek/rise/pull/123 for review


Note: Avoid tagging claude in the commit or the pull request. 