/**
 * LevelEnum
 * @enum {number}
 * @readonly
 */
const LevelEnum = {
  SHORT: {
    grid: { rows: 10, cols: 10 },
    appleSpawnPoints: [
      { x: 5, y: 4 },
      { x: 2, y: 7 },
      { x: 5, y: 2 },
      { x: 7, y: 5 },
      { x: 8, y: 8 },
      { x: 1, y: 6 },
      { x: 4, y: 3 },
      { x: 9, y: 1 },
    ],
    snakeSpeed: 500,
  },
  MEDIUM: {
    grid: { rows: 15, cols: 15 },
    appleSpawnPoints: [
      { x: 3, y: 6 },
      { x: 2, y: 10 },
      { x: 1, y: 7 },
      { x: 13, y: 4 },
      { x: 12, y: 5 },
      { x: 14, y: 12 },
      { x: 9, y: 14 },
      { x: 6, y: 8 },
      { x: 11, y: 1 },
      { x: 5, y: 13 },
    ],
    snakeSpeed: 400,
  },
  LONG: {
    grid: { rows: 30, cols: 30 },
    appleSpawnPoints: [
      { x: 8, y: 14 },
      { x: 2, y: 27 },
      { x: 20, y: 10 },
      { x: 17, y: 22 },
      { x: 25, y: 25 },
      { x: 3, y: 4 },
      { x: 28, y: 28 },
      { x: 15, y: 15 },
      { x: 10, y: 9 },
      { x: 5, y: 5 },
      { x: 20, y: 17 },
      { x: 1, y: 25 },
      { x: 3, y: 4 },
      { x: 1, y: 1 },
      { x: 15, y: 8 },
    ],
    snakeSpeed: 200,
  },
};

/**
 * App
 * @constructor
 * @param {*} renderElement
 */
function App(renderElement) {
  this.renderElement = renderElement;
}

App.prototype.createLevelSelector = function () {
  const fragment = document.createDocumentFragment();

  const levelSelector = document.createElement("div");
  levelSelector.classList.add("level-selector");

  const levelSelectorTitle = document.createElement("h2");
  levelSelectorTitle.textContent = "Select a level";
  levelSelector.appendChild(levelSelectorTitle);

  const levelSelectorButtons = document.createElement("div");
  levelSelectorButtons.classList.add("level-selector__buttons");

  for (const level in LevelEnum) {
    const button = document.createElement("button");
    button.textContent = level;
    button.addEventListener("click", () => this.startGame(LevelEnum[level]));
    levelSelectorButtons.appendChild(button);
  }

  levelSelector.appendChild(levelSelectorButtons);
  fragment.appendChild(levelSelector);
  return fragment;
};

App.prototype.showLevelSelector = function () {
  const fragment = this.createLevelSelector();
  this.renderElement.appendChild(fragment);
};

App.prototype.emptyRenderElement = function () {
  this.renderElement.innerHTML = "";
};

App.prototype.startGame = function (level) {
  this.emptyRenderElement();
  const game = new Game(this.renderElement, level);
  game.start();
};

function Game(renderElement, level) {
  this.renderElement = renderElement;
  this.level = level;
  this.snake = [
    { x: 5, y: 5 },
    { x: 5, y: 4 },
  ];
  this.direction = "right";
  this.snakeSpeed = level.snakeSpeed;
  this.appleSpawnIndex = 0; // Initialize apple spawn point index
}

Game.prototype.createGameGrid = function () {
  const fragment = document.createDocumentFragment();
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const gameGrid = document.createElement("div");
  const gridWidth = isMobile ? 200 : 300;
  const gridHeight = isMobile ? 200 : 300;
  gameGrid.classList.add("game__grid");
  gameGrid.style.width = `${gridWidth}px`;
  gameGrid.style.height = `${gridHeight}px`;

  for (let i = 0; i < this.level.grid.rows; i++) {
    const row = document.createElement("div");
    row.classList.add("game__grid-row");
    for (let j = 0; j < this.level.grid.cols; j++) {
      const cell = document.createElement("div");
      cell.classList.add("game__grid-cell");
      cell.style.width = `${gridWidth / this.level.grid.cols}px`;
      cell.style.height = `${gridHeight / this.level.grid.rows}px`;
      row.appendChild(cell);
    }
    gameGrid.appendChild(row);
  }

  fragment.appendChild(gameGrid);
  return fragment;
};

