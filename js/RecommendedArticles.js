(function () {
  const STORAGE_KEY = 'article-usage-tracking';
  const EXPIRE_KEY = 'article-usage-expire';
  const EXPIRE_TIME = 15 * 60 * 1000; // 15 分钟

  function loadArticleUsageData() {
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

  function saveArticleUsageData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function weightedRandomSelectArticles(articles, usageData, count) {
    const weights = articles.map((article) => {
      const key = article.url;
      const count = usageData[key] || 0;
      return { article, weight: 1 / (1 + count) };
    });

    const selectedArticles = [];
    const attempts = 1000;
    let tries = 0;

    while (selectedArticles.length < count && tries < attempts) {
      const total = weights.reduce((sum, item) => sum + item.weight, 0);
      const rand = Math.random() * total;
      let cumulative = 0;

      for (const { article, weight } of weights) {
        cumulative += weight;
        if (rand <= cumulative && !selectedArticles.includes(article)) {
          selectedArticles.push(article);
          break;
        }
      }

      tries++;
    }

    selectedArticles.forEach((article) => {
      const key = article.url;
      usageData[key] = (usageData[key] || 0) + 1;
    });
    saveArticleUsageData(usageData);

    return selectedArticles;
  }

  function showRandomArticles() {
    const usageData = loadArticleUsageData();
    const selectedArticles = weightedRandomSelectArticles(recommendedArticlesList, usageData, 3);
    const listContainer = document.getElementById('recommended-article-list');
    listContainer.innerHTML = '';

    selectedArticles.forEach((article) => {
      const li = document.createElement('li');
      li.style.marginBottom = '8px';
      li.innerHTML = `<a href="${article.url}" target="_blank"><i class="iconfont icon-share-square"></i> ${article.title}</a>`;
      listContainer.appendChild(li);
    });
  }

  document.getElementById('recommended-article-box').addEventListener('click', showRandomArticles);
  showRandomArticles();
})();
