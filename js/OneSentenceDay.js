const STORAGE_KEY = 'quote-usage-tracking';
const EXPIRE_KEY = 'quote-usage-expire';
const EXPIRE_TIME = 15 * 60 * 1000; // 15 分钟

// 初始化使用记录
function loadUsageData() {
  const now = Date.now();
  const expireTime = localStorage.getItem(EXPIRE_KEY);

  if (!expireTime || now > parseInt(expireTime)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
    localStorage.setItem(EXPIRE_KEY, (now + EXPIRE_TIME).toString());
    return {};
  }

  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

// 保存使用记录
function saveUsageData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 选择权重最低的一句
function weightedRandomSelect(quotes, usageData) {
  const weights = quotes.map((quote, index) => {
    const key = quote.article?.url || quote.text[0];
    const count = usageData[key] || 0;
    return { index, weight: 1 / (1 + count) }; // 频率越高，权重越低
  });

  const total = weights.reduce((sum, item) => sum + item.weight, 0);
  const rand = Math.random() * total;

  let cumulative = 0;
  for (const { index, weight } of weights) {
    cumulative += weight;
    if (rand <= cumulative) return quotes[index];
  }

  return quotes[0]; // fallback
}

// 主函数
function showQuote() {
  const usageData = loadUsageData();

  const quote = weightedRandomSelect(dailyQuotes, usageData);
  const sentence = quote.text[Math.floor(Math.random() * quote.text.length)];

  const key = quote.article?.url || quote.text[0];
  usageData[key] = (usageData[key] || 0) + 1;
  saveUsageData(usageData);

  let authorDisplay = quote.author.name || '';
  if (quote.author.url) {
    authorDisplay = `<a href="${quote.author.url}" target="_blank">${quote.author.name}</a>`;
  }

  let articleDisplay = quote.article.title || '';
  if (quote.article.url) {
    articleDisplay = `<a href="${quote.article.url}" target="_blank">${quote.article.title}</a>`;
  }

  document.getElementById('daily-quote').textContent = `"${sentence}"`;
  document.getElementById('quote-meta').innerHTML = `——${authorDisplay} · ${articleDisplay}`;
}

document.getElementById('daily-quote-box').addEventListener('click', function (event) {
    const quoteMeta = document.getElementById('quote-meta');
    if (quoteMeta.contains(event.target)) {
        return;
    }
    showQuote();
});


// 初次加载页面时显示
showQuote();