Game.prototype.createGameScreen = function () {
  const fragment = document.createDocumentFragment();
  const gameElement = document.createElement("div");
  gameElement.classList.add("game");

  const gameTitle = document.createElement("h2");
  gameTitle.textContent = "Snake Game";
  gameElement.appendChild(gameTitle);

  const gameGrid = this.createGameGrid();
  gameElement.appendChild(gameGrid);

  fragment.appendChild(gameElement);
  return fragment;
};

Game.prototype.showGameScreen = function () {
  const fragment = this.createGameScreen();
  this.pauseScreen = this.createPauseScreen();
  this.gameOverScreen = this.createGameOverScreen();
  this.renderElement.appendChild(this.pauseScreen);
  this.renderElement.appendChild(this.gameOverScreen);
  this.renderElement.appendChild(fragment);
};

Game.prototype.createBackButton = function () {
  const fragment = document.createDocumentFragment();
  const button = document.createElement("button");
  button.classList.add("back-button");
  button.textContent = "Back to level selector";
  button.addEventListener("click", () => {
    this.renderElement.innerHTML = "";
    const app = new App(this.renderElement);
    clearInterval(this.gameLoop); // Stop the game loop
    app.showLevelSelector();
  });
  fragment.appendChild(button);
  return fragment;
};

Game.prototype.createPauseButton = function () {
  const fragment = document.createDocumentFragment();
  const button = document.createElement("button");
  button.classList.add("pause-button");
  button.textContent = "Pause";
  button.addEventListener("click", () => {
    this.showPauseScreen();
    clearInterval(this.gameLoop); // Pause the game loop
  });
  fragment.appendChild(button);
  return fragment;
};

Game.prototype.showBackButton = function () {
  const fragment = this.createBackButton();
  this.renderElement.appendChild(fragment);
};

Game.prototype.showPauseButton = function () {
  const fragment = this.createPauseButton();
  this.renderElement.appendChild(fragment);
};

Game.prototype.hidePauseButton = function () {
  this.renderElement.removeChild(this.renderElement.querySelector(".pause-button"));
};

Game.prototype.createPauseScreen = function () {
  const pauseScreen = document.createElement("div");
  pauseScreen.classList.add("pause-screen", "hidden");

  const pauseScreenTitle = document.createElement("h2");
  pauseScreenTitle.textContent = "Game Paused";
  pauseScreen.appendChild(pauseScreenTitle);

  const playButton = document.createElement("button");
  playButton.classList.add("play-button");
  playButton.textContent = "Play";
  playButton.addEventListener("click", () => {
    this.hidePauseScreen();
    this.setupGameLoop(); // Resume the game loop
  });
  pauseScreen.appendChild(playButton);

  return pauseScreen;
};

Game.prototype.setupGameLoop = function () {
  this.gameLoop = setInterval(() => {
    this.moveSnake();
  }, this.snakeSpeed);
};

Game.prototype.createGameOverScreen = function () {
  const gameOverScreen = document.createElement("div");
  gameOverScreen.classList.add("game-over-screen", "hidden");

  const gameOverTitle = document.createElement("h2");
  gameOverTitle.textContent = "Game Over";
  gameOverScreen.appendChild(gameOverTitle);

  return gameOverScreen;
};

Game.prototype.showPauseScreen = function () {
  this.pauseScreen.classList.remove("hidden");
};

Game.prototype.hidePauseScreen = function () {
  this.pauseScreen.classList.add("hidden");
};

Game.prototype.showGameOverScreen = function () {
  this.hidePauseButton();
  this.gameOverScreen.classList.remove("hidden");
};

