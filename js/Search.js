// 基于字符重合的简单相似度（不用 Levenshtein）
function getSimpleSimilarity(input, name) {
  if (!input || !name) return 0;
  const inputSet = new Set(input);
  const nameSet = new Set(name);
  let common = 0;
  inputSet.forEach(ch => {
    if (nameSet.has(ch)) common++;
  });
  return common / Math.max(inputSet.size, nameSet.size);
}

function showSuggestions() {
  const input = document.getElementById("searchInput").value.trim();
  const suggestionsBox = document.getElementById("suggestions");
  suggestionsBox.innerHTML = '';

  if (input === '') {
    suggestionsBox.style.display = 'none';
    return;
  }

  // 只要名字中包含任意一个字，就进入候选
  const candidateMatches = authors
    .filter(author => [...input].some(char => author.name.includes(char)))
    .map(author => ({
      author,
      score: getSimpleSimilarity(input, author.name)
    }))
    .sort((a, b) => b.score - a.score)  // 按相似度降序

  if (candidateMatches.length === 0) {
    suggestionsBox.style.display = 'none';
    return;
  }

  suggestionsBox.style.display = 'block';
  suggestionsBox.style.opacity = '0';
  setTimeout(() => {
    suggestionsBox.style.transition = 'opacity 0.3s ease-in-out';
    suggestionsBox.style.opacity = '1';
  }, 50);

  candidateMatches.forEach(match => {
    const item = document.createElement("div");
    item.className = "suggestion-item";
    item.textContent = `${match.author.name}（相似度：${(match.score * 100).toFixed(1)}%）`;

    item.onclick = () => {
      document.getElementById("searchInput").value = match.author.name;
      suggestionsBox.style.opacity = '0';
      setTimeout(() => {
        suggestionsBox.style.display = 'none';
      }, 300);
      scrollToAuthorCard();
    };

    suggestionsBox.appendChild(item);
  });
}


function normalize(str) {
  return str.trim();
}

function goToAuthorLink() {
  const input = document.getElementById("searchInput").value;
  const name = normalize(input);

  const author = authors.find(a => a.name === name);
  if (author) {
    const url = `https://yesandnoandperhaps.cn/categories/%E4%BD%9C%E8%80%85/${encodeURIComponent(author.link)}`;
    window.open(url, "_blank");
  } else {
    alert("未找到该作者页面: " + name);
  }
}

function scrollToAuthorCard() {
  const input = document.getElementById("searchInput").value;
  const name = normalize(input);

  const cards = document.querySelectorAll(".card img");
  let targetCard = null;
  let targetImg = null;

  cards.forEach(card => {
    if (card.alt === name) {
      targetCard = card.closest(".card");
      targetImg = card;
    }
  });

  if (targetCard && targetImg) {
    targetCard.scrollIntoView({ behavior: "smooth", block: "center" });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = targetImg;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < imgData.length; i += 4 * 100) {
      r += imgData[i];
      g += imgData[i + 1];
      b += imgData[i + 2];
      count++;
    }

    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

    if (brightness > 200) {
      let [h, s, l] = rgbToHsl(r, g, b);
      l *= 0.6;
      s = Math.min(1, s * 1.4);
      [r, g, b] = hslToRgb(h, s, l);
    }

    const shadowColor = `rgba(${r}, ${g}, ${b}, 0.75)`;

    // 应用样式和动画
    targetCard.style.transition = 'box-shadow 0.3s ease, transform 0.3s ease';
    targetCard.style.outline = "none";
    targetCard.style.boxShadow = `0 0 10px 4px ${shadowColor}`;

    setTimeout(() => {
      targetCard.style.boxShadow = "none";
      targetCard.style.transform = 'scale(1)';  // 恢复原始大小
    }, 8000);
  } else {
    alert("未找到该作者卡片: " + name);
  }
}

// rgb <-> hsl转换函数省略，沿用之前代码
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if(max === min){
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h /= 6;
  }
  return [h, s, l];
}

function hslToRgb(h, s, l) {
  let r, g, b;

  if(s === 0){
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}




