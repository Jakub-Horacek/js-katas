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
    ],
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
    ],
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
      { x: 10, y: 10 },
    ],
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
    { x: 4, y: 5 },
  ];
  this.direction = "right";
  this.snakeSpeed = 500; // 500
  this.appleSpawnIndex = 0; // Initialize apple spawn point index
}

Game.prototype.createGameGrid = function () {
  const fragment = document.createDocumentFragment();
  const gameGrid = document.createElement("div");
  const gridWidth = 300;
  const gridHeight = 300;
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
    app.showLevelSelector();
  });
  fragment.appendChild(button);
  return fragment;
};

Game.prototype.showBackButton = function () {
  const fragment = this.createBackButton();
  this.renderElement.appendChild(fragment);
};

Game.prototype.start = function () {
  this.showGameScreen();
  this.showBackButton();
  this.spawnSnake();
  this.spawnApple();
  this.setupKeyboardControls();
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
    // TODO: Show a game over message
    return; // Exit the function to stop the game
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
    // TODO: Show a game over message
    return; // Exit the function to stop the game
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

  setInterval(() => {
    this.moveSnake();
  }, this.snakeSpeed); // Adjust the interval to control the speed of the snake
};

/**
 * DOMContentLoaded event listener
 */
document.addEventListener("DOMContentLoaded", () => {
  const app = new App(document.getElementById("app"));
  app.showLevelSelector();
});
