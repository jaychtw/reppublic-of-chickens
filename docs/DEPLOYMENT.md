# Republic of Chickens v1.0 — completed and closed

**Public URL: https://jaychtw.github.io/reppublic-of-chickens/**

Status: **deployed and verified**, following the user's explicit release authorization. The existing repository name is preserved.

- Accepted game commit: `4ad62e03ef16242b995105e2e5c0c7caf63b9d73`.
- Deployment workflow commit: `9aff74157d7c5cf7305080cbb87cf9f5045d0626`.
- [Successful deployment and public-browser verification run](https://github.com/jaychtw/reppublic-of-chickens/actions/runs/40372417744).
- Accepted archive SHA-256: `b30167ccd42f5b73a1b589ea5dcc67d81c48b648328c24c8dd555d009e09fe8a`.

The manual Pages workflow checks out the exact accepted game commit and deploys its checksum-verified prebuilt archive. It does not rebuild the game or publish later application changes. No new game features or visual iterations were introduced.

## Public verification

The GitHub-hosted Chromium verification step completed successfully after deployment:

- Public homepage returns HTTP 200 and exposes all five hall entrances.
- Town, Mess, Social, Residential and Welfare Hall navigation works, including reloading each hall's hash route and returning to the republic.
- A Town Hall dialogue advance works on the public site.
- All five production artwork files resolve with image responses.
- Switching to Traditional Chinese persists after reload and displays **雞窩共和國**.
- No failed asset responses or JavaScript page errors were reported by the hosted verification.

Independent HTTPS requests from the cloud machine additionally confirmed HTTP 200 and exact SHA-256 matches with the accepted archive for the homepage, favicon, JavaScript entry, stylesheet and all five artwork files. The machine-readable record is [deployment-verification.json](deployment-verification.json).

Browser verification ran in GitHub's hosted Chromium. An additional browser attempt inside the cloud machine encountered its proxy certificate trust configuration, so that attempt is not used as evidence; certificate verification was not disabled. Independent HTTPS checks and the hosted browser checks succeeded.

The previously documented visual and device-testing limitations remain known and accepted v1.0 limitations. The original local-release test report and archive are preserved. The project is **completed and closed** as requested.
