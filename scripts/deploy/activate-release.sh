#!/usr/bin/env bash
# Activates a release built by .github/workflows/deploy.yml on the production VM.
#
# Usage: activate-release.sh <release-id> <archive.tgz>
#
# Layout under APP_DIR:
#   current -> releases/<release-id>   (pm2 runs from here)
#   releases/<release-id>/             (last KEEP_RELEASES releases are kept)
#   shared/.env.production             (production env, never touched by deploys)
set -euo pipefail

RELEASE_ID="${1:?release id is required}"
ARCHIVE="${2:?archive path is required}"

export APP_DIR="${APP_DIR:-/home/ubuntu/app/adigsi-web-and-cms}"
PM2_APP="adigsi-web"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3000/api/health}"
HEALTH_TIMEOUT_SECONDS="${HEALTH_TIMEOUT_SECONDS:-60}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"
# pm2 process from the old manual setup (git clone + pnpm start); only needed for the first deploy
LEGACY_PM2_NAME="${LEGACY_PM2_NAME:-}"

RELEASES_DIR="$APP_DIR/releases"
RELEASE_DIR="$RELEASES_DIR/$RELEASE_ID"
ENV_FILE="$APP_DIR/shared/.env.production"

log() {
  echo "[deploy] $*"
}

fail() {
  echo "[deploy] ERROR: $*" >&2
  exit 1
}

# Non-interactive SSH sessions don't read .bashrc, so node/pm2 installed via nvm may be missing from PATH
if ! command -v pm2 >/dev/null 2>&1; then
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    set +eu
    # shellcheck disable=SC1091
    . "$NVM_DIR/nvm.sh"
    set -eu
  fi
fi

command -v node >/dev/null 2>&1 || fail "node not found in PATH"
command -v pm2 >/dev/null 2>&1 || fail "pm2 not found in PATH"
[ -f "$ENV_FILE" ] || fail "missing $ENV_FILE"
[ -f "$ARCHIVE" ] || fail "missing archive $ARCHIVE"
[ -e "$RELEASE_DIR" ] && fail "release $RELEASE_ID already exists"

log "Extracting release $RELEASE_ID"
mkdir -p "$RELEASE_DIR"
tar -xzf "$ARCHIVE" -C "$RELEASE_DIR"
rm -f "$ARCHIVE"

PREVIOUS_RELEASE=""
if [ -L "$APP_DIR/current" ]; then
  PREVIOUS_RELEASE="$(readlink "$APP_DIR/current")"
fi

start_app() {
  pm2 startOrReload "$APP_DIR/current/ecosystem.config.js" --update-env
}

check_health() {
  local deadline=$((SECONDS + HEALTH_TIMEOUT_SECONDS))

  while [ "$SECONDS" -lt "$deadline" ]; do
    if curl -fsS --max-time 5 "$HEALTH_URL" >/dev/null 2>&1; then
      return 0
    fi
    sleep 2
  done

  return 1
}

LEGACY_DELETED=false

rollback() {
  if [ -n "$PREVIOUS_RELEASE" ]; then
    log "Rolling back to $PREVIOUS_RELEASE"
    ln -sfn "$PREVIOUS_RELEASE" "$APP_DIR/current"
    start_app || true
  elif [ "$LEGACY_DELETED" = true ]; then
    log "Restarting legacy pm2 process $LEGACY_PM2_NAME"
    pm2 delete "$PM2_APP" >/dev/null 2>&1 || true
    rm -f "$APP_DIR/current"
    pm2 start pnpm --name "$LEGACY_PM2_NAME" --cwd "$APP_DIR" -- start || true
  else
    log "No previous release to roll back to"
    return
  fi

  pm2 save || true
  rm -rf "$RELEASE_DIR"
}

log "Switching current -> releases/$RELEASE_ID"
ln -sfn "releases/$RELEASE_ID" "$APP_DIR/current"

if [ -n "$LEGACY_PM2_NAME" ] && pm2 describe "$LEGACY_PM2_NAME" >/dev/null 2>&1; then
  log "Removing legacy pm2 process $LEGACY_PM2_NAME"
  pm2 delete "$LEGACY_PM2_NAME"
  LEGACY_DELETED=true
fi

log "Starting $PM2_APP"
if ! start_app || ! check_health; then
  log "Health check failed: $HEALTH_URL"
  pm2 logs "$PM2_APP" --lines 50 --nostream || true
  rollback
  fail "release $RELEASE_ID was not activated"
fi

pm2 save

log "Pruning old releases (keeping $KEEP_RELEASES)"
CURRENT_TARGET="$(readlink "$APP_DIR/current")"
# Release ids start with a UTC timestamp, so a reverse name sort is newest first
find "$RELEASES_DIR" -mindepth 1 -maxdepth 1 -type d -exec basename {} \; \
  | sort -r \
  | tail -n +$((KEEP_RELEASES + 1)) \
  | while read -r old_release; do
      if [ "releases/$old_release" != "$CURRENT_TARGET" ]; then
        rm -rf "${RELEASES_DIR:?}/$old_release"
      fi
    done

log "Release $RELEASE_ID is live"
