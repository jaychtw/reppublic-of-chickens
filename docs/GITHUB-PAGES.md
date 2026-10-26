# GitHub Pages — deployed and verified

The user authorized public release of accepted commit `4ad62e0`. The site is live at **https://jaychtw.github.io/reppublic-of-chickens/**. Deployment and public verification succeeded in [workflow run 40372417744](https://github.com/jaychtw/reppublic-of-chickens/actions/runs/40372417744). See [the deployment record](DEPLOYMENT.md).

The separate manual workflow `.github/workflows/pages.yml` checks out the exact accepted commit, verifies the existing ZIP checksum, and deploys that archive without rebuilding or changing the game. It uses the official configure/upload/deploy Pages actions and grants Pages/OIDC permissions only to the deployment job. It then verifies the actual public URL using hosted Chromium. The CI workflow still only validates and uploads local-play artifacts.

The production build uses relative asset URLs and hash navigation, so it supports a GitHub Pages repository path without editing the game code. The current remote repository is `jaychtw/reppublic-of-chickens` (with the existing double-p spelling). The game and package use the correct display title **Republic of Chickens / 雞窩共和國**. Do not rename or create a remote repository merely to fix the display name.

The following preparation instructions were completed for this authorized release:

1. Run `npm ci`, `npm run check`, and `npm run release` on the intended commit.
2. Confirm that the bounded acceptance/playtest and any required editorial work are complete. The status-quo quotation needs attribution/rights review before a commercial release.
3. In repository Settings → Pages, choose GitHub Actions as the deployment source.
4. Add a separately authorized deployment workflow using `actions/configure-pages`, `actions/upload-pages-artifact` with `path: dist`, and `actions/deploy-pages`. Grant `pages: write` and `id-token: write` only to that deployment job; use the `github-pages` environment and a manual `workflow_dispatch` trigger.
5. Deploy the reviewed build and verify the site's five hall entrances, assets and language toggle under its repository path. A browser save belongs to its site origin; import a local backup to carry local progress over.

The deployed content remains the user's accepted v1.0 archive. Existing visual and device-testing limitations are accepted; no new game features or visual iterations were introduced. The project is completed and closed. The manual workflow remains pinned to this accepted release.
