const ballsContainer = document.getElementById('balls');
const spinButton = document.getElementById('spinButton');
const playerInput = document.getElementById('playerName');
const playerList = document.getElementById('playerList');
const resultOverlay = document.getElementById('resultOverlay');
const resultImage = document.getElementById('resultImage');
const blindBoxContainer = document.getElementById('blindBoxContainer');
const spinSound = document.getElementById('spinSound');
const dropSound = document.getElementById('dropSound');

const rewards = Array.from({ length: 16 }, (_, i) => `images/${i + 1}.png`);

// 🧩 Ánh xạ số → tên
const rewardNames = {
  "1": "T.HUY",
  "2": "Đ.Anh",
  "3": "Pháp",
  "4": "Hiếu",
  "5": "Quang",
  "6": "Huân",
  "7": "T.Đạt",
  "8": "Bảo",
  "9": "Quyết",
  "10": "",
  "11": "",
  "12": "",
  "13": "",
  "14": "",
  "15": "",
  "16": ""
};

const rigged = { 
  "Diệu": "images/6.png",
  "Như": "images/10.png",
  "Vy": "images/7.png",
  "Yến": "images/1.png"
};

let usedRewards = [];
let players = [];

// 🎀 Bóng pastel nằm yên trong bể
const pastelColors = [
  '#ffd8e8', '#ffc3e1', '#ffb6d6', '#ffe8a3', '#b0d5ff',
  '#a8f5ff', '#c4ffb0', '#ffd5b0', '#e6b0ff', '#b0fff6'
];

// Xóa bóng cũ (nếu có)
ballsContainer.innerHTML = '';

// Tạo hiệu ứng “đầy đặn” bằng nhiều hàng bóng
for (let row = 0; row < 3; row++) {
  for (let i = 0; i < 8; i++) {
    const ball = document.createElement('div');
    ball.classList.add('ball');
    const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
    ball.style.background = color;
    ball.style.width = '35px';
    ball.style.height = '35px';
    ball.style.borderRadius = '50%';
    ball.style.position = 'absolute';
    ball.style.bottom = `${row * 35}px`;
    ball.style.left = `${i * 28 + Math.random() * 5}px`;
    ball.style.transition = 'transform 0.3s ease';
    ballsContainer.appendChild(ball);
  }
}

function spin() {
  const name = playerInput.value.trim();
  if (!name) return alert("Nhập tên người quay!");

  blindBoxContainer.innerHTML = '';
  blindBoxContainer.style.display = 'none';
  blindBoxContainer.style.opacity = '0';

  spinSound.play();
  spinButton.disabled = true;

  const glass = document.querySelector('.glass');
  if (glass) {
    glass.classList.add('shake');
    setTimeout(() => glass.classList.remove('shake'), 800);
  }

  const fallingBall = document.getElementById('fallingBall');
  const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
  fallingBall.style.background = randomColor;
  fallingBall.style.left = 'calc(50% - 20px)';
  fallingBall.style.top = '20px';
  fallingBall.style.display = 'block';
  fallingBall.style.animation = 'none';
  void fallingBall.offsetWidth;
  fallingBall.style.animation = 'dropBall 1.4s cubic-bezier(0.33, 1, 0.68, 1) forwards';

  setTimeout(() => {
    fallingBall.style.display = 'none';
    dropSound.play();

    let chosenReward;
    if (rigged[name]) {
      chosenReward = rigged[name];
    } else {
      const available = rewards.filter(r => !usedRewards.includes(r) && !Object.values(rigged).includes(r));
      if (available.length === 0) {
        alert("Hết phần thưởng!");
        return;
      }
      chosenReward = available[Math.floor(Math.random() * available.length)];
    }

    usedRewards.push(chosenReward);

    const fileNum = chosenReward.split('/').pop().split('.')[0];
    const rewardDisplayName = rewardNames[fileNum] || fileNum;

    players.push({ name, reward: chosenReward, rewardName: rewardDisplayName });

    const li = document.createElement('li');
    li.textContent = `${name} → ${rewardDisplayName}`;
    li.style.cursor = "pointer";
    li.onclick = () => revealReward(chosenReward);
    playerList.appendChild(li);

    showBlindBoxes(chosenReward, li);
  }, 1600);
}

function showBlindBoxes(chosenReward, listItem) {
  blindBoxContainer.innerHTML = '';
  blindBoxContainer.style.display = 'flex';
  blindBoxContainer.style.opacity = '1';
  blindBoxContainer.style.transition = 'none';

  const grid = document.createElement('div');
  grid.classList.add('blind-box-grid');
  blindBoxContainer.appendChild(grid);

  for (let i = 1; i <= 16; i++) {
    const box = document.createElement('div');
    box.classList.add('blind-box');
    box.textContent = i;

    box.onclick = () => {
      box.style.pointerEvents = 'none';
      blindBoxContainer.innerHTML = '';
      blindBoxContainer.style.display = 'none';
      blindBoxContainer.style.opacity = '0';
      blindBoxContainer.classList.remove('visible');
      revealReward(chosenReward);
    };

    grid.appendChild(box);
  }

  setTimeout(() => {
    blindBoxContainer.removeAttribute('style');
    blindBoxContainer.style.display = 'flex';
    blindBoxContainer.style.opacity = '1';
  }, 50);
}

// 🌟 Hiển thị phần thưởng
function revealReward(reward) {
  const fileNum = reward.split('/').pop().split('.')[0];
  const nameLabel = rewardNames[fileNum] || fileNum;

  resultOverlay.innerHTML = '';

  const container = document.createElement('div');
  container.classList.add('image-container');

  const img = document.createElement('img');
  img.src = reward;
  img.alt = nameLabel;

  const label = document.createElement('div');
  label.classList.add('player-name');
  label.textContent = nameLabel;

  container.appendChild(img);
  container.appendChild(label);
  resultOverlay.appendChild(container);

  resultOverlay.style.display = 'flex';
  setTimeout(() => {
    resultOverlay.style.display = 'none';
    spinButton.disabled = false;
    playerInput.value = '';
    playerInput.focus();
  }, 2500);
}

spinButton.addEventListener('click', spin);

