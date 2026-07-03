const rotator = createBackgroundRotator({
  images: [
    "../backgrounds/0.png",
    "../backgrounds/2.jpg",
  ],
  target: 'body',
  storageKey: 'backgrounds0',
  expireKey: 'backgrounds1',
  expireTime: 15 * 60 * 1000,
});

rotator.applyImmediately();