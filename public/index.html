<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Anonymous message</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* small custom */
    textarea:focus { outline: none; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
  </style>
</head>
<body class="min-h-screen bg-white text-slate-800">
  <main class="max-w-4xl mx-auto py-20 px-6">
    <div class="flex items-start justify-between mb-6">
      <h1 class="text-4xl font-extrabold">Anonymous message</h1>
      <div class="text-sm text-slate-500">Secure — <span class="font-medium">token kept on server</span></div>
    </div>

    <p class="text-slate-500 mb-6">Your message will be forwarded to the Telegram chat configured on the server. No tokens or IDs are stored in this page.</p>

    <label class="block text-slate-700 font-medium mb-2">Message (max 1000 chars)</label>
    <textarea id="message" maxlength="1000" rows="8"
      class="w-full border border-slate-200 rounded-lg p-4 resize-none placeholder-slate-400 focus:border-slate-300"
      placeholder="Write your anonymous message..."></textarea>

    <div class="flex items-center mt-3">
      <input id="confirm" type="checkbox" class="h-4 w-4 text-blue-600 rounded border-slate-300">
      <label for="confirm" class="ml-2 text-sm text-slate-600">I confirm this message is not abusive or illegal</label>
    </div>

    <div id="status" class="mt-4 text-sm text-slate-600"></div>

    <div class="mt-6">
      <button id="sendBtn"
        class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-sm disabled:opacity-60"
      >
        Send anonymously
      </button>
    </div>

    <p class="mt-10 text-sm text-slate-400">Note: messages are forwarded by the server to the Telegram bot you configured in Vercel environment variables.</p>
  </main>

  <script>
    const sendBtn = document.getElementById('sendBtn');
    const msgEl = document.getElementById('message');
    const confirmEl = document.getElementById('confirm');
    const status = document.getElementById('status');

    function setStatus(text, isError = false) {
      status.textContent = text;
      status.className = isError ? 'mt-4 text-sm text-red-600' : 'mt-4 text-sm text-slate-600';
    }

    sendBtn.addEventListener('click', async () => {
      setStatus('');
      const message = msgEl.value.trim();
      if (!message) {
        setStatus('Please write a message first.', true);
        return;
      }
      if (!confirmEl.checked) {
        setStatus('Please confirm the message is not abusive or illegal.', true);
        return;
      }
      sendBtn.disabled = true;
      setStatus('Sending...');
      try {
        const res = await fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        });

        const j = await res.json();
        if (!res.ok) {
          setStatus(j?.error || 'Failed to send message', true);
        } else {
          setStatus('Message sent. Thank you!');
          msgEl.value = '';
          confirmEl.checked = false;
        }
      } catch (err) {
        setStatus('Network error. Try again later.', true);
      } finally {
        sendBtn.disabled = false;
      }
    });
  </script>
</body>
</html>
