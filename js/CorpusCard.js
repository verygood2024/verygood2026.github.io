const cards = document.querySelectorAll('.head-content .card');

function applyCardAnimations() {
    const totalAnimationDuration = 2; // 总时长
    const numCards = cards.length;

    if (numCards > 1) {
        const averageDelay = totalAnimationDuration / (numCards - 1);

        cards.forEach((card, index) => {
            if (card.classList.contains('start') || card.classList.contains('end')) {
                if (index === 0) {
                    card.style.animationDelay = '0s';
                } else {
                    const delayTime = averageDelay * (index - 1);
                    card.style.animationDelay = `${delayTime}s`;
                }
                card.style.animationDuration = `${totalAnimationDuration}s`;
            } else {
                card.style.animationDelay = '';
                card.style.animationDuration = '';
            }
        });
    } else if (
        numCards === 1 &&
        (cards[0].classList.contains('start') || cards[0].classList.contains('end'))
    ) {
        cards[0].style.animationDelay = '0s';
        cards[0].style.animationDuration = `${totalAnimationDuration}s`;
    }
}

