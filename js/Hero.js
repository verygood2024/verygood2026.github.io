createBackgroundRotator({
  images: [
    "../backgrounds/0.png",
    "../backgrounds/2.jpg",
  ],
  target: '.hero-section',  // 这里传入选择器，指定改哪个元素背景
  expireKey: 'hero-bg-expire',  // 可以单独定expireKey，防止和其他背景冲突
  storageKey: 'hero-bg-usage',  // 也可以单独设置存储Key
  expireTime: 10 * 60 * 1000,  // 比如10分钟后过期
}).bindToLoad();
