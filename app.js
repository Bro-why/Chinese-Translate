const input = document.querySelector('#translation-input');
const translateButton = document.querySelector('#translate-button');
const secondButton = document.querySelector('#second-button');
const answer = document.querySelector('#answer');
const status = document.querySelector('#status');
const savedList = document.querySelector('#saved-list');
const languageToggle = document.querySelector('#language-toggle');
let lastText = '';
let language = localStorage.getItem('uiLanguage') || 'en';

const words = {
  en: {
    eyebrow: 'School & learning', subtitle: 'Understand the words. Understand what they mean.', important: 'Important:',
    safety: 'Check medical, emergency, food-allergy, and safety information with a trusted adult or professional.',
    inputTitle: 'Type words or a phrase', direction: 'English → 中文', inputPlaceholder: 'Example: Please bring your homework tomorrow.', inputLabel: 'Words to translate', safetyLabel: 'Safety reminder',
    translate: 'Translate and explain', ready: 'Ready', inputNeeded: 'Type a word or phrase first.', thinking: 'Thinking…',
    answerTitle: 'Family-friendly answer', difference: 'Translation + summary', answerPlaceholder: 'Your Chinese translation and simple summary will appear here.',
    secondVersion: 'Get a second summary', savedTitle: 'Saved on this computer', savedNote: 'Saves on this computer only for now.',
    tryAgain: 'Please try again.', toggle: '中文', language: 'en', title: 'Chinese Translate',
  },
  zh: {
    eyebrow: '学校与学习', subtitle: '理解这些词，也理解它们的意思。', important: '重要：',
    safety: '医疗、紧急、食物过敏和安全信息，请向可信任的成年人或专业人士确认。',
    inputTitle: '输入单词或短语', direction: '英文 → 中文', inputPlaceholder: '例如：请明天带上你的作业。', inputLabel: '要翻译的文字', safetyLabel: '安全提醒',
    translate: '翻译并解释', ready: '准备好了', inputNeeded: '请先输入单词或短语。', thinking: '思考中…',
    answerTitle: '适合家庭理解的答案', difference: '翻译 + 总结', answerPlaceholder: '中文翻译和简单总结会显示在这里。',
    secondVersion: '获取第二个总结', savedTitle: '保存在这台电脑上', savedNote: '目前只保存在这台电脑上。',
    tryAgain: '请再试一次。', toggle: 'English', language: 'zh', title: '中文翻译',
  },
};

function t(key) { return words[language][key]; }

function setLanguage(nextLanguage) {
  language = nextLanguage;
  localStorage.setItem('uiLanguage', language);
  const current = words[language];
  document.documentElement.lang = current.language;
  document.title = current.title;
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = current[element.dataset.i18n]; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => { element.placeholder = current[element.dataset.i18nPlaceholder]; });
  document.querySelectorAll('[data-i18n-label]').forEach(element => { element.setAttribute('aria-label', current[element.dataset.i18nLabel]); });
  document.querySelectorAll('[data-i18n-aria]').forEach(element => { element.setAttribute('aria-label', current[element.dataset.i18nAria]); });
  languageToggle.textContent = current.toggle;
  if (answer.classList.contains('empty')) answer.textContent = current.answerPlaceholder;
  if (status.textContent !== 'Thinking…' && status.textContent !== '思考中…') status.textContent = current.ready;
}

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
  if (!text) { status.textContent = t('inputNeeded'); input.focus(); return; }
  translateButton.disabled = true;
  secondButton.disabled = true;
  status.textContent = t('thinking');
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
    status.textContent = t('ready');
    secondButton.hidden = false;
  } catch (error) {
    showAnswer(error.message || 'The AI could not answer right now. Please check the internet.');
    status.textContent = t('tryAgain');
  } finally {
    translateButton.disabled = false;
    secondButton.disabled = false;
  }
}

translateButton.addEventListener('click', () => translate(false));
secondButton.addEventListener('click', () => translate(true));
input.addEventListener('keydown', event => { if (event.key === 'Enter') translate(false); });
languageToggle.addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en'));
setLanguage(language);
renderSaved();
