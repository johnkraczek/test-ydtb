#!/usr/bin/env bash
# Database utility functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Load environment variables
set -a
source "$PROJECT_ROOT/.env.local"
set +a

echo "Database utilities loaded"