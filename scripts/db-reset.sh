#!/usr/bin/env bash
# Reset database to clean state
source "$SCRIPT_DIR/db-utils.sh"
cd "$PROJECT_ROOT"
echo "⚠️  This will delete all data. Are you sure? (y/N)"
read -r confirmation
if [[ $confirmation == "y" || $confirmation == "Y" ]]; then
  bunx drizzle-kit drop
  bunx drizzle-kit push
  bun run scripts/seed.ts
  echo "Database reset complete"
else
  echo "Cancelled"
fi