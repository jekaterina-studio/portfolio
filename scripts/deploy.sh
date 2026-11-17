#!/usr/bin/env bash
# Build the site and publish it to jekaterina-studio/portfolio (main branch).
# Cloudflare Pages serves main on jekaterina.eu: every push goes online in a minute or two.
# Usage: scripts/deploy.sh "commit message"
# REMOTE defaults to ../portfolio-remote, a clone of github.com/jekaterina-studio/portfolio.
set -euo pipefail
cd "$(dirname "$0")/.."
MSG="${1:?commit message required}"
REMOTE="${REMOTE:-../portfolio-remote}"
npm run build
rm -rf .deploy && python3 scripts/relativize.py dist .deploy >/dev/null
# mirror the built site into the repo clone, keeping its .git folder and README
rsync -a --delete --exclude .git --exclude README.md .deploy/ "$REMOTE"/
cd "$REMOTE"
git add -A
if git diff --cached --quiet; then echo "nothing to publish"; exit 0; fi
git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -q -m "$MSG

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01B7KowTEw4xtxhjSX8a81SA"
git -c push.negotiate=true push origin main
