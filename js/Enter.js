function initOverlayScrollWatcher(overlayEl, cardEls) {
    const handleEntry = (isIntersecting) => {
        if (isIntersecting) {
            cardEls.forEach(card => card.classList.remove('end'));
            cardEls.forEach(card => card.classList.add('start'));
            applyCardAnimations?.();
        } else {
            cardEls.forEach(card => card.classList.remove('start'));
            cardEls.forEach(card => card.classList.add('end'));
            applyCardAnimations?.();
        }
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            handleEntry(entry.isIntersecting);
        });
    }, {
        threshold: 0.1
    });

    observer.observe(overlayEl);

    const rect = overlayEl.getBoundingClientRect();
    const isIntersecting = rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1;
    handleEntry(isIntersecting);
}


initOverlayScrollWatcher(
    document.getElementById('section2'),
    document.querySelectorAll('#作者方形 .card')
);

initOverlayScrollWatcher(
    document.getElementById('section2'),
    document.querySelectorAll('#文集方形 .card')
);

