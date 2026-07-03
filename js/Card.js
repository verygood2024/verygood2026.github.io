function createAuthorCards(authors, containerId,
                           withMask = true, withText = true,
                           path="./image/",
                           defaultLink="https://yesandnoandperhaps.cn/categories/%E4%BD%9C%E8%80%85/") {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`容器 #${containerId} 未找到`);
    return;
  }

  authors.forEach(author => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = `${path}${author.image}`;
    img.alt = author.name;

    if (withMask) {
      const mask = document.createElement("div");
      mask.className = "card-mask";
      card.appendChild(mask);
    }

    const link = document.createElement("a");
    link.href = `${defaultLink}${encodeURIComponent(author.link)}`;

    if (withText) {
      const wrapper = document.createElement("div");
      wrapper.className = "card-tile-text-wrapper";

      const text = document.createElement("div");
      text.className = "card-tile-text";
      text.textContent = author.name;

      wrapper.appendChild(text);
      card.appendChild(wrapper);
    }

    card.appendChild(img);
    card.appendChild(link);
    container.appendChild(card);
  });
}

