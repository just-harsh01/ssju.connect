"""Compatibility launcher for the supported Node.js server.

The former Python backend is retired because it did not share Node's auth,
validation, and storage behavior. This entry point forwards to server.js.
"""
import os
import shutil
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
NODE = shutil.which("node")
if NODE is None:
    print("SSJU Connect requires Node.js. Install Node.js, then run: npm start", file=sys.stderr)
    raise SystemExit(1)
raise SystemExit(subprocess.call([NODE, os.path.join(BASE_DIR, "server.js")], cwd=BASE_DIR))
