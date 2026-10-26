#!/usr/bin/env python3
"""Serve the bundled static game locally; no third-party Python packages needed."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse

here = Path(__file__).resolve().parent
root = here if (here / "index.html").is_file() else here.parent / "dist"
parser = argparse.ArgumentParser(description="Play Republic of Chickens locally")
parser.add_argument("--port", type=int, default=4173)
args = parser.parse_args()
if not (root / "index.html").is_file():
    parser.error("Build the game first with npm run build, or run this inside the extracted release.")
with ThreadingHTTPServer(("127.0.0.1", args.port), partial(SimpleHTTPRequestHandler, directory=str(root))) as server:
    print(f"Republic of Chickens · 雞窩共和國\nOpen http://127.0.0.1:{args.port}\nCtrl+C stops the server.", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
