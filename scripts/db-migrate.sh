#!/usr/bin/env bash
# Run database migrations
source "$SCRIPT_DIR/db-utils.sh"
cd "$PROJECT_ROOT"
bunx drizzle-kit migrate