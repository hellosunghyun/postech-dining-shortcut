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
  find shortcuts/src -maxdepth 1 -type f -name "*.shortcut" -delete
  cherri "$source" "${args[@]}"
  stem="$(basename "$source" .cherri)"
  case "$stem" in
    postech-breakfast) output_name="postech-breakfast.shortcut" ;;
    postech-lunch) output_name="postech-lunch.shortcut" ;;
    postech-dinner) output_name="postech-dinner.shortcut" ;;
    postech-all) output_name="postech-all.shortcut" ;;
    *) output_name="${stem}.shortcut" ;;
  esac
  if [[ "$mode" == "unsigned" ]]; then
    output_name="${output_name%.shortcut}_unsigned.shortcut"
  fi
  generated="$(find shortcuts/src -maxdepth 1 -type f -name "*.shortcut" -print -quit)"
  if [[ -z "$generated" ]]; then
    echo "No shortcut output found for $source" >&2
    exit 1
  fi
  mv "$generated" "$out_dir/$output_name"
done
