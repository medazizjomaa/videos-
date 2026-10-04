# MERCHATI — voice-over (Tunisian Darija + French, 60 s)

Generated with Gemini TTS (`gemini-3.8-flash-tts`, falls back to `gemini-3.8-flash-lite-tts`), female voice `Sulafat`,
by `scripts/voiceover_gemini.py`. Darija is written in Arabic script and French in Latin script, so the French words
(client, commande, réservation…) get a real French pronunciation.

- New take (one API request): `python3 scripts/voiceover_gemini.py public/audio/voiceover.wav`
- Re-time the saved take without using quota:
  `python3 scripts/voiceover_gemini.py public/audio/voiceover.wav --take audio-src/gemini-take.flac --skip 32.4`
  (the first 32 s of that take are the model reading the director's notes, hence `--skip`).
- The API key is read from `GEMINI_API_KEY` or `~/.config/merchati/.env` — never commit it.

| Time | Line |
|---|---|
| 0:00 | Les commandes, les réservations, les messages… الكل في نفس الوقت! |
| 0:05 | Instagram, Messenger, le site… ما تلحقش تجاوب الكل. |
| 0:10 | وكل réponse تتأخر… هو client مشى لغيرك. |
| 0:16 | Voilà Merchati, l’employé intelligent متاعك. |
| 0:20 | يجاوب بالدارجة, en quelques secondes, ليل ونهار. |
| 0:24 | ياخو la commande, ويفهم حتى les vocaux. |
| 0:30 | وإنت, توصلك notification على Telegram. |
| 0:33 | Les commandes الكل, في dashboard واحد. |
| 0:39 | Pour les restos, يبعث le lien de réservation, و le client يختار la table متاعو وحدو. |
| 0:45 | وكل réservation توصلك en temps réel. |
| 0:51 | E-commerce, à partir de cinquante dinars par mois. Et les restos, à partir de soixante. |
| 0:57 | Merchati. جرّب sept jours, gratuit! |
