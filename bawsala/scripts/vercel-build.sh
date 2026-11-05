#!/usr/bin/env bash
# Build command for Vercel (Project Settings → Build Command: bash scripts/vercel-build.sh).
# Applies database migrations, the reference seed and the knowledge base, then builds the app.
# All three steps are idempotent (applied migrations are recorded; seed and ingest upsert).
# MIGRATION_DATABASE_URL is the database owner's connection string, used only during the build;
# the running app uses DATABASE_URL, a restricted role that row-level security applies to.
set -euo pipefail
OWNER_URL="${MIGRATION_DATABASE_URL:-$DATABASE_URL}"
DATABASE_URL="$OWNER_URL" npm run db:migrate
DATABASE_URL="$OWNER_URL" npm run db:seed
DATABASE_URL="$OWNER_URL" npm run kb:ingest
npx next build
