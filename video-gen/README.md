# video-gen

Auto-generated vertical (1080×1920, 30 fps) short videos.

- **Engine**: Remotion (React)
- **TTS**: Edge TTS, `en-US-AndrewMultilingualNeural`, `+17%` rate
- **Output**: H.264 MP4

## Local run (desktop)

```bash
cd video-gen
npm install
pip install -r tts/requirements.txt
bash scripts/render.sh
# Outputs: out/output.mp4
```

## Mobile trigger (GitHub Actions)

See `.github/workflows/generate-video.yml`.

1. Open GitHub → Actions tab on your phone
2. Pick **Generate Video** workflow
3. Click **Run workflow**, optionally paste content JSON
4. Wait ~3–10 min
5. Video URL posted in the workflow summary (also in `/videos/<timestamp>.mp4`)

## Content JSON shape

`content/demo.json` drives the video. Each scene:

```json
{
  "title": "...",         // big yellow title
  "subtitle": "...",      // white subtitle
  "cards": ["...", "..."],// up to 3 glass cards
  "highlight": { "value": "+37%", "label": "focus", "color": "#FFE500" },
  "caption": "...",       // bottom caption
  "narration": "...",     // spoken line for Edge TTS
  "accentColor": "#FFE500",
  "bgGradient": ["#1a0a2e", "#0b0f2a", "#0a1a2a"],
  "bgVideo": "videos/bg/forest.mp4"
}
```

Put Mixkit MP4s in `public/videos/bg/` and reference by path.

## Structure

```
video-gen/
├── content/demo.json          # editable script
├── content/demo.props.json    # last rendered props (auto-regenerated)
├── public/audio/              # TTS mp3s (generated)
├── public/videos/bg/          # optional Mixkit backgrounds
├── src/                       # Remotion React components
├── tts/generate.py            # Edge TTS + duration measurement
└── scripts/render.sh          # full pipeline
```
