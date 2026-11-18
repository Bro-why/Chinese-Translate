# Chinese Translate notes

## How to run

1. Put your MindDo values in `.env`.
2. Run `node server.js`.
3. Open http://localhost:3000.

The AI key comes from `getKey()` in `server/getKey.js`. The AI request lives in `server/askAI.js`, uses model `gpt-5.6-luna`, and keeps credentials on the server.

## Vercel

Vercel uses the built-in Node serverless function at `api/translate.js`; the page files stay at the project root. Deploy the project as-is from GitHub. In Vercel Project Settings → Environment Variables, add `KEYGEN_URL` and `KEYGEN_TOKEN` for the environments you use. No OpenAI key is added to Vercel: the server gets the AI key only through `getKey()`.

The local command remains `node server.js`. Browser saving still uses localStorage and is not uploaded to Vercel.

## What’s done

- Version 1 MVP: translate a phrase into Chinese, receive a simple family-friendly summary, and request a second version.
- Safety reminder is shown for medical, emergency, food-allergy, and safety information.
- Saves on this computer only for now. Browser saving is kept in `storage.js` so it can be replaced with a database later.
- Sample items use made-up text only.

## Maybe Later

- Flag incorrect translations to improve the AI’s learning.
- Glossary of common phrases for daily conversations.
- Cultural tips related to translated content.
- Warning to verify important information with a trusted adult.
- Share translations with family through text or messaging.
- Feedback on AI performance to enhance accuracy.

## Security rule

Use `getKey()` only in server code. Never send the AI key or `KEYGEN_TOKEN` to the page or app, and never print them. If OpenAI reports an invalid key, refresh once with `getKey({ forceRefresh: true })`; do not retry in a loop.
