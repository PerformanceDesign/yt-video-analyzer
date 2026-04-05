# YouTube Analyzer Trigger UI

Interfață web simplă pentru a porni workflow-ul de analiză transcript YouTube prin webhook.

## Cum rulezi local

```bash
python3 -m http.server 8080
```

Deschide apoi `http://localhost:8080`.

## Ce face

1. Primește un URL de YouTube.
2. Primește URL-ul webhook-ului (de ex. n8n, Make, Zapier, backend propriu).
3. Trimite `POST` JSON cu:
   - `youtubeUrl`
   - `workflow`
   - `prompt` (workflow prompt-ul furnizat)
   - `requestedAt`
4. Afișează payload-ul trimis și răspunsul webhook-ului.

## Exemplu payload

```json
{
  "youtubeUrl": "https://www.youtube.com/watch?v=abc123",
  "workflow": "youtube-transcript-analyzer",
  "prompt": "You are analyzing a YouTube video transcript...",
  "requestedAt": "2026-04-05T00:00:00.000Z"
}
```

## Notă CORS

Dacă webhook-ul este pe alt domeniu, permite CORS pentru `POST` din browser.
