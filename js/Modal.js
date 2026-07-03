function openModal(id) {
  const modal = document.getElementById(id);
  const content = modal.querySelector('.modal-content');

  modal.classList.add('show');
  content.style.animation = 'scaleIn 0.3s ease forwards';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  const content = modal.querySelector('.modal-content');

  // 先播放关闭动画
  content.style.animation = 'scaleOut 0.25s ease forwards';

  // 动画结束后隐藏
  setTimeout(() => {
    modal.classList.remove('show');
  }, 250);
}

// 点击背景关闭
window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal.show');
  modals.forEach(modal => {
    if (event.target === modal) {
      closeModal(modal.id);
    }
  });
};
