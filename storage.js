const STORAGE_KEY = 'chineseTranslateHistory';
const samples = [
  { text: 'Please bring your homework tomorrow.', answer: 'Sample: 请明天带上你的作业。\n\nSummary: Your teacher wants you to bring your homework tomorrow.' },
  { text: 'The bus leaves at 3:30.', answer: 'Sample: 公共汽车在3:30出发。\n\nSummary: The bus will leave at 3:30.' },
];

function loadSavedItems() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}

function saveItem(item) {
  const items = [item, ...loadSavedItems()].slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return items;
}

function getSamples() { return samples; }

window.translateStorage = { loadSavedItems, saveItem, getSamples };
