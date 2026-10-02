# videos-

## MERCHATI promo (Remotion, light mode, 60 s)
- `merchati-video/out/merchati-9x16.mp4`: Reels / TikTok, 1080×1920, with music
- `merchati-video/out/merchati-1x1.mp4`: Feed, 1080×1080, with music
- `merchati-video/voiceover-darija.md`: timed Tunisian Darija voice-over script

### Voice-over (female Tunisian voice)
`python3 scripts/voiceover.py public/audio/voiceover.wav` (needs access to `speech.platform.bing.com`),
then set `VOICEOVER = true` in `src/config.ts` and re-render.

### Re-render
`cd merchati-video && npm install && npx remotion render Merchati9x16 out/merchati-9x16.mp4`
