/**
 * Game mode enum
 * @enum {Object}
 */
const GameModeEnum = {
  AGAINST_PC: { code: 1, name: "Player vs PC", rules: "You have to guess the word that the computer has chosen" },
  AGAINST_PLAYER: { code: 2, name: "Player vs player", rules: "You have to guess the word that the second player has chosen" },
};

/**
 * Words difficulty enum
 * @enum {Object}
 */
const WordsDifficultyEnum = {
  EASY: { code: 1, name: "easy", rules: "Common nouns that are easy to guess and are not too long" },
  MEDIUM: { code: 2, name: "medium", rules: "Common nouns that are a bit longer and harder to guess" },
  HARD: { code: 3, name: "hard", rules: "Common words that do not have to be nouns and are long and hard to guess" },
};

const WordsLanguageEnum = {
  CZECH: 1,
  ENGLISH: 2,
};

/**
 * App
 * @constructor
 * @param {*} renderElement
 */
function App(renderElement) {
  this.renderElement = renderElement;
}

App.prototype.clearRenderElement = function () {
  this.renderElement.innerHTML = "";
};

App.prototype.createGameModeSelector = function () {
  const fragment = document.createDocumentFragment();
  const gameModeSelectorDiv = document.createElement("div");
  gameModeSelectorDiv.id = "game-mode-selector";
  gameModeSelectorDiv.classList.add("container");

  const gameModeSelectorTitle = document.createElement("h1");
  gameModeSelectorTitle.textContent = "Select a game mode";
  gameModeSelectorDiv.appendChild(gameModeSelectorTitle);

  const gameModeSelectorButtons = document.createElement("div");
  gameModeSelectorButtons.classList.add("container__buttons");
  for (const gameMode in GameModeEnum) {
    const button = document.createElement("button");
    button.textContent = GameModeEnum[gameMode].name;
    button.dataset.gameMode = GameModeEnum[gameMode].code;
    button.addEventListener("click", this.handleGameModeSelection.bind(this));
    gameModeSelectorButtons.appendChild(button);
  }
  gameModeSelectorDiv.appendChild(gameModeSelectorButtons);

  const gameModeSelectorRules = document.createElement("div");
  const gameModeSelectorRulesTitle = document.createElement("h2");
  gameModeSelectorRulesTitle.textContent = "Rules";
  gameModeSelectorRules.appendChild(gameModeSelectorRulesTitle);
  for (const gameMode in GameModeEnum) {
    const ruleName = document.createElement("h3");
    ruleName.textContent = GameModeEnum[gameMode].name;
    const ruleText = document.createElement("p");
    ruleText.textContent = GameModeEnum[gameMode].rules;
    gameModeSelectorRules.appendChild(ruleName);
    gameModeSelectorRules.appendChild(ruleText);
  }
  gameModeSelectorDiv.appendChild(gameModeSelectorRules);

  fragment.appendChild(gameModeSelectorDiv);
  return fragment;
};

App.prototype.showGameModeSelector = function () {
  this.clearRenderElement();
  const fragment = this.createGameModeSelector();
  this.renderElement.appendChild(fragment);
};

App.prototype.handleGameModeSelection = function (event) {
  if (event.target.dataset.gameMode == GameModeEnum.AGAINST_PC.code) {
    this.showWordsDifficultySelector();
  } else {
    // TODO: show screen with input for the word
    // this.showWordsDifficultySelector()
  }
};

App.prototype.createWordsDifficultySelector = function () {
  const fragment = document.createDocumentFragment();
  const wordsDifficultySelectorDiv = document.createElement("div");
  wordsDifficultySelectorDiv.id = "words-difficulty-selector";
  wordsDifficultySelectorDiv.classList.add("container");

  const wordsDifficultySelectorTitle = document.createElement("h1");
  wordsDifficultySelectorTitle.textContent = "Select words difficulty and language";
  wordsDifficultySelectorDiv.appendChild(wordsDifficultySelectorTitle);

  const dropdowns = document.createElement("div");
  dropdowns.classList.add("container__dropdowns");

  const wordsDifficultyDropdown = document.createElement("select");
  wordsDifficultyDropdown.id = "words-difficulty-dropdown";
  wordsDifficultyDropdown.classList.add("container__dropdown");
  for (const wordsDifficulty in WordsDifficultyEnum) {
    const option = document.createElement("option");
    option.value = WordsDifficultyEnum[wordsDifficulty].code;
    option.textContent = WordsDifficultyEnum[wordsDifficulty].name;
    wordsDifficultyDropdown.appendChild(option);
  }
  dropdowns.appendChild(wordsDifficultyDropdown);

  const wordsLanguageDropdown = document.createElement("select");
  wordsLanguageDropdown.id = "words-language-dropdown";
  wordsLanguageDropdown.classList.add("container__dropdown");
  for (const wordsLanguage in WordsLanguageEnum) {
    const option = document.createElement("option");
    option.value = WordsLanguageEnum[wordsLanguage];
    option.textContent = wordsLanguage.toLowerCase();
    wordsLanguageDropdown.appendChild(option);
  }
  dropdowns.appendChild(wordsLanguageDropdown);

  wordsDifficultySelectorDiv.appendChild(dropdowns);

  const wordsDifficultySelectorRules = document.createElement("div");
  const wordsDifficultySelectorRulesTitle = document.createElement("h2");
  wordsDifficultySelectorRulesTitle.textContent = "Rules";
  wordsDifficultySelectorRules.appendChild(wordsDifficultySelectorRulesTitle);
  for (const wordsDifficulty in WordsDifficultyEnum) {
    const ruleName = document.createElement("h3");
    ruleName.textContent = WordsDifficultyEnum[wordsDifficulty].name;
    const ruleText = document.createElement("p");
    ruleText.textContent = WordsDifficultyEnum[wordsDifficulty].rules;
    wordsDifficultySelectorRules.appendChild(ruleName);
    wordsDifficultySelectorRules.appendChild(ruleText);
  }
  wordsDifficultySelectorDiv.appendChild(wordsDifficultySelectorRules);

  const buttons = document.createElement("div");
  buttons.classList.add("container__buttons");

  const backButton = document.createElement("button");
  backButton.textContent = "Back";
  backButton.addEventListener("click", this.showGameModeSelector.bind(this));
  buttons.appendChild(backButton);

  const startGameButton = document.createElement("button");
  startGameButton.textContent = "Start the game";
  startGameButton.addEventListener("click", this.handleWordsDifficultySelection.bind(this));
  buttons.appendChild(startGameButton);

  wordsDifficultySelectorDiv.appendChild(buttons);

  fragment.appendChild(wordsDifficultySelectorDiv);
  return fragment;
};

App.prototype.showWordsDifficultySelector = function () {
  this.clearRenderElement();
  const fragment = this.createWordsDifficultySelector();
  this.renderElement.appendChild(fragment);
};

App.prototype.handleWordsDifficultySelection = function (event) {
  this.selectedLanguage = document.getElementById("words-language-dropdown").value;
  this.selectedDifficulty = document.getElementById("words-difficulty-dropdown").value;
  console.log(this.selectedLanguage);
  console.log(this.selectedDifficulty);
  // this.showGameScreen();
};

/**
 * DOMContentLoaded event listener
 */
document.addEventListener("DOMContentLoaded", () => {
  const app = new App(document.getElementById("app"));
  app.showGameModeSelector();
});
