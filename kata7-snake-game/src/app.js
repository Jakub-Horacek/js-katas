/**
 * LevelEnum
 * @enum {number}
 * @readonly
 */
const LevelEnum = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
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
}

Game.prototype.createGameScreen = function () {
  const fragment = document.createDocumentFragment();
  const gameElement = document.createElement("div");
  gameElement.classList.add("game");

  const gameTitle = document.createElement("h2");
  gameTitle.textContent = "Snake Game";
  gameElement.appendChild(gameTitle);

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
};

/**
 * DOMContentLoaded event listener
 */
document.addEventListener("DOMContentLoaded", () => {
  const app = new App(document.getElementById("app"));
  app.showLevelSelector();
});
