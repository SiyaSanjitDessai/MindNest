const gameArea = document.getElementById("gameArea");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const popSound = document.getElementById("popSound");
const gameOverScreen = document.getElementById("gameOver");
const finalScoreEl = document.getElementById("finalScore");

let score = 0;
let timeLeft = 30;
let bubbleInterval = 1000;
let bubbleSpawner;
let timerCountdown;

function startGame() {
  // Reset
  score = 0;
  timeLeft = 30;
  bubbleInterval = 1000;
  scoreEl.textContent = "0";
  timerEl.textContent = timeLeft;
  gameOverScreen.classList.add("hidden");
  gameArea.innerHTML = "";

  // Start timer
  timerCountdown = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }

    // Difficulty scaling every 5 seconds
    if (timeLeft % 5 === 0 && bubbleInterval > 400) {
      bubbleInterval -= 100;
      clearInterval(bubbleSpawner);
      bubbleSpawner = setInterval(createBubble, bubbleInterval);
    }
  }, 1000);

  // Start bubble spawner
  bubbleSpawner = setInterval(createBubble, bubbleInterval);
}

function spawnConfetti(quantity = 40) {
  for (let i = 0; i < quantity; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.setProperty('--hue', Math.random());
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
  }
}

function endGame() {
  clearInterval(timerCountdown);
  clearInterval(bubbleSpawner);
  finalScoreEl.textContent = score;
  gameOverScreen.classList.remove("hidden");
  gameOverScreen.style.display = "block";
  gameOverScreen.style.animation = "fadeIn 0.5s ease-in-out";

  const endSound = document.getElementById("endSound");
  if (endSound) endSound.play().catch(err => console.error("End sound error:", err));

  spawnConfetti();
}

function createBubble() {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");

  bubble.style.left = Math.random() * (window.innerWidth - 60) + "px";

  const pop = () => {
    score++;
    scoreEl.textContent = score;
    bubble.remove();

    if (popSound) {
      popSound.currentTime = 0;
      popSound.play().catch((err) => console.error("Audio play error:", err));
    }
  };

  bubble.addEventListener("click", pop);
  bubble.addEventListener("touchstart", pop);

  gameArea.appendChild(bubble);

  setTimeout(() => bubble.remove(), 8000); // Match this with CSS float speed if increased
}

// Auto start game
window.onload = startGame;
