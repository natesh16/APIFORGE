// APIFORGE — interactive hero demo
// Motion answers a person's action (send request), which the design skill
// encourages. Non-user-triggered motion is avoided.

const sendBtn = document.getElementById('demo-send');
const statusIndicator = document.querySelector('.status-indicator');
const statusText = document.querySelector('.status-text');
const demoUrl = document.getElementById('demo-url');
const demoCode = document.getElementById('demo-code');
const demoStatus = document.querySelector('.demo-status');

const endpoints = [
  { path: 'POST /v1/charges', code: JSON.stringify({ amount: 2500, currency: 'usd', idempotency_key: 'ch_1Q4m2...' }, null, 2) },
  { path: 'GET /v1/charges/ch_1Q4m2', code: JSON.stringify({ id: 'ch_1Q4m2', object: 'charge', amount: 2500, status: 'succeeded' }, null, 2) },
  { path: 'GET /v1/routes', code: JSON.stringify([{ path: '/api/*', upstream: 'https://api.internal', rate_limit: '100/min' }], null, 2) },
  { path: 'DELETE /v1/keys/sk_live_9F8m', code: 'null' },
];

let i = 0;

async function sendRequest() {
  if (demoStatus.classList.contains('sending')) return;

  // User-triggered state: sending
  demoStatus.classList.add('sending');
  statusIndicator.setAttribute('aria-busy', 'true');
  statusText.textContent = 'Sending…';
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending…';

  const endpoint = endpoints[i];
  i = (i + 1) % endpoints.length;

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 900));

  demoUrl.textContent = endpoint.path;
  demoCode.innerHTML = `<code class="language-json">${escapeHtml(endpoint.code)}</code>`;

  demoStatus.classList.remove('sending');
  statusIndicator.removeAttribute('aria-busy');
  statusText.textContent = '200 OK';
  sendBtn.disabled = false;
  sendBtn.textContent = 'Send request';
}

sendBtn.addEventListener('click', sendRequest);
sendBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    sendRequest();
  }
});

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
