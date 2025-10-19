const ballsContainer = document.getElementById('balls');
const spinButton = document.getElementById('spinButton');
const playerInput = document.getElementById('playerName');
const playerList = document.getElementById('playerList');
const resultOverlay = document.getElementById('resultOverlay');
const blindBoxContainer = document.getElementById('blindBoxContainer');
const spinSound = document.getElementById('spinSound');
const dropSound = document.getElementById('dropSound');

const WEBHOOK_URL = "https://discord.com/api/webhooks/1429299860057886800/th8xdmx75ghLFKjaSL9RLeN7TLzEjzHYD6XhRo34p7ZvSPfiv3bzzS8IZfTZzQMcMFNN"; // 🔧 Thay bằng link webhook của bạn

const rewards = Array.from({ length: 17 }, (_, i) => `images/${i + 1}.png`);

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
  "10": "Nhật",
  "11": "Long",
  "12": "Đ.cương",
  "13": "V.Cường",
  "14": "Mì Cay 50k",
  "15": "Huy Gián",
  "16": "Hiếu CUTE",
  "17": "Long nghiêm túc"
};

const rigged = { 
  "Như": "images/1.png"
};

// 🌸 Thơ riêng cho từng người
const poems = {
  "1": "Cầu bay theo gió, lòng anh bay theo,\nEm vung vợt nhẹ — tim anh khẽ reo.", //huy dung
  "2": "chưa có lời chúc :))",//d.anh
  "3": "chưa có lời chúc :))",//phap
  "4": "chưa có lời chúc :))",//hieu
  "5": "chưa có lời chúc :))",//quang
  "6": "Dưới cơn mưa Anh vẫn cười,\nVì đời có gió có trời có Em.",//huan
  "7": "Đêm khuya tỉnh giấc mơ màn,\nNhớ nàng sục mãi cây hàng ốm o.",//t.dat
  "8": "Bảo ngồi ngắm lá vàng rơi,\nThấy đời là thấy em xinh vãi ò.",//bao
  "9": "Anh đi giữa trời đêm tối,\nMang ánh sáng thắp lại tim em.",//quyet
  "10": "Ngắm trăng giữa đêm khuya,\nLòng chợt nhớ về những ngày yêu em.",//nhat
  "11": "Chúc chị em 20/10 vui vẻ nhé!",//long
  "12": "chưa có lời chúc :))",//d.cuong
  "13": "chưa có lời chúc :))",//v.cuong
  "14": "Chúc bạn 20/10 vui vẻ,\nxinh đẹp và hạnh phúc nhé! 💖",//my cay
  "15": "chưa có lời chúc :))",//huy gian
  "16": "chưa có lời chúc :))",//hieu cute
  "17": "chưa có lời chúc :))"//long nghiem tuc
};

let usedRewards = [];
let players = [];

const pastelColors = [
  '#ffd8e8', '#ffc3e1', '#ffb6d6', '#ffe8a3', '#b0d5ff',
  '#a8f5ff', '#c4ffb0', '#ffd5b0', '#e6b0ff', '#b0fff6'
];

// 💫 Vẽ các viên bóng
ballsContainer.innerHTML = '';
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

// 🎯 Hàm gửi webhook
async function sendWebhook(playerName, rewardName) {
  if (!WEBHOOK_URL || WEBHOOK_URL.includes("XXXX")) {
    console.warn("⚠️ Chưa cấu hình Discord webhook URL!");
    return;
  }
  const payload = {
    username: "🎁 Quà Tặng Nè 🎀",
    content: `💖 **${playerName}** vừa quay trúng **${rewardName}**! 💫`
  };

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("✅ Đã gửi webhook thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi gửi webhook:", err);
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

    // 💌 Gửi webhook Discord
    sendWebhook(name, rewardDisplayName);

    const li = document.createElement('li');
    li.textContent = `${name} → ${rewardDisplayName}`;
    li.style.cursor = "pointer";
    li.onclick = () => revealReward(chosenReward);
    playerList.appendChild(li);

    showBlindBoxes(chosenReward);
  }, 1600);
}

function showBlindBoxes(chosenReward) {
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

function revealReward(reward) {
  const fileNum = reward.split('/').pop().split('.')[0];
  const nameLabel = rewardNames[fileNum] || fileNum;
  const poemText = poems[fileNum] || "Khoảnh khắc lặng im, tim khẽ rung rinh.";

  resultOverlay.innerHTML = '';

  const container = document.createElement('div');
  container.classList.add('image-container');
  container.style.position = 'relative';
  container.style.textAlign = 'center';

  const img = document.createElement('img');
  img.src = reward;
  img.alt = nameLabel;
  img.style.borderRadius = '20px';
  img.style.maxHeight = '450px';
  img.style.objectFit = 'cover';
  img.style.display = 'block';
  img.style.margin = '0 auto';
  img.style.animation = 'zoomIn 0.6s ease forwards';

  const label = document.createElement('div');
  label.classList.add('player-name');
  label.textContent = nameLabel;
  label.style.animationDelay = '0.6s';

  const poemBox = document.createElement('div');
  poemBox.classList.add('poem-box');
  poemBox.style.position = 'absolute';
  poemBox.style.bottom = '0';
  poemBox.style.left = '50%';
  poemBox.style.transform = 'translateX(-50%)';
  poemBox.style.width = '85%';
  poemBox.style.padding = '20px';
  poemBox.style.background = 'rgba(255, 255, 255, 0.25)';
  poemBox.style.backdropFilter = 'blur(10px)';
  poemBox.style.borderBottomLeftRadius = '20px';
  poemBox.style.borderBottomRightRadius = '20px';
  poemBox.style.textAlign = 'center';
  poemBox.style.color = '#ff0000ff';
  poemBox.style.fontSize = '17px';
  poemBox.style.fontStyle = 'italic';
  poemBox.style.opacity = '0';
  poemBox.style.whiteSpace = 'pre-line';

  container.appendChild(img);
  container.appendChild(label);
  container.appendChild(poemBox);
  resultOverlay.appendChild(container);

  resultOverlay.style.display = 'flex';
  resultOverlay.style.alignItems = 'center';
  resultOverlay.style.justifyContent = 'center';

  setTimeout(() => {
    poemBox.classList.add('show', 'typing');
    typePoem(poemBox, poemText);
  }, 1000);

  resultOverlay.onclick = (e) => {
    if (e.target === resultOverlay) {
      resultOverlay.style.display = 'none';
      spinButton.disabled = false;
      playerInput.value = '';
      playerInput.focus();
    }
  };
}

function typePoem(element, text) {
  element.textContent = '';
  let line = 0;
  let index = 0;
  const lines = text.split('\n');

  function nextChar() {
    if (line < lines.length) {
      if (index < lines[line].length) {
        element.textContent += lines[line][index];
        index++;
        setTimeout(nextChar, 50);
      } else {
        element.textContent += '\n';
        line++;
        index = 0;
        setTimeout(nextChar, 400);
      }
    }
  }

  element.style.opacity = '1';
  nextChar();
}

spinButton.addEventListener('click', spin);
