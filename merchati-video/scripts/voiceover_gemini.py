"""Tunisian Darija voice-over with Gemini TTS (female voice "Sulafat"), timed to the video.

Reads the API key from $GEMINI_API_KEY or ~/.config/merchati/gemini_api_key (never commit it).
Writes public/audio/voiceover.wav and src/voiceoverSegments.ts (used to duck the music).
Usage: python3 scripts/voiceover_gemini.py
Free tier allows 3 TTS requests/minute, so requests are paced.
"""
import base64
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
import wave

import numpy as np
from scipy.io import wavfile

MODEL = os.environ.get('TTS_MODEL', 'gemini-3.8-flash-tts')
VOICE = os.environ.get('TTS_VOICE', 'Sulafat')
SR = 44100
DUR = 60.0
PACE = 21  # seconds between requests (free tier: 3/min)
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CACHE = os.path.join(ROOT, 'out', 'vo_cache')

KEY = os.environ.get('GEMINI_API_KEY') or open(os.path.expanduser('~/.config/merchati/gemini_api_key')).read().strip()

# This exact phrasing reads only the line (longer "speak only..." prompts get read aloud).
DIRECTION = (
    'Read this in authentic Tunisian Darija, with a natural Tunisian accent (not Egyptian, not Levantine, not Modern Standard Arabic). '
    'Young Tunisian woman, warm, confident and modern, like a premium tech brand ad. Natural pace, clear diction:'
)

# (start second, latest end second, text): Tunisian Darija in Arabic script
LINES = [
    (0.4, 4.9, 'كوموند، ريزرفاسيون، ميساجات… الكل في وقت واحد.'),
    (5.3, 9.9, 'إنستغرام، ماسنجر، السيت… ما تلحقش تجاوب الكل.'),
    (10.4, 14.9, 'كل جواب يتأخر… كليان يمشي لغيرك.'),
    (16.4, 20.2, 'هذا ميرشاتي، الإمبلوايي الذكي متاعك.'),
    (20.4, 24.4, 'يجاوب على كل ميساج بالدارجة، ليل ونهار.'),
    (24.6, 29.6, 'يوري البرودوي، ياخذ الكوموند، ويفهم حتى الفوكال.'),
    (29.9, 32.9, 'ويجيك تنبيه طول على تيليغرام.'),
    (33.2, 38.6, 'الكوموندات الكل في داشبورد وحدة.'),
    (38.9, 45.0, 'للريستو، يبعث لينك الحجز، والكليان يختار طاولتو وحدو.'),
    (45.4, 49.9, 'وكل ريزرفاسيون توصلك في الحين.'),
    (52.0, 56.4, 'الإيكومرس يبدا من خمسين دينار في الشهر، والريستو من ستين.'),
    (56.6, 59.6, 'ميرشاتي. جرّب سبعة أيام بلاش.'),
]


def tts(text):
    body = {
        'contents': [{'parts': [{'text': f'{DIRECTION}\n{text}'}]}],
        'generationConfig': {
            'responseModalities': ['AUDIO'],
            'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': VOICE}}},
        },
    }
    req = urllib.request.Request(
        f'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent',
        data=json.dumps(body).encode(),
        headers={'Content-Type': 'application/json', 'x-goog-api-key': KEY},
    )
    resp = json.load(urllib.request.urlopen(req, timeout=180))
    part = resp['candidates'][0]['content']['parts'][0]['inlineData']
    data = base64.b64decode(part['data'])
    i = data.find(b'RIFF')
    if i >= 0:
        data = data[i:]
        tmp = os.path.join(CACHE, '_tmp.wav')
        open(tmp, 'wb').write(data)
        with wave.open(tmp) as w:
            rate, pcm = w.getframerate(), w.readframes(w.getnframes())
    else:
        mime = part.get('mimeType', '')
        rate, pcm = (int(mime.split('rate=')[-1].split(';')[0]) if 'rate=' in mime else 24000), data
    return rate, np.frombuffer(pcm, np.int16).astype(np.float32) / 32768


