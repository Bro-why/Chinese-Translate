const fs = require('fs');
const path = require('path');
const { getKey, invalidateKey } = require('./getKey');

const projectRoot = path.join(__dirname, '..');

function readAiInstructions() {
  const brief = fs.readFileSync(path.join(projectRoot, 'BRIEF.md'), 'utf8');
  const start = brief.indexOf('## My AI’s instructions');
  if (start < 0) throw new Error('The AI instructions are missing from BRIEF.md.');
  const end = brief.indexOf('\n## ', start + 4);
  return brief.slice(start, end < 0 ? brief.length : end).trim();
}

function readModel() {
  const notes = fs.readFileSync(path.join(projectRoot, 'NOTES.md'), 'utf8');
  const match = notes.match(/`([^`]*luna[^`]*)`/i);
  if (!match) throw new Error('The AI model is missing from NOTES.md.');
  return match[1];
}

async function requestWithKey(key, text, secondVersion) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: readModel(),
      messages: [
        { role: 'system', content: readAiInstructions() },
        {
          role: 'user',
          content: secondVersion
            ? `Give a second, clearer version of this translation and summary:\n\n${text}`
            : `Translate and summarize this text:\n\n${text}`,
        },
      ],
    }),
  });

  let body;
  try {
    body = await response.json();
  } catch (cause) {
    const error = new Error('The AI returned an unreadable response.');
    error.fix = 'Check the internet connection and try again.';
    error.cause = cause;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(body?.error?.message || 'The AI could not answer right now.');
    error.fix = body?.error?.code === 'invalid_api_key'
      ? 'Refresh the MindDo key and try again.'
      : 'Check the internet connection and try again.';
    error.isInvalidKey = body?.error?.code === 'invalid_api_key';
    throw error;
  }

  const answer = body?.choices?.[0]?.message?.content;
  if (!answer) {
    const error = new Error('The AI did not return an answer.');
    error.fix = 'Try the translation again.';
    throw error;
  }
  return answer;
}

async function askAI(text, secondVersion = false) {
  let key = await getKey();
  try {
    return await requestWithKey(key, text, secondVersion);
  } catch (error) {
    if (!error.isInvalidKey) throw error;
    invalidateKey();
    key = await getKey({ forceRefresh: true });
    return requestWithKey(key, text, secondVersion);
  }
}

module.exports = { askAI };
