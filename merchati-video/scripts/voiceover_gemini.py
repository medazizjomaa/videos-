"""Generates the Tunisian Darija + French voice-over with Gemini TTS, timed to the video.

The whole script is spoken in ONE request (the free tier allows ~10 requests/day per model),
then split on the pauses between lines and each line is placed at its start time.

Key: GEMINI_API_KEY env var, or ~/.config/merchati/.env (never commit it).
Usage:
  python3 scripts/voiceover_gemini.py public/audio/voiceover.wav            # new take
  python3 scripts/voiceover_gemini.py public/audio/voiceover.wav --take t.wav  # re-time a saved take
  --skip SEC ignores the start of a take (if the model read the director's notes aloud).
Env: TTS_MODEL (default gemini-3.8-flash-tts, falls back to the lite model on quota errors), TTS_VOICE.
"""
import base64
import json
import os
import pathlib
import subprocess
import sys
import urllib.error
import urllib.request

import numpy as np
from scipy.io import wavfile

SR = 44100
DUR = 60.0
MODELS = [os.environ.get('TTS_MODEL', 'gemini-3.8-flash-tts'), 'gemini-3.8-flash-lite-tts']
PAUSE_BONUS = float(os.environ.get('PAUSE_BONUS', 8))
VOICE = os.environ.get('TTS_VOICE', 'Sulafat')

STYLE = (
    '### DIRECTOR\'S NOTES (do not read aloud)\n'
    'Read the transcript as a young woman from Tunis voicing an Instagram ad for a Tunisian startup: warm, '
    'confident, upbeat, natural. Speak authentic Tunisian Darija (not Modern Standard Arabic, not '
    'Moroccan or Egyptian) and code-switch into French exactly like Tunisians do: the words written '
    'in Latin letters are French and must be pronounced with a proper French accent (client = '
    '"kli-yan", commande, réservation, notification, dashboard). "Merchati" is the brand name, '
    'pronounced "mer-sha-ti". Pause for about one second between lines.\n\n'
    '#### TRANSCRIPT'
)

# (start second, text) — Darija in Arabic script, French in Latin script
LINES = [
    (0.4, 'Les commandes, les réservations, les messages… الكل في نفس الوقت!'),
    (5.3, 'Instagram, Messenger, le site… ما تلحقش تجاوب الكل.'),
    (10.4, 'وكل réponse تتأخر… هو client مشى لغيرك.'),
    (16.5, 'Voilà Merchati, l’employé intelligent متاعك.'),
    (20.4, 'يجاوب بالدارجة, en quelques secondes, ليل ونهار.'),
    (24.5, 'ياخو la commande, ويفهم حتى les vocaux.'),
    (29.9, 'وإنت, توصلك notification على Telegram.'),
    (33.2, 'Les commandes الكل, في dashboard واحد.'),
    (38.9, 'Pour les restos, يبعث le lien de réservation, و le client يختار la table متاعو وحدو.'),
    (45.4, 'وكل réservation توصلك en temps réel.'),
    (51.2, 'E-commerce, à partir de cinquante dinars par mois. Et les restos, à partir de soixante.'),
    (56.8, 'Merchati. جرّب sept jours, gratuit!'),
]


def api_key():
    if os.environ.get('GEMINI_API_KEY'):
        return os.environ['GEMINI_API_KEY']
    env = pathlib.Path.home() / '.config/merchati/.env'
    for line in env.read_text().splitlines():
        if line.startswith('GEMINI_API_KEY='):
            return line.split('=', 1)[1].strip()
    sys.exit('GEMINI_API_KEY not set')


def to_pcm(data, fmt_args):
    """Any audio bytes -> mono float32 @ SR."""
    pcm = subprocess.run(
        ['ffmpeg', '-loglevel', 'error', *fmt_args, '-i', 'pipe:0', '-f', 's16le', '-ac', '1', '-ar', str(SR), 'pipe:1'],
        input=data, capture_output=True, check=True,
    ).stdout
    return np.frombuffer(pcm, np.int16).astype(np.float32) / 32768


