#!/usr/bin/env bash
set -euo pipefail

mode="${1:-signed}"
out_dir="${2:-shortcuts/build}"

mkdir -p "$out_dir"

args=(--no-ansi --derive-uuids --share=anyone)
if [[ "$mode" == "unsigned" ]]; then
  args+=(--skip-sign)
fi

for source in shortcuts/src/*.cherri; do
  echo "Building $source"
  cherri "$source" "${args[@]}"
done

find shortcuts/src -maxdepth 1 -type f -name "*.shortcut" -exec mv {} "$out_dir/" \;
