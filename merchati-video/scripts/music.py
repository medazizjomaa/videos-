"""Original background score for the MERCHATI promo (65.5 s), synthesized from scratch.

0–15 s   tension: drone, ticking hats, pulsing synth, rising noise (the overload)
15–16 s  silence (the freeze)
16 s     soft impact + bright pad (logo reveal), then an uplifting 100 BPM groove
61.7–65.5 s  drums drop out, pad + plucks resolve and fade

Usage: python3 scripts/music.py public/audio/music.wav
"""
import sys
import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt
from scipy.io import wavfile

SR = 44100
DUR = 65.5
N = int(SR * DUR)
BPM = 100
BEAT = 60 / BPM
rng = np.random.default_rng(7)

L = np.zeros(N)
R = np.zeros(N)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    L[i : i + len(sig)] += sig * gain * np.sqrt(0.5 * (1 - pan))
    R[i : i + len(sig)] += sig * gain * np.sqrt(0.5 * (1 + pan))


def env_adsr(n, a, d, s, r):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    sus = max(0, n - a - d - r)
    return np.concatenate([np.linspace(0, 1, a, False), np.linspace(1, s, d, False), np.full(sus, s), np.linspace(s, 0, r)])[:n]


def lowpass(x, fc, order=2):
    return sosfilt(butter(order, min(fc, SR / 2 - 100) / (SR / 2), 'low', output='sos'), x)


def highpass(x, fc, order=2):
    return sosfilt(butter(order, fc / (SR / 2), 'high', output='sos'), x)


def bandpass(x, lo, hi):
    return sosfilt(butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band', output='sos'), x)


def saw(f, n, detune=0.0):
    t = np.arange(n) / SR
    out = np.zeros(n)
    for d in (-detune, 0, detune):
        ph = (t * f * (1 + d)) % 1.0
        out += 2 * ph - 1
    return out / 3


# ---------------------------------------------------------------- instruments
def pad(notes, dur, cutoff=2200, att=0.6, rel=1.2):
    n = int(dur * SR)
    x = sum(saw(hz(m), n, 0.004) for m in notes) / len(notes)
    x = lowpass(x, cutoff, 2)
    return x * env_adsr(n, att, 0.4, 0.8, rel)


def pluck(m, dur=0.9, bright=1.4):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = hz(m)
    e = np.exp(-t * 5.5)
    mod = bright * np.exp(-t * 9) * np.sin(2 * np.pi * f * 2 * t)
    x = np.sin(2 * np.pi * f * t + mod) * e
    x += 0.25 * np.sin(2 * np.pi * f * 3 * t) * np.exp(-t * 12)
    return x * env_adsr(n, 0.004, 0.05, 1, 0.08)


def bass(m, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = hz(m)
    x = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)
    x = np.tanh(1.6 * x) / np.tanh(1.6)
    return x * env_adsr(n, 0.01, 0.15, 0.75, 0.08)


def kick(level=1.0):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 45 + 95 * np.exp(-t * 32)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * 7.5)
    x[: int(0.004 * SR)] += rng.normal(0, 0.25, int(0.004 * SR))
    return np.tanh(1.5 * x) * level


def clap():
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    noise = bandpass(rng.normal(0, 1, n), 900, 5000)
    e = np.zeros(n)
    for k, off in enumerate((0, 0.011, 0.022)):
        i = int(off * SR)
        e[i:] += np.exp(-(t[: n - i]) * (60 if k < 2 else 18))
    return noise * e * 0.6


def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR)
    t = np.arange(n) / SR
    x = highpass(rng.normal(0, 1, n), 7000, 2)
    return x * np.exp(-t * (18 if open_ else 70)) * 0.35


def tick():
    n = int(0.03 * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 160) * 0.5


def riser(dur):
    n = int(dur * SR)
    x = rng.normal(0, 1, n)
    out = np.zeros(n)
    seg = SR // 20
    for i in range(0, n, seg):
        p = i / n
        lo = 400 + 5000 * p ** 2
        out[i : i + seg] = bandpass(x[i : i + seg + 0], lo, lo * 1.8)[: len(out[i : i + seg])]
    return out * np.linspace(0, 1, n) ** 2 * 0.5


def impact():
    n = int(3.0 * SR)
    t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * (38 + 30 * np.exp(-t * 6)) * t) * np.exp(-t * 1.6)
    air = lowpass(rng.normal(0, 1, n), 3000) * np.exp(-t * 4) * 0.25
    return boom + air


# ---------------------------------------------------------------- part 1: tension (0–15.07 s)
FREEZE = 452 / 30
REVEAL = 16.0

drone_n = int(FREEZE * SR)
drone = lowpass(saw(hz(38), drone_n, 0.006) + saw(hz(45), drone_n, 0.005), 500)
drone *= np.linspace(0.25, 0.7, drone_n)
add(drone, 0, 0.35)

