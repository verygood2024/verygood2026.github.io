function createBackgroundRotator(options) {
  const STORAGE_KEY = options.storageKey || 'background-usage-tracking';
  const EXPIRE_KEY = options.expireKey || 'background-usage-expire';
  const EXPIRE_TIME = options.expireTime || 15 * 60 * 1000; // 默认15分钟
  const images = options.images || [];

  if (!images.length) {
    throw new Error('必须传入非空图片列表 images');
  }

  // 绑定背景的目标元素，默认 body
  let targetElement = document.body;
  if (options.target) {
    if (typeof options.target === 'string') {
      targetElement = document.querySelector(options.target);
      if (!targetElement) {
        throw new Error('未找到对应的目标元素: ' + options.target);
      }
    } else if (options.target instanceof Element) {
      targetElement = options.target;
    } else {
      throw new Error('target 必须是选择器字符串或 DOM 元素');
    }
  }

  function loadUsageData() {
    const now = Date.now();
    const expire = localStorage.getItem(EXPIRE_KEY);
    if (!expire || now > parseInt(expire)) {
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

  function saveUsageData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function weightedRandomSelect() {
    const usageData = loadUsageData();
    const weights = images.map((url) => {
      const count = usageData[url] || 0;
      return { url, weight: 1 / (1 + count) };
    });

    const totalWeight = weights.reduce((sum, item) => sum + item.weight, 0);
    const rand = Math.random() * totalWeight;
    let cumulative = 0;

    for (const { url, weight } of weights) {
      cumulative += weight;
      if (rand <= cumulative) {
        return url;
      }
    }

    return images[0];
  }

  function applyBackground() {
    const usageData = loadUsageData();
    const selected = weightedRandomSelect();

    targetElement.style.backgroundImage = `url(${selected})`;
    targetElement.style.backgroundSize = 'cover';
    targetElement.style.backgroundPosition = 'center';
    targetElement.style.backgroundRepeat = 'no-repeat';

    usageData[selected] = (usageData[selected] || 0) + 1;
    saveUsageData(usageData);

    return selected;
  }

  // 修改这里：添加立即执行方法
  function applyImmediately() {
    targetElement.style.backgroundColor = '#f5f7fa';
    targetElement.style.transition = 'background-image 0.5s ease';
    applyBackground();
  }

  // 修改这里：让 bindToLoad 可以提前执行
  function bindToLoad(immediate = false) {
    if (immediate) {
      applyImmediately();
    }

    window.addEventListener('load', applyBackground);
  }

  return {
    applyBackground,
    bindToLoad,
    applyImmediately, // 新增方法
  };
}
