#!/usr/bin/env bash
set -euo pipefail

echo "==> Python: $(python --version)"

MAJOR=$(python -c "import sys; print(sys.version_info.major)")
MINOR=$(python -c "import sys; print(sys.version_info.minor)")

if [ "$MAJOR" != "3" ] || [ "$MINOR" != "11" ]; then
  echo "ERROR: Python 3.11 required. Set PYTHON_VERSION=3.11.9 in Render Environment."
  echo "       Dashboard → Environment → Add PYTHON_VERSION = 3.11.9"
  exit 1
fi

pip install --upgrade pip
pip install -r requirements.txt

echo "==> Build OK"
