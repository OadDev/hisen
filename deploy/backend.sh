#!/usr/bin/env bash
# Runs on the target server (via git pull, not templated through CI) to finish
# the backend half of a deploy: PHP dependency install, migrations, caches,
# and the /api symlink. Invoked as: bash deploy/backend.sh <web-root-path>
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

PHP_BIN=""
for candidate in php8.4 php8.3 php8.2 lsphp84 lsphp83 lsphp82; do
  if command -v "$candidate" >/dev/null 2>&1; then
    PHP_BIN="$(command -v "$candidate")"
    break
  fi
done

if [ -z "$PHP_BIN" ]; then
  for root in /opt /usr/local /usr/local/lsws "$HOME"; do
    for f in $(find "$root" -maxdepth 6 -type f -iname 'php8.*' 2>/dev/null) $(find "$root" -maxdepth 6 -type f -iname 'lsphp8*' 2>/dev/null); do
      [ -x "$f" ] || continue
      v=$("$f" -r 'echo PHP_VERSION;' 2>/dev/null) || continue
      case "$v" in 8.2*|8.3*|8.4*|8.5*|9.*) PHP_BIN="$f" ;; esac
      [ -n "$PHP_BIN" ] && break
    done
    [ -n "$PHP_BIN" ] && break
  done
fi

if [ -z "$PHP_BIN" ]; then
  echo "ERROR: No PHP 8.2+ binary found on PATH or under /opt, /usr/local, or $HOME." >&2
  echo "Available php-like commands on PATH:" >&2
  compgen -c | grep -i '^php\|^lsphp' | sort -u >&2 || true
  exit 1
fi
echo "Using PHP binary: $PHP_BIN"
"$PHP_BIN" -v

COMPOSER_BIN="$(command -v composer)"
"$PHP_BIN" "$COMPOSER_BIN" install --no-dev --optimize-autoloader
"$PHP_BIN" artisan migrate --force
"$PHP_BIN" artisan config:cache
"$PHP_BIN" artisan route:cache
"$PHP_BIN" artisan view:cache

ln -sfn "$APP_DIR/backend/public" "$WEB_ROOT/api"