def tts():
    text = STYLE + '\n' + '\n'.join(t for _, t in LINES)
    body = json.dumps({
        'contents': [{'parts': [{'text': text}]}],
        'generationConfig': {
            'responseModalities': ['AUDIO'],
            'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': VOICE}}},
        },
    }).encode()
    for model in MODELS:
        req = urllib.request.Request(
            f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
            body, {'Content-Type': 'application/json', 'x-goog-api-key': api_key()},
        )
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                d = json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                print(f'{model}: quota exhausted, trying next model')
                continue
            raise
        part = d['candidates'][0]['content']['parts'][0]['inlineData']
        raw = base64.b64decode(part['data'])
        print(f'{model} ({VOICE}): {part["mimeType"]}')
        if part['mimeType'].startswith('audio/l16') or part['mimeType'].startswith('audio/pcm'):
            return to_pcm(raw, ['-f', 's16le', '-ar', '24000', '-ac', '1'])
        return to_pcm(raw, [])
    sys.exit('all TTS models are out of quota')


def pauses(take, min_len=0.2):
    """(start, end) seconds of every pause of at least min_len."""
    hop = int(0.02 * SR)
    quiet = np.array([np.abs(take[i : i + hop]).max() < 0.02 for i in range(0, len(take) - hop, hop)])
    out, i = [], 0
    while i < len(quiet):
        j = i
        while j < len(quiet) and quiet[j] == quiet[i]:
            j += 1
        if quiet[i] and (j - i) * 0.02 >= min_len:
            out.append((i * 0.02, j * 0.02))
        i = j
    return out


def split(take, skip=0.0):
    """Cuts the take into one clip per line.

    The take is first cut at every pause (commas and '…' pause too), then neighbouring chunks are
    grouped so each group's length best matches its line's share of the text.
    """
    gaps = [(0.0, skip)] + [g for g in pauses(take) if g[0] > skip] + [(len(take) / SR, None)]
    chunks = [(a[1], b[0]) for a, b in zip(gaps, gaps[1:]) if b[0] - a[1] > 0.1]
    weights = np.array([len(t) for _, t in LINES], float)
    weights /= weights.sum()
    total = chunks[-1][1] - chunks[0][0]
    n, m = len(LINES), len(chunks)
    if m < n:
        sys.exit(f'only found {m} chunks in the take, expected at least {n}')
    # dp[i][j]: best cost putting the first j chunks into the first i lines
    dp = np.full((n + 1, m + 1), np.inf)
    back = np.zeros((n + 1, m + 1), int)
    dp[0][0] = 0
    for i in range(1, n + 1):
        for j in range(i, m + 1):
            for k in range(i - 1, j):
                dur = chunks[j - 1][1] - chunks[k][0]
                # length should match the line's share of the text; a long pause before it is a good cut
                lead = chunks[k][0] - chunks[k - 1][1] if k else 1.0
                c = dp[i - 1][k] + (dur - weights[i - 1] * total) ** 2 - PAUSE_BONUS * lead
                if c < dp[i][j]:
                    dp[i][j], back[i][j] = c, k
    groups, j = [], m
    for i in range(n, 0, -1):
        k = back[i][j]
        groups.append((chunks[k][0], chunks[j - 1][1]))
        j = k
    print('lines:', ' | '.join(f'{a:.1f}-{b:.1f}' for a, b in reversed(groups)))
    pad = 0.04
    return [take[int(max(0, a - pad) * SR) : int((b + pad) * SR)] for a, b in reversed(groups)]


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


def main(out, take_path=None, skip=0.0):
    if take_path and os.path.exists(take_path):
        take = to_pcm(open(take_path, 'rb').read(), [])
    else:
        take = tts()
        take_path = take_path or out.replace('.wav', '-take.wav')
        wavfile.write(take_path, SR, take)
        print('saved raw take to', take_path)
    clips = split(take, skip)
    track = np.zeros(int(SR * DUR), np.float32)
    for i, ((t0, _), clip) in enumerate(zip(LINES, clips)):
        nxt = LINES[i + 1][0] if i + 1 < len(LINES) else DUR
        clip = fit(clip, nxt - t0 - 0.15)
        print(f'line {i:2d} @ {t0:5.1f}s  {len(clip) / SR:.2f}s')
        a = int(t0 * SR)
        clip = clip[: len(track) - a]
        track[a : a + len(clip)] += clip
    track /= max(1e-6, np.max(np.abs(track))) / 0.9
    wavfile.write(out, SR, np.stack([track, track], 1))
    print('wrote', out)


if __name__ == '__main__':
    args = sys.argv[1:]
    opt = lambda k: args[args.index(k) + 1] if k in args else None
    main(args[0], opt('--take'), float(opt('--skip') or 0))
