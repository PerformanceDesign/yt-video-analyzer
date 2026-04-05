const form = document.getElementById('trigger-form');
const youtubeInput = document.getElementById('youtube-url');
const webhookInput = document.getElementById('webhook-url');
const payloadPreview = document.getElementById('payload-preview');
const responseOutput = document.getElementById('response-output');
const statusEl = document.getElementById('status');
const submitBtn = document.getElementById('submit-btn');

const analysisPrompt = `You are analyzing a YouTube video transcript.\n\n1. Create a concise TL;DR.\n2. Extract the most useful ideas and frameworks.\n3. Identify any tools, books, websites, methods, or people mentioned.\n4. Determine whether the video contains repeatable workflows that could become Codex skills.\n5. For each skill candidate, explain:\n   - the repeatable task\n   - inputs\n   - outputs\n   - why it should be a reusable skill\n   - a starter SKILL.md draft or implementation brief\n\nReturn valid JSON matching the provided schema.\nBe concrete and avoid generic advice.`;

function showStatus(message, type = '') {
  statusEl.textContent = message;
  statusEl.className = type;
}

function isValidYouTubeUrl(value) {
  try {
    const url = new URL(value);
    const isYouTubeHost =
      url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be');
    return isYouTubeHost;
  } catch {
    return false;
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const youtubeUrl = youtubeInput.value.trim();
  const webhookUrl = webhookInput.value.trim();

  if (!isValidYouTubeUrl(youtubeUrl)) {
    showStatus('URL-ul YouTube nu este valid.', 'error');
    return;
  }

  if (!webhookUrl) {
    showStatus('Webhook URL este obligatoriu.', 'error');
    return;
  }

  const payload = {
    youtubeUrl,
    workflow: 'youtube-transcript-analyzer',
    prompt: analysisPrompt,
    requestedAt: new Date().toISOString(),
  };

  payloadPreview.textContent = JSON.stringify(payload, null, 2);
  responseOutput.textContent = '-';
  showStatus('Trimit către webhook...', '');
  submitBtn.disabled = true;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    responseOutput.textContent =
      typeof data === 'string' ? data : JSON.stringify(data, null, 2);

    if (!response.ok) {
      showStatus(`Webhook a răspuns cu eroare HTTP ${response.status}.`, 'error');
      return;
    }

    showStatus('Workflow declanșat cu succes.', 'success');
  } catch (error) {
    responseOutput.textContent = String(error);
    showStatus(
      'Nu s-a putut trimite request-ul. Verifică CORS/webhook URL.',
      'error'
    );
  } finally {
    submitBtn.disabled = false;
  }
});
