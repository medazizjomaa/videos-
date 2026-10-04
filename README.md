# videos-

## MERCHATI promo (Remotion, light mode, 60 s)
- `merchati-video/out/merchati-9x16.mp4`: Reels / TikTok, 1080×1920, with music + voice-over
- `merchati-video/out/merchati-1x1.mp4`: Feed, 1080×1080, with music + voice-over
- `merchati-video/voiceover-darija.md`: timed Tunisian Darija voice-over script

### Voice-over (female Tunisian voice, Gemini TTS)
The video includes it. To regenerate: put your Gemini API key in `GEMINI_API_KEY` (never commit it), then
`python3 scripts/voiceover_gemini.py --batch` (one request: all lines read in one go, then split using Gemini alignment).
Lines and timings live in that script; `VOICEOVER` in `src/config.ts` turns it on/off.

### Re-render
`cd merchati-video && npm install && npx remotion render Merchati9x16 out/merchati-9x16.mp4`