def trim(x, rate, thr=0.012):
    idx = np.where(np.abs(x) > thr)[0]
    if len(idx) == 0:
        return x
    a, b = max(0, idx[0] - int(0.03 * rate)), min(len(x), idx[-1] + int(0.08 * rate))
    return x[a:b]


def resample_tempo(x, rate, tempo):
    """Resample to SR and optionally speed up (pitch preserved) with ffmpeg."""
    src = os.path.join(CACHE, '_in.wav')
    wavfile.write(src, rate, (x * 32767).astype(np.int16))
    af = f'atempo={tempo:.3f},' if tempo > 1.001 else ''
    out = subprocess.run(
        ['ffmpeg', '-loglevel', 'error', '-i', src, '-af', f'{af}aresample={SR}', '-f', 's16le', '-ac', '1', 'pipe:1'],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(out, np.int16).astype(np.float32) / 32768


def split_batch(x, rate, texts):
    """Split one long read into lines: expected boundaries come from character counts,
    each cut snaps to the nearest pause."""
    hop = int(0.02 * rate)
    env = np.array([np.sqrt(np.mean(x[i : i + hop] ** 2)) for i in range(0, len(x) - hop, hop)])
    voiced = np.where(env > 0.01)[0]
    v0, v1 = voiced[0], voiced[-1]
    quiet = env < max(0.006, np.percentile(env[v0:v1], 15) * 1.6)
    gaps, i = [], v0
    while i < v1:
        if quiet[i]:
            j = i
            while j < v1 and quiet[j]:
                j += 1
            if j - i >= 6:  # >= 120 ms
                gaps.append(((i + j) // 2, j - i))
            i = j
        else:
            i += 1
    weights = np.array([len(t.replace(' ', '')) + 6 for t in texts], float)
    expected = v0 + np.cumsum(weights)[:-1] / weights.sum() * (v1 - v0)
    cuts, used = [], set()
    for e in expected:
        # prefer long pauses close to the expected boundary
        best = min((g for g in gaps if g[0] not in used), key=lambda g: abs(g[0] - e) / (1 + g[1] / 10))
        used.add(best[0])
        cuts.append(best[0])
    cuts = sorted(cuts)
    edges = [0] + [c * hop for c in cuts] + [len(x)]
    return [trim(x[edges[k] : edges[k + 1]], rate) for k in range(len(texts))]


def align(path, texts):
    """Ask Gemini (audio understanding) for each line's start/end time in the batch read."""
    prompt = (
        'This audio is a woman reading these lines in order, in Tunisian Darija:\n'
        + '\n'.join(f'{i}. {t}' for i, t in enumerate(texts))
        + '\nReturn JSON {"lines":[{"i":0,"start":seconds,"end":seconds}, ...]} with precise times (2 decimals) '
        'where each line starts and ends, including its last word. Lines must not overlap.'
    )
    body = {
        'contents': [{'parts': [{'text': prompt}, {'inlineData': {'mimeType': 'audio/wav', 'data': base64.b64encode(open(path, 'rb').read()).decode()}}]}],
        'generationConfig': {'responseMimeType': 'application/json'},
    }
    req = urllib.request.Request(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
        data=json.dumps(body).encode(),
        headers={'Content-Type': 'application/json', 'x-goog-api-key': KEY},
    )
    r = json.load(urllib.request.urlopen(req, timeout=300))
    lines = json.loads(r['candidates'][0]['content']['parts'][0]['text'])['lines']
    return [(float(l['start']), float(l['end'])) for l in sorted(lines, key=lambda l: l['i'])]


def snap(x, rate, t, radius=0.3):
    """Move a cut to the quietest 20 ms window within +-radius seconds."""
    hop = int(0.02 * rate)
    c = int(t * rate)
    best, best_e = c, 1e9
    for p in range(max(0, c - int(radius * rate)), min(len(x) - hop, c + int(radius * rate)), hop // 2):
        e = float(np.mean(x[p : p + hop] ** 2))
        if e < best_e:
            best, best_e = p, e
    return best


def main():
    os.makedirs(CACHE, exist_ok=True)
    if '--batch' in sys.argv:
        missing = [n for n in range(len(LINES)) if not os.path.exists(os.path.join(CACHE, f'line{n:02d}_{VOICE}.wav'))]
        if missing:
            batch = os.path.join(CACHE, f'batch_{VOICE}.wav')
            if os.path.exists(batch):
                rate, x = wavfile.read(batch)
                x = x.astype(np.float32) / 32768
            else:
                rate, x = tts('\n\n'.join(LINES[n][2] for n in missing))
                wavfile.write(batch, rate, (x * 32767).astype(np.int16))
            texts = [LINES[n][2] for n in missing]
            times = align(batch, texts)
            print('alignment:', times, flush=True)
            cuts = [snap(x, rate, (times[k][1] + times[k + 1][0]) / 2) for k in range(len(times) - 1)]
            edges = [0] + cuts + [len(x)]
            parts = [trim(x[edges[k] : edges[k + 1]], rate) for k in range(len(texts))]
            for n, part in zip(missing, parts):
                print(f'line {n}: {len(part) / rate:.2f}s (room {LINES[n][1] - LINES[n][0]:.2f}s)', flush=True)
                wavfile.write(os.path.join(CACHE, f'line{n:02d}_{VOICE}.wav'), rate, (part * 32767).astype(np.int16))
    track = np.zeros(int(SR * DUR), np.float32)
    segments = []
    last_req = 0.0
    for n, (t0, t1, text) in enumerate(LINES):
        cache = os.path.join(CACHE, f'line{n:02d}_{VOICE}.wav')
        room = t1 - t0
        if os.path.exists(cache):
            rate, x = wavfile.read(cache)
            x = x.astype(np.float32) / 32768
        else:
            best = None
            for attempt in range(4):
                wait = PACE - (time.time() - last_req)
                if wait > 0:
                    time.sleep(wait)
                last_req = time.time()
                try:
                    rate, x = tts(text)
                except urllib.error.HTTPError as e:
                    msg = e.read().decode()[:200]
                    print(f'line {n}: HTTP {e.code} {msg}', flush=True)
                    if e.code in (429, 500, 503):
                        time.sleep(30)
                        continue
                    raise
                x = trim(x, rate)
                d = len(x) / rate
                print(f'line {n}: {d:.2f}s (room {room:.2f}s)', flush=True)
                if best is None or abs(d - room * 0.85) < abs(best[2] - room * 0.85):
                    best = (rate, x, d)
                # Too long means it likely repeated itself or read the direction: retry.
                if d <= room * 1.25:
                    break
            if best is None:
                sys.exit(f'line {n}: no audio')
            rate, x, _ = best
            wavfile.write(cache, rate, (x * 32767).astype(np.int16))
        d = len(x) / rate
        tempo = min(1.2, d / room) if d > room else 1.0
        y = resample_tempo(x, rate, tempo)
        a = int(t0 * SR)
        y = y[: len(track) - a]
        track[a : a + len(y)] += y
        segments.append([round(t0, 2), round(t0 + len(y) / SR, 2)])
        print(f'placed line {n} at {t0:.2f}s, {len(y) / SR:.2f}s (tempo {tempo:.2f})', flush=True)

    track /= max(1e-6, np.max(np.abs(track))) / 0.92
    out = os.path.join(ROOT, 'public', 'audio', 'voiceover.wav')
    wavfile.write(out, SR, (np.stack([track, track], 1) * 32767).astype(np.int16))
    with open(os.path.join(ROOT, 'src', 'voiceoverSegments.ts'), 'w') as f:
        f.write('// Generated by scripts/voiceover_gemini.py: seconds where the voice-over speaks.\n')
        f.write(f'export const VO_SEGMENTS: [number, number][] = {json.dumps(segments)};\n')
    print('wrote', out)


if __name__ == '__main__':
    main()
