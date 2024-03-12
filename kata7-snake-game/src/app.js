/**
 * LevelEnum
 * @enum {number}
 * @readonly
 */
const LevelEnum = {
  SHORT: {
    grid: { rows: 10, cols: 10 },
  },
  MEDIUM: {
    grid: { rows: 15, cols: 15 },
  },
  LONG: {
    grid: { rows: 30, cols: 30 },
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
  this.setupKeyboardControls();
};

Game.prototype.spawnSnake = function () {
  const gameGrid = this.renderElement.querySelector(".game__grid");
  this.snake.forEach((segment) => {
    const cell = gameGrid.children[segment.y].children[segment.x];
    cell.classList.add("snake");
  });
};

Game.prototype.moveSnake = function () {
  const head = this.snake[0];
  let newHead = { x: head.x, y: head.y };

  switch (this.direction) {
    case "up":
      newHead.y--;
      break;
    case "down":
      newHead.y++;
      break;
    case "left":
      newHead.x--;
      break;
    case "right":
      newHead.x++;
      break;
  }

  // Check if the new head position is outside the game grid
  if (newHead.x < 0 || newHead.x >= this.level.grid.cols || newHead.y < 0 || newHead.y >= this.level.grid.rows) {
    // TODO: Show a game over message
    return; // Exit the function to stop the game
  }

  this.snake.unshift(newHead);
  const tail = this.snake.pop();
  const gameGrid = this.renderElement.querySelector(".game__grid");
  gameGrid.children[tail.y].children[tail.x].classList.remove("snake");
  gameGrid.children[newHead.y].children[newHead.x].classList.add("snake");
};

Game.prototype.setupKeyboardControls = function () {
  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        if (this.direction !== "down") this.direction = "up";
        break;
      case "ArrowDown":
        if (this.direction !== "up") this.direction = "down";
        break;
      case "ArrowLeft":
        if (this.direction !== "right") this.direction = "left";
        break;
      case "ArrowRight":
        if (this.direction !== "left") this.direction = "right";
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
