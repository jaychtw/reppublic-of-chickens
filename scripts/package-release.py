#!/usr/bin/env python3
"""Package the built static site and a local launcher, without deploying anything."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from hashlib import sha256

root = Path(__file__).resolve().parent.parent
dist = root / "dist"
assert (dist / "index.html").is_file(), "Run npm run build first"
out = root / "release"
out.mkdir(exist_ok=True)
archive = out / "republic-of-chickens-v1.0.zip"
with ZipFile(archive, "w", compression=ZIP_DEFLATED, compresslevel=9) as package:
    for path in sorted(dist.rglob("*")):
        if path.is_file():
            package.write(path, path.relative_to(dist))
    package.write(root / "scripts/play-release.py", "play.py")
    package.write(root / "docs/LOCAL-PLAY.txt", "README.txt")
    package.write(root / "docs/THIRD-PARTY-NOTICES.md", "THIRD-PARTY-NOTICES.md")
    package.write(root / "docs/VISUAL-AND-RELEASE-NOTES.md", "RELEASE-NOTES.md")
    for name in ["fraunces", "noto-sans-tc"]:
        package.write(root / f"node_modules/@fontsource/{name}/LICENSE", f"licenses/{name}-OFL.txt")
(out / "SHA256SUMS.txt").write_text(f"{sha256(archive.read_bytes()).hexdigest()}  {archive.name}\n")
print(f"Packaged {archive.name}: {archive.stat().st_size:,} bytes; SHA-256 saved to release/SHA256SUMS.txt")
