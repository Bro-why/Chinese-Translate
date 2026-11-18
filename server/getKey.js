let cachedKey = null;
let cachedExpiresAt = 0;

class KeygenError extends Error {
  constructor(message, fix, cause) {
    super(message, { cause });
    this.name = 'KeygenError';
    this.fix = fix;
    this.error = { message, fix };
  }
}

function readConfig() {
  const url = process.env.KEYGEN_URL;
  const token = process.env.KEYGEN_TOKEN;

  if (!url || !token || url === 'paste-here' || token === 'paste-here') {
    throw new KeygenError(
      'The AI key service is not configured.',
      'Set KEYGEN_URL and KEYGEN_TOKEN in the server .env file.'
    );
  }

  return { url: url.replace(/\/$/, ''), token };
}

/**
 * Get a cached AI key, or request a fresh one from MindDo.
 * Pass { forceRefresh: true } once when OpenAI reports that the key is invalid.
 */
async function getKey({ forceRefresh = false } = {}) {
  if (!forceRefresh && cachedKey && Date.now() < cachedExpiresAt) {
    return cachedKey;
  }

  const { url, token } = readConfig();
  let response;

  try {
    response = await fetch(`${url}/api/lookup-key`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (cause) {
    throw new KeygenError(
      'The AI key service could not be reached.',
      'Check KEYGEN_URL and the server network connection.',
      cause
    );
  }

  let body;
  try {
    body = await response.json();
  } catch (cause) {
    throw new KeygenError(
      'The AI key service returned an invalid response.',
      'Check that MindDo returns JSON containing apiKey and expiresAt.',
      cause
    );
  }

  if (!response.ok || !body.apiKey || !body.expiresAt) {
    throw new KeygenError(
      body?.error?.message || 'The AI key service rejected the request.',
      body?.error?.fix || 'Check the MindDo URL and token in the server .env file.'
    );
  }

  const expiresAt = Date.parse(body.expiresAt);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    throw new KeygenError(
      'The AI key service returned an expired key.',
      'Ask MindDo for a valid future expiresAt value.'
    );
  }

  cachedKey = body.apiKey;
  cachedExpiresAt = expiresAt;
  return cachedKey;
}

/** Clear the cached key after one OpenAI invalid-key response. */
function invalidateKey() {
  cachedKey = null;
  cachedExpiresAt = 0;
}

module.exports = { getKey, invalidateKey };
