"""Generates the Tunisian Darija voice-over (female, Microsoft ar-TN-ReemNeural) timed to the video.

Needs network access to speech.platform.bing.com.
Usage: python3 scripts/voiceover.py public/audio/voiceover.wav
Then set VOICEOVER = true in src/config.ts and re-render.
"""
import asyncio
import io
import subprocess
import sys

import certifi
import numpy as np
from scipy.io import wavfile

# Use the environment's proxy CA bundle (TLS verification stays on).
certifi.where = lambda: '/root/.ccr/ca-bundle.crt'
import edge_tts  # noqa: E402

VOICE = 'ar-TN-ReemNeural'
SR = 44100
DUR = 60.0

# (start second, text) — Tunisian Darija in Arabic script
LINES = [
    (0.4, 'كوموند، ريزرفاسيون، ميساجات… الكل في وقت واحد.'),
    (5.3, 'إنستغرام، ماسنجر، السيت… ما تلحقش تجاوب الكل.'),
    (10.4, 'كل جواب متأخر… كليان مشى لغيرك.'),
    (16.5, 'هذا مرشاتي، الإمبلوايي الذكي متاعك.'),
    (20.4, 'يجاوب على كل ميساج بالدارجة، في ثواني، ليل ونهار.'),
    (24.5, 'ياخذ الكوموند، ويفهم حتى الفوكال.'),
    (29.9, 'وإنت يجيك تنبيه طول على تيليغرام.'),
    (33.2, 'الكوموندات الكل في داشبورد وحدة.'),
    (38.9, 'للريستو، يبعث لينك الحجز، والكليان يختار طاولتو وحدو.'),
    (45.4, 'وكل ريزرفاسيون توصلك في الحين.'),
    (51.2, 'للإيكومرس، يبدا من خمسين دينار في الشهر. وللريستو، يبدا من ستين دينار.'),
    (56.8, 'مرشاتي. جرّب سبعة أيام بلاش.'),
]


def trim(clip, pad=0.04):
    """Drops the TTS engine's leading/trailing silence."""
    idx = np.where(np.abs(clip) > 0.01)[0]
    if not len(idx):
        return clip
    p = int(pad * SR)
    return clip[max(0, idx[0] - p) : idx[-1] + p]


def fit(clip, room):
    """Speeds a line up (pitch-preserving) just enough to end before the next one."""
    tempo = len(clip) / SR / room
    if tempo <= 1:
        return clip
    if tempo > 1.15:
        print(f'warning: speeding a line up x{tempo:.2f}')
    pcm = subprocess.run(
        ['ffmpeg', '-loglevel', 'error', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-i', 'pipe:0',
         '-af', f'atempo={tempo:.4f}', '-f', 'f32le', 'pipe:1'],
        input=clip.astype(np.float32).tobytes(), capture_output=True, check=True,
    ).stdout
    return np.frombuffer(pcm, np.float32)


async def synth(text):
    buf = io.BytesIO()
    async for chunk in edge_tts.Communicate(text, VOICE, rate='+4%').stream():
        if chunk['type'] == 'audio':
            buf.write(chunk['data'])
    pcm = subprocess.run(
        ['ffmpeg', '-loglevel', 'error', '-i', 'pipe:0', '-f', 's16le', '-ac', '1', '-ar', str(SR), 'pipe:1'],
        input=buf.getvalue(), capture_output=True, check=True,
    ).stdout
    return np.frombuffer(pcm, np.int16).astype(np.float32) / 32768


async def main(out):
    track = np.zeros(int(SR * DUR), np.float32)
    for i, (t0, text) in enumerate(LINES):
        nxt = LINES[i + 1][0] if i + 1 < len(LINES) else DUR
        room = nxt - t0 - 0.15
        clip = fit(trim(await synth(text)), room)
        a = int(t0 * SR)
        clip = clip[: len(track) - a]
        track[a : a + len(clip)] += clip
    track /= max(1e-6, np.max(np.abs(track))) / 0.9
    wavfile.write(out, SR, np.stack([track, track], 1))
    print('wrote', out)


asyncio.run(main(sys.argv[1]))
