#!/usr/bin/env python3
"""Add verified, public GitHub Release assets to the download page."""

import argparse
import json
import re
from pathlib import Path
from urllib.request import Request, urlopen


REPO = "Longdabo/nasfilem-site"
CONFIG = Path(__file__).resolve().parents[1] / "assets/releases.js"
ASSIGNMENT = "window.beaverNasReleases = "
PLATFORMS = {
    "mac": ("BeaverNAS-macOS-AppleSilicon.dmg", "下载 DMG", "Apple 芯片"),
    "windows": ("BeaverNAS-Windows-x64-Setup.exe", "下载 EXE", "x64"),
    "linux-deb": ("BeaverNAS-Linux-amd64.deb", "下载 DEB", "x64"),
    "linux-appimage": ("BeaverNAS-Linux-x86_64.AppImage", "下载 AppImage", "x64"),
    "android": ("BeaverNAS-Android.apk", "下载 APK", "通用 APK"),
    "android-tv": ("BeaverNAS-Android.apk", "下载 APK", "通用 APK"),
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("tag", help="Tag of the published release, for example v1.0.0")
    parser.add_argument("platform", nargs="+", choices=PLATFORMS)
    args = parser.parse_args()
    tag = args.tag
    if not re.fullmatch(r"v[0-9]+(?:\.[0-9]+){2}", tag):
        parser.error("Use a stable release tag such as v1.0.0.")

    with urlopen(f"https://api.github.com/repos/{REPO}/releases/tags/{tag}", timeout=30) as response:
        release = json.load(response)
    if release["tag_name"] != tag or release["draft"] or release["prerelease"]:
        parser.error("The release must be public and stable.")

    assets = {asset["name"]: asset for asset in release["assets"]}
    prefix, previous = CONFIG.read_text(encoding="utf-8").split(ASSIGNMENT, 1)
    channels = json.loads(previous.strip().removesuffix(";"))
    download_root = f"https://github.com/{REPO}/releases/download/"
    for platform in dict.fromkeys(args.platform):
        name, label, arch = PLATFORMS[platform]
        url = f"{download_root}{tag}/{name}"
        asset = assets.get(name, {})
        digest = re.fullmatch(r"sha256:([a-f0-9]{64})", asset.get("digest") or "")
        if (asset.get("state") != "uploaded" or asset.get("browser_download_url") != url
                or not digest or not asset.get("size")):
            parser.error(f"Missing published asset or SHA-256: {name}")
        with urlopen(Request(url, method="HEAD"), timeout=30) as response:
            length = response.headers.get("Content-Length")
            if length and int(length) != asset["size"]:
                parser.error(f"Download size differs from release metadata: {name}")
        size = asset["size"] / (1024 * 1024)
        entry = dict(label=label, url=url, details=f"{tag[1:]} · {arch} · {size:.1f} MiB",
                     sha256=digest.group(1))
        existing = channels.get(platform, [])
        channels[platform] = [item for item in existing if not item["url"].startswith(download_root)]
        channels[platform].append(entry)

    CONFIG.write_text(prefix + ASSIGNMENT + json.dumps(channels, ensure_ascii=False, indent=2) + ";\n",
                      encoding="utf-8")


if __name__ == "__main__":
    main()
