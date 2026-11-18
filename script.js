const messages = {
  wave: { icon: '👋', text: '彥辰和惠玲互相揮揮手，今天也要有好心情！' },
  highfive: { icon: '🙌', text: '啪！兩個人成功擊掌，默契 +1！' },
  hug: { icon: '🫂', text: '彥辰和惠玲給彼此一個溫暖的友善擁抱。' },
  cheer: { icon: '✨', text: '彥辰：「一起加油！」 惠玲：「今天也要順利！」' },
  fight: { icon: '😤', text: '兩個人鬧彆扭了，互動值 -1。' },
  makeup: { icon: '🫂', text: '抱抱和好！兩個人重新開心地和好了，互動值回到 0。' }
};
const result = document.getElementById('result');
const photoWrap = document.getElementById('photoWrap');
const couplePhoto = document.querySelector('.couple-photo');
const bondCount = document.getElementById('bondCount');
const bondFill = document.getElementById('bondFill');
const bondProgress = document.getElementById('bondProgress');
const bondHint = document.getElementById('bondHint');
const bonusBtn = document.getElementById('bonusBtn');
const makeupBtn = document.getElementById('makeupBtn');
const TARGET_POINTS = 10;
const MIN_POINTS = -5;
let interactionPoints = 0;
let bonusUnlocked = false;

function showResult(message) {
  result.innerHTML = `<span class="result-icon">${message.icon}</span><p>${message.text}</p>`;
  result.classList.remove('pop');
  void result.offsetWidth;
  result.classList.add('pop');
}
function showScene(file) {
  couplePhoto.src = file;
}
document.querySelectorAll('.action-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const type = button.dataset.action;
    if (type === 'fight') {
      interactionPoints = Math.max(MIN_POINTS, interactionPoints - 1);
      showScene('scene-fight.jpg');
      showResult(messages.fight);
      makeSparkles(5);
    } else {
      interactionPoints = Math.min(TARGET_POINTS, interactionPoints + 1);
      showScene('couple.png');
      showResult(messages[type]);
      makeSparkles(type === 'hug' ? 9 : 5);
    }
    updateBondMeter();
    if (interactionPoints === TARGET_POINTS && !bonusUnlocked) unlockBonusAnimation();
  });
});
function updateBondMeter() {
  bondCount.textContent = `${interactionPoints} / 10`;
  bondFill.style.width = `${((interactionPoints - MIN_POINTS) / (TARGET_POINTS - MIN_POINTS)) * 100}%`;
  bondProgress.setAttribute('aria-valuenow', interactionPoints);
  bondProgress.setAttribute('aria-valuemin', MIN_POINTS);
  makeupBtn.hidden = interactionPoints !== MIN_POINTS;
  if (interactionPoints === MIN_POINTS) {
    bondHint.textContent = '互動值已到 -5！可以按「抱抱和好」恢復到 0。';
  } else if (interactionPoints >= TARGET_POINTS) {
    bondHint.textContent = '已達成 10 點！特別慶祝動畫已解鎖 🎉';
  } else {
    bondHint.textContent = `目前互動值 ${interactionPoints}；吵架會 -1，一般互動會 +1。`;
  }
}
function unlockBonusAnimation() {
  bonusUnlocked = true;
  bonusBtn.hidden = false;
  showResult({icon:'🎊', text:'互動累積值達到 10 點！彥辰和惠玲解鎖了特別慶祝動畫！'});
  playBonusAnimation();
}
function playBonusAnimation() {
  photoWrap.classList.remove('milestone');
  void photoWrap.offsetWidth;
  photoWrap.classList.add('milestone');
  makeSparkles(26);
  setTimeout(() => photoWrap.classList.remove('milestone'), 1900);
}
bonusBtn.addEventListener('click', playBonusAnimation);
makeupBtn.addEventListener('click', () => {
  if (interactionPoints !== MIN_POINTS) return;
  interactionPoints = 0;
  showScene('scene-makeup.jpg');
  showResult(messages.makeup);
  updateBondMeter();
  makeSparkles(20);
});
function makeSparkles(amount) {
  const rect = photoWrap.getBoundingClientRect();
  for (let i = 0; i < amount; i++) {
    const sparkle = document.createElement('span');
    sparkle.className = 'floating-heart';
    sparkle.textContent = ['♡', '♥', '✦', '✨', '🌸'][Math.floor(Math.random() * 5)];
    sparkle.style.left = `${Math.max(8, Math.min(window.innerWidth - 30, rect.left + Math.random() * rect.width))}px`;
    sparkle.style.top = `${Math.max(10, rect.top + rect.height * (0.25 + Math.random() * 0.5))}px`;
    sparkle.style.color = ['#e98ba8', '#e9b4c3', '#d6a0c7'][i % 3];
    document.body.appendChild(sparkle);
    sparkle.addEventListener('animationend', () => sparkle.remove());
  }
}