Game.prototype.hideGameOverScreen = function () {
  this.gameOverScreen.classList.add("hidden");
};

Game.prototype.start = function () {
  this.showGameScreen();
  this.showPauseButton();
  this.showBackButton();
  this.spawnSnake();
  this.spawnApple();
  this.setupKeyboardControls();
  this.createGameOverScreen();
};

Game.prototype.spawnSnake = function () {
  const gameGrid = this.renderElement.querySelector(".game__grid");
  this.snake.forEach((segment) => {
    const cell = gameGrid.children[segment.y].children[segment.x];
    cell.classList.add("snake");
  });
};

Game.prototype.spawnApple = function () {
  const gameGrid = this.renderElement.querySelector(".game__grid");
  const appleSpawnPoint = this.level.appleSpawnPoints[this.appleSpawnIndex];

  // Check if the apple spawn point is not occupied by the snake
  const isAppleSpawnPointValid = !this.snake.some((segment) => segment.x === appleSpawnPoint.x && segment.y === appleSpawnPoint.y);

  if (isAppleSpawnPointValid) {
    const cell = gameGrid.children[appleSpawnPoint.y].children[appleSpawnPoint.x];
    cell.classList.add("apple");
  } else {
    // If the spawn point is occupied, move to the next spawn point
    this.appleSpawnIndex = (this.appleSpawnIndex + 1) % this.level.appleSpawnPoints.length;
    this.spawnApple(); // Recursively try to spawn the apple at the next spawn point
  }
};

Game.prototype.moveSnake = function () {
  const head = this.snake[0];
  let newHead = { x: head.x, y: head.y };

  switch (this.direction) {
    case "up":
      newHead.x--;
      break;
    case "down":
      newHead.x++;
      break;
    case "left":
      newHead.y--;
      break;
    case "right":
      newHead.y++;
      break;
  }

  // Check if the new head position is outside the game grid
  if (newHead.x < 0 || newHead.x >= this.level.grid.cols || newHead.y < 0 || newHead.y >= this.level.grid.rows) {
    clearInterval(this.gameLoop);
    this.showGameOverScreen();
    return;
  }

  // Check if the new head position collides with an apple
  const gameGrid = this.renderElement.querySelector(".game__grid");
  const cell = gameGrid.children[newHead.y].children[newHead.x];
  const hasApple = cell.classList.contains("apple");

  if (hasApple) {
    // Remove the apple
    cell.classList.remove("apple");

    // Increase the length of the snake
    this.snake.unshift(newHead);

    // Spawn a new apple at the next spawn point
    this.appleSpawnIndex = (this.appleSpawnIndex + 1) % this.level.appleSpawnPoints.length;
    this.spawnApple();
  } else {
    // Normal movement of the snake
    this.snake.unshift(newHead);

    // Remove the tail only if the snake doesn't eat an apple
    const tail = this.snake.pop();
    gameGrid.children[tail.y].children[tail.x].classList.remove("snake");
  }

  // Check for snake collision with itself
  const isSnakeCollided = this.snake.slice(1).some((segment) => segment.x === newHead.x && segment.y === newHead.y);

  if (isSnakeCollided) {
    clearInterval(this.gameLoop);
    this.showGameOverScreen();
    return;
  }

  // Update the appearance of the snake on the game grid
  gameGrid.children[newHead.y].children[newHead.x].classList.add("snake");
};

Game.prototype.setupKeyboardControls = function () {
  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        this.direction = "up";
        break;
      case "ArrowDown":
        this.direction = "down";
        break;
      case "ArrowLeft":
        this.direction = "left";
        break;
      case "ArrowRight":
        this.direction = "right";
        break;
    }
  });

  this.setupGameLoop();
};

/**
 * DOMContentLoaded event listener
 */
document.addEventListener("DOMContentLoaded", () => {
  const app = new App(document.getElementById("app"));
  app.showLevelSelector();
});
