const input = document.querySelector('#translation-input');
const translateButton = document.querySelector('#translate-button');
const secondButton = document.querySelector('#second-button');
const answer = document.querySelector('#answer');
const status = document.querySelector('#status');
const savedList = document.querySelector('#saved-list');
let lastText = '';

function showAnswer(text) {
  answer.textContent = text;
  answer.classList.remove('empty');
}

function renderSaved() {
  const saved = [...translateStorage.getSamples(), ...translateStorage.loadSavedItems()];
  savedList.innerHTML = '';
  for (const item of saved) {
    const li = document.createElement('li');
    li.innerHTML = `<strong></strong><span></span>`;
    li.querySelector('strong').textContent = item.text;
    li.querySelector('span').textContent = item.answer;
    savedList.appendChild(li);
  }
}

async function translate(secondVersion = false) {
  const text = (secondVersion ? lastText : input.value).trim();
  if (!text) { status.textContent = 'Type a word or phrase first.'; input.focus(); return; }
  translateButton.disabled = true;
  secondButton.disabled = true;
  status.textContent = 'Thinking…';
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, secondVersion }),
    });
    const body = await response.json();
    if (!response.ok) throw body.error || new Error('The AI could not answer right now.');
    lastText = text;
    showAnswer(body.answer);
    translateStorage.saveItem({ text, answer: body.answer });
    renderSaved();
    status.textContent = 'Ready';
    secondButton.hidden = false;
  } catch (error) {
    showAnswer(error.message || 'The AI could not answer right now. Please check the internet.');
    status.textContent = 'Please try again.';
  } finally {
    translateButton.disabled = false;
    secondButton.disabled = false;
  }
}

translateButton.addEventListener('click', () => translate(false));
secondButton.addEventListener('click', () => translate(true));
input.addEventListener('keydown', event => { if (event.key === 'Enter') translate(false); });
renderSaved();
