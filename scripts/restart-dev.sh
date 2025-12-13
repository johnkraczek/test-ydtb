#!/usr/bin/env bash
# Enhanced restart script
echo "Restarting development environment..."
bun run stop
sleep 2
bun run dev