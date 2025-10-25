// api/send.js
// Vercel Node serverless function
// Expects POST JSON: { message: "..." }
// Uses process.env.TELEGRAM_TOKEN and process.env.TELEGRAM_CHAT_ID

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_PER_WINDOW = 6; // per IP per window (tune as needed)

// in-memory map of ip => [timestamps]
// NOTE: serverless environments are ephemeral; this is best-effort.
const ipMap = new Map();

function cleanupOld(ip) {
  const now = Date.now();
  const arr = ipMap.get(ip) || [];
  const filtered = arr.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  ipMap.set(ip, filtered);
  return filtered;
}

// Escape Telegram MarkdownV2
function escapeMarkdownV2(text) {
  // per Telegram docs, escape the following characters: _ * [ ] ( ) ~ ` > # + - = | { } . !
  return text.replace(/([_*\[\]()~`>#+\-=|{}\.!])/g, '\\$1');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basic origin check - optional: you can restrict to your domain here
  // const origin = req.headers['origin'];
  // if (origin && !origin.includes('your-domain.com')) { ... }

  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now();

  // rate limit
  const arr = cleanupOld(ip);
  if (arr.length >= MAX_PER_WINDOW) {
    return res.status(429).json({ error: 'Too many requests. Please wait a bit before sending another message.' });
  }
  arr.push(now);
  ipMap.set(ip, arr);

  let body = req.body;
  if (!body || typeof body === 'string') {
    try { body = JSON.parse(body || '{}'); } catch (e) { body = {}; }
  }

  const message = (body.message || '').toString().trim();
  if (!message) {
    return res.status(400).json({ error: 'Message is empty' });
  }
  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message too long (max 1000 chars)' });
  }

  // Very basic content check to reduce obvious abuse (you can expand)
  const lower = message.toLowerCase();
  const suspicious = [ 'http://', 'https://', 'www.', '@', 'telegram.me', 't.me' ];
  const hasLink = suspicious.some(s => lower.includes(s));
  if (hasLink) {
    return res.status(400).json({ error: 'Messages containing links or @ mentions are not allowed' });
  }

  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Missing TELEGRAM_TOKEN or TELEGRAM_CHAT_ID');
    return res.status(500).json({ error: 'Server not configured' });
  }

  const escaped = escapeMarkdownV2(message);
  const text = `*Anonymous message:*\n\n${escaped}`;

  try {
    const resp = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'MarkdownV2',
      }),
    });

    const data = await resp.json();
    if (!resp.ok || data?.ok === false) {
      console.error('Telegram API error', data);
      return res.status(502).json({ error: 'Telegram API error' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Send failure', err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
