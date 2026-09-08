#!/usr/bin/env bash
# Runs on the target server (via git pull, not templated through CI) to finish
# the backend half of a deploy: PHP dependency install and the /api symlink.
#
# composer runs with --ignore-platform-reqs because this host's SSH/CLI PHP
# is an older version than the one actually serving the site over HTTP --
# composer itself works fine on the older PHP, it just refuses by default
# once it sees the app's composer.json wants a newer one. Since composer
# install only needs to write files (not execute the app's own code), this
# is safe. Migrations and cache-building are NOT run here for the same
# reason -- they boot the actual Laravel framework code, which needs the
# real PHP version -- so they instead run over HTTP via the
# /api/deploy-finalize/{secret} route, hitting the web server's PHP.
#
# Invoked as: bash deploy/backend.sh <web-root-path>
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
WEB_ROOT="$1"

if [ -z "$WEB_ROOT" ]; then
  echo "Usage: $0 <web-root-path>" >&2
  exit 1
fi

if [ ! -f "$WEB_ROOT/.htaccess" ]; then
  cat > "$WEB_ROOT/.htaccess" <<'HTACCESS'
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_URI} ^/api [NC]
RewriteRule ^ - [L]
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule ^ index.html [L]
HTACCESS
fi

cd "$APP_DIR/backend"

COMPOSER_BIN="$(command -v composer)"
composer_php="$(command -v php || command -v lsphp)"
"$composer_php" "$COMPOSER_BIN" install --no-dev --optimize-autoloader --ignore-platform-reqs

ln -sfn "$APP_DIR/backend/public" "$WEB_ROOT/api"
