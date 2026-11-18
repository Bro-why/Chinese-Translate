# Project notes

The AI key comes from `getKey()` in `server/getKey.js`.

Use `getKey()` only in server code. Never send the AI key or `KEYGEN_TOKEN` to the page or app, and never print them.

If OpenAI reports that the key is invalid, call `invalidateKey()` and make one replacement request with `getKey({ forceRefresh: true })`. Do not retry in a loop. For failures, show `error.message` to the user and log `error.fix` on the server.
