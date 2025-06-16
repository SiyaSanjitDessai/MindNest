document.addEventListener("DOMContentLoaded", () => {
  const board = document.querySelector(".game-board");
  const restart = document.querySelector(".restart");
  const attemptsDisplay = document.getElementById("attempts");
  const timerDisplay = document.getElementById("timer");
  const winMessage = document.getElementById("win");

  let timerInterval;
  let time = 0;

  const allEmojis = [
    "🌈", "😊", "💕", "✨", "🌸", "🍰", "🌟", "🐶",
    "🎵", "🔥", "🎈", "🌻", "🐱", "🎮", "🚀", "🍕",
    "🦄", "🌙"
  ];

  const flipSound = new Audio("sounds/flip.mp3");
  const winSound = new Audio("sounds/win.mp3");

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let attempts = 0;
  let matchedPairs = 0;
  let currentEmojis = [];

  function startTimer() {
    time = 0;
    timerDisplay.textContent = time;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      time++;
      timerDisplay.textContent = time;
    }, 1000);
  }

  function updateAttempts() {
    attempts++;
    attemptsDisplay.textContent = attempts;
  }

  function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }

  function checkMatch() {
    const firstEmoji = firstCard.querySelector(".back").textContent;
    const secondEmoji = secondCard.querySelector(".back").textContent;

    if (firstEmoji === secondEmoji) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");
      matchedPairs += 2;

      if (matchedPairs === currentEmojis.length * 2) {
        clearInterval(timerInterval);
        setTimeout(() => {
          winSound.play();
          winMessage.style.display = "block";
        }, 500);
      }

      resetTurn();
    } else {
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetTurn();
      }, 800);
    }
  }

  function createCard(emoji) {
    const card = document.createElement("div");
    card.classList.add("tile");

    const inner = document.createElement("div");
    inner.classList.add("tile-inner");

    const front = document.createElement("div");
    front.classList.add("front");

    const back = document.createElement("div");
    back.classList.add("back");
    back.textContent = emoji;

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener("click", () => {
      if (
        lockBoard ||
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
      ) return;

      flipSound.play();
      card.classList.add("flipped");

      if (!firstCard) {
        firstCard = card;
        return;
      }

      secondCard = card;
      lockBoard = true;
      updateAttempts();
      checkMatch();
    });

    return card;
  }

  function updateBoardGrid(level) {
    if (level === "easy") {
      board.style.gridTemplateColumns = "repeat(2, 100px)";
      board.style.gridTemplateRows = "repeat(2, 100px)";
      board.style.gap = "15px";
      updateTileSize(100);
    } else if (level === "medium") {
      board.style.gridTemplateColumns = "repeat(4, 100px)";
      board.style.gridTemplateRows = "repeat(4, 100px)";
      board.style.gap = "15px";
      updateTileSize(100);
    } else if (level === "hard") {
      board.style.gridTemplateColumns = "repeat(6, 70px)";
      board.style.gridTemplateRows = "repeat(6, 70px)";
      board.style.gap = "8px";
      updateTileSize(70);
    }
  }

  function updateTileSize(size) {
    const style = document.createElement("style");
    style.innerHTML = `
      .tile {
        width: ${size}px;
        height: ${size}px;
      }
    `;
    document.head.appendChild(style);
  }

  function startGame() {
    const level = localStorage.getItem("selectedLevel") || "medium";

    board.innerHTML = "";
    attempts = 0;
    matchedPairs = 0;
    attemptsDisplay.textContent = attempts;
    winMessage.style.display = "none";
    resetTurn();

    let emojiCount = 0;
    if (level === "easy") emojiCount = 2;
    else if (level === "medium") emojiCount = 8;
    else if (level === "hard") emojiCount = 18;

    currentEmojis = allEmojis.slice(0, emojiCount);
    const shuffled = [...currentEmojis, ...currentEmojis].sort(() => 0.5 - Math.random());

    updateBoardGrid(level);
    shuffled.forEach((emoji) => board.appendChild(createCard(emoji)));

    startTimer();
  }

  restart.addEventListener("click", startGame);
  startGame();

});