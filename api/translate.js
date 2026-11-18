const { askAI } = require('../server/askAI');

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: { message: 'This endpoint only accepts POST requests.', fix: 'Use the app’s Translate button.' } });
    return;
  }

  try {
    const body = request.body || {};
    const text = String(body.text || '').trim();
    if (!text) {
      response.status(400).json({ error: { message: 'Please enter a word or phrase.', fix: 'Type something before translating.' } });
      return;
    }
    const answer = await askAI(text, body.secondVersion === true);
    response.status(200).json({ answer });
  } catch (error) {
    const message = error?.error?.message || error?.message || 'The AI could not answer right now.';
    const fix = error?.error?.fix || error?.fix || 'Check the internet connection and try again.';
    console.error(fix);
    response.status(500).json({ error: { message, fix } });
  }
};