# Pulsing synth on D, 8ths, filter opening as the chaos grows
t = 0.0
while t < FREEZE - 0.05:
    p = t / FREEZE
    n = int(BEAT / 2 * SR * 0.9)
    note = lowpass(saw(hz(50), n, 0.003), 600 + 3800 * p ** 1.5) * env_adsr(n, 0.005, 0.08, 0.5, 0.05)
    add(note, t, 0.16 + 0.1 * p, pan=-0.2 if int(t / (BEAT / 2)) % 2 else 0.2)
    t += BEAT / 2

# Clock ticks, getting denser
t = 0.0
while t < FREEZE - 0.03:
    p = t / FREEZE
    add(tick(), t, 0.18 + 0.15 * p, pan=0.4)
    t += BEAT / (2 if p < 0.35 else 4)

# Heartbeat kick from 5 s
t = 5.0
while t < FREEZE - 0.1:
    add(kick(0.8), t, 0.5)
    t += BEAT

add(riser(FREEZE - 9.5), 9.5, 0.55)

# ---------------------------------------------------------------- part 2: reveal + groove (16 s →)
END_GROOVE = 1850 / 30  # CTA starts: drums drop out
CHORDS = [
    (41, (57, 60, 64, 67)),  # Fmaj9
    (40, (55, 60, 64, 67)),  # C/E
    (38, (57, 60, 65, 69)),  # Dm7
    (34, (58, 62, 65, 69)),  # Bbmaj7
]
BAR = BEAT * 4

add(impact(), REVEAL, 0.7)
add(pad((53, 57, 60, 64, 67, 72), 3.2, cutoff=3500, att=0.05, rel=1.5), REVEAL, 0.5)

groove_start = REVEAL + BEAT * 2  # pickup into the groove
bar_t = groove_start
k = 0
while bar_t < DUR - 0.5:
    root, chord = CHORDS[k % 4]
    drums = bar_t + 0.01 < END_GROOVE
    outro = not drums
    # Pad
    add(pad(chord, BAR + 0.3, cutoff=1800 if not outro else 1400, att=0.3, rel=0.6), bar_t, 0.22 if drums else 0.28)
    # Bass
    if drums:
        for b in (0, 1.5, 2, 3):
            add(bass(root + 12, BEAT * (0.9 if b != 1.5 else 0.45)), bar_t + b * BEAT, 0.32)
    # Plucked arpeggio (8ths)
    arp = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[3] + 12, chord[2] + 12, chord[1] + 12, chord[3] + 12, chord[2] + 12]
    for i, m in enumerate(arp):
        if outro and i % 2:
            continue
        add(pluck(m), bar_t + i * BEAT / 2, 0.16 if drums else 0.12, pan=-0.35 if i % 2 else 0.35)
    if drums and bar_t >= groove_start + BAR - 0.01:
        for b in range(4):
            add(kick(), bar_t + b * BEAT, 0.62)
            if b in (1, 3):
                add(clap(), bar_t + b * BEAT, 0.45, pan=0.05)
        for h in range(8):
            add(hat(open_=(h % 4 == 2)), bar_t + h * BEAT / 2 + (BEAT / 4 if h % 2 else 0) * 0, 0.6, pan=0.3)
    elif drums:
        # first bar after the reveal: build with kick only on 1 and 3
        add(kick(0.8), bar_t, 0.5)
        add(kick(0.8), bar_t + 2 * BEAT, 0.5)
    bar_t += BAR
    k += 1

# Final shimmer on the logo at the CTA
add(pad((65, 69, 72, 76), 4.5, cutoff=5000, att=0.8, rel=2.0), END_GROOVE, 0.18)

# ---------------------------------------------------------------- mix
def reverb(x, seconds=1.8, mix=0.18, seed=1):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = np.random.default_rng(seed).normal(0, 1, n) * np.exp(-t * 3.2)
    ir = lowpass(ir, 6000)
    ir /= np.sqrt(np.sum(ir ** 2))
    wet = fftconvolve(x, ir)[: len(x)]
    return x * (1 - mix) + wet * mix


L = reverb(L, seed=1)
R = reverb(R, seed=2)

# Hard silence for the freeze, with a 60 ms fade into it
silence = (np.arange(N) / SR >= FREEZE) & (np.arange(N) / SR < REVEAL)
fade_in = int(0.06 * SR)
i0 = int(FREEZE * SR)
ramp = np.linspace(1, 0, fade_in)
for ch in (L, R):
    ch[i0 - fade_in : i0] *= ramp
    ch[silence] = 0

# Master fade out
fo = int(2.0 * SR)
for ch in (L, R):
    ch[-fo:] *= np.linspace(1, 0, fo) ** 1.5

stereo = np.stack([L, R], axis=1)
stereo = highpass(stereo.T, 25).T
peak = np.max(np.abs(stereo))
stereo = np.tanh(stereo / peak * 1.3) / np.tanh(1.3) * 0.84
wavfile.write(sys.argv[1], SR, (stereo * 32767).astype(np.int16))
print('wrote', sys.argv[1], f'{DUR}s')
