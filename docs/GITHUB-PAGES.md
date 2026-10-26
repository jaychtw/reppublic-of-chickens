# Prepare now; deploy only after authorization

No Pages deployment has been performed. The active CI workflow only builds, tests and uploads a local-play artifact. It has read-only repository permissions and contains no deployment job. The prepared ZIP can be played locally without GitHub Pages.

The production build uses relative asset URLs and hash navigation, so it supports a GitHub Pages repository path without editing the game code. The current remote repository is `jaychtw/reppublic-of-chickens` (with the existing double-p spelling). The game and package use the correct display title **Republic of Chickens / 雞窩共和國**. Do not rename or create a remote repository merely to fix the display name.

After the user explicitly authorizes public deployment:

1. Run `npm ci`, `npm run check`, and `npm run release` on the intended commit.
2. Confirm that the bounded acceptance/playtest and any required editorial work are complete. The status-quo quotation needs attribution/rights review before a commercial release.
3. In repository Settings → Pages, choose GitHub Actions as the deployment source.
4. Add a separately authorized deployment workflow using `actions/configure-pages`, `actions/upload-pages-artifact` with `path: dist`, and `actions/deploy-pages`. Grant `pages: write` and `id-token: write` only to that deployment job; use the `github-pages` environment and a manual `workflow_dispatch` trigger.
5. Deploy the reviewed build and verify the site's five hall entrances, assets and language toggle under its repository path. A browser save belongs to its site origin; import a local backup to carry local progress over.

The local ZIP, a source push, a passing CI job and an uploaded CI artifact do not constitute a deployed public game. No public playable URL is asserted by this handoff.
