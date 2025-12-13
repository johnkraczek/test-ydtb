#!/usr/bin/env bash
# Generate database types from schema
source "$SCRIPT_DIR/db-utils.sh"
cd "$PROJECT_ROOT"
bunx drizzle-kit generate