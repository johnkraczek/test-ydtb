#!/usr/bin/env bash
# Seed database with sample data
source "$SCRIPT_DIR/db-utils.sh"
cd "$PROJECT_ROOT"
bun run scripts/seed.ts