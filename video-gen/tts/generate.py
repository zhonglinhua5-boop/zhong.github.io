"""
Read content JSON, synthesize per-scene audio with Edge TTS,
measure each mp3 duration, and emit props.json for Remotion
(with durationFrames for each scene and audio path).

Usage:
    python tts/generate.py \\
        --content content/demo.json \\
        --audio-dir public/audio \\
        --out out/props.json \\
        --fps 30
"""
from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
from pathlib import Path

import edge_tts
from mutagen.mp3 import MP3

FPS = 30
DEFAULT_VOICE = "en-US-AndrewMultilingualNeural"
DEFAULT_RATE = "+17%"
TAIL_SECONDS = 0.15  # small tail after narration


async def synth(text: str, voice: str, rate: str, out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    communicate = edge_tts.Communicate(text, voice=voice, rate=rate)
    await communicate.save(str(out_path))


def duration_seconds(mp3_path: Path) -> float:
    return MP3(str(mp3_path)).info.length


async def run(args: argparse.Namespace) -> None:
    content = json.loads(Path(args.content).read_text(encoding="utf-8"))
    voice = content.get("voice", DEFAULT_VOICE)
    rate = content.get("rate", DEFAULT_RATE)
    scenes = content["scenes"]

    audio_dir = Path(args.audio_dir)
    # Path inside the `public/` directory that Remotion serves as staticFile.
    # We write to <public-root>/<audio_dir_name>/... and the prop stores the
    # relative path starting with <audio_dir_name>/....
    audio_rel_root = audio_dir.name  # e.g. "audio"
    audio_dir.mkdir(parents=True, exist_ok=True)

    props_scenes = []
    for i, scene in enumerate(scenes):
        narration = scene.get("narration") or scene.get("caption") or scene.get("title")
        mp3_name = f"scene_{i:02d}.mp3"
        mp3_path = audio_dir / mp3_name
        print(f"[TTS] Scene {i}: {narration[:60]!r} -> {mp3_path}", file=sys.stderr)
        await synth(narration, voice, rate, mp3_path)
        dur = duration_seconds(mp3_path)
        frames = int(round((dur + TAIL_SECONDS) * args.fps))
        # Enforce minimum so empty/short scenes still play
        frames = max(frames, int(args.fps * 2))

        out_scene = dict(scene)
        out_scene["audio"] = f"{audio_rel_root}/{mp3_name}"
        out_scene["durationFrames"] = frames
        # Drop narration from final props (not used by Remotion directly)
        out_scene.pop("narration", None)
        props_scenes.append(out_scene)

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    props = {"scenes": props_scenes}
    out_path.write_text(json.dumps(props, indent=2, ensure_ascii=False), encoding="utf-8")

    total_sec = sum(s["durationFrames"] for s in props_scenes) / args.fps
    print(f"[TTS] Done. Total: {total_sec:.1f}s across {len(props_scenes)} scenes.", file=sys.stderr)
    print(f"[TTS] Props written to {out_path}", file=sys.stderr)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--content", required=True)
    parser.add_argument("--audio-dir", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--fps", type=int, default=FPS)
    args = parser.parse_args()
    asyncio.run(run(args))


if __name__ == "__main__":
    main()
