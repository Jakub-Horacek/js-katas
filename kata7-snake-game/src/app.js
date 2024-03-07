/**
 * LevelEnum
 * @enum {number}
 * @readonly
 */
const LevelEnum = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  RANDOM: 4,
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

  const levelSelectorTitle = document.createElement("h2");
  levelSelectorTitle.textContent = "Select level";
  fragment.appendChild(levelSelectorTitle);

  const levelSelectorButtons = document.createElement("div");
  levelSelectorButtons.classList.add("level-selector-buttons");

  for (const level in LevelEnum) {
    const button = document.createElement("button");
    button.textContent = level;
    button.addEventListener("click", () => this.startGame(LevelEnum[level]));
    levelSelectorButtons.appendChild(button);
  }

  fragment.appendChild(levelSelectorButtons);
  return fragment;
};

App.prototype.showLevelSelector = function () {
  const fragment = this.createLevelSelector();
  this.renderElement.appendChild(fragment);
};

/**
 * DOMContentLoaded event listener
 */
document.addEventListener("DOMContentLoaded", () => {
  const app = new App(document.getElementById("app"));
  app.showLevelSelector();
});
