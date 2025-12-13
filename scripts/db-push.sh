#!/usr/bin/env bash
# Push schema changes to database (dev)
source "$SCRIPT_DIR/db-utils.sh"
cd "$PROJECT_ROOT"
bunx drizzle-kit push