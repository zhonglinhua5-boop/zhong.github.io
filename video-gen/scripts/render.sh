#!/usr/bin/env bash
# End-to-end video generation:
#   1. Run edge-tts over content JSON to produce audio + props
#   2. Remotion render MP4
#
# Usage:
#   bash scripts/render.sh [CONTENT_JSON] [OUTPUT_MP4]
# Defaults:
#   CONTENT_JSON = content/demo.json
#   OUTPUT_MP4   = out/output.mp4
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$HERE/.."

CONTENT_JSON="${1:-content/demo.json}"
OUTPUT_MP4="${2:-out/output.mp4}"

PROPS_JSON="out/props.json"
AUDIO_DIR="public/audio"

mkdir -p "out" "$AUDIO_DIR"

echo "[1/3] Generating TTS audio + scene durations"
python3 tts/generate.py \
    --content "$CONTENT_JSON" \
    --audio-dir "$AUDIO_DIR" \
    --out "$PROPS_JSON" \
    --fps 30

# Also copy content.json to public/ so demo.props.json default resolves
# The Root reads a bundled demo.props.json; we overwrite that at render time
cp "$PROPS_JSON" "content/demo.props.json"

echo "[2/3] Rendering MP4 with Remotion"
npx remotion render Main "$OUTPUT_MP4" \
    --codec=h264 \
    --props="$PROPS_JSON" \
    --concurrency=1 \
    --log=info

echo "[3/3] Done. Output: $OUTPUT_MP4"
ls -lh "$OUTPUT_MP4"
