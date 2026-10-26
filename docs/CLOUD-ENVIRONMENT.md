# Reusable cloud setup

The cloud environment's `install_script` and `start_skill` fields were saved as a configuration draft. This does not execute commands or publish a snapshot. To activate that reusable cloud configuration, review and save the changes in environment settings, then publish the **cloud environment**. This is separate from public game deployment; no website deployment is authorized or enabled.

The current instance was installed and validated directly. The saved installation script is:

```bash
#!/usr/bin/env bash
set -euo pipefail
cd /workspace/reppublic-of-chickens
npm ci --no-fund
npm run build
```

Saved startup guidance uses the existing isolated checkout, without creating a worktree unless explicitly requested. Start local play with `python3 scripts/play-release.py --port 4173` or development with `npm run dev -- --port 5173`; reuse a healthy existing service where appropriate. Live processes must restart in a new task. Verify an HTTP response and meaningful browser interaction, not just an open port.

`npm run check` runs the logic tests, production build and browser checks. Node 24, npm, Python 3 and system Chromium were present in the verified instance. No runtime application secrets, accounts, databases or external services are required. Existing network policy and repository membership were preserved.

Future game changes must preserve the approved visual target, five real activities, bilingual content, permanent milestones, latest-round satisfaction and unresolved ending. Public deployment continues to require the user's separate explicit authorization.
