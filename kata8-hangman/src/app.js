import { getRandomWord } from "./library.js";

/**
 * Game mode enum
 * @enum {Object}
 * @readonly
 */
const GameModeEnum = {
  AGAINST_PC: { code: 1, name: "Player vs PC", rules: "You have to guess the word that the computer has chosen" },
  AGAINST_PLAYER: { code: 2, name: "Player vs player", rules: "You have to guess the word that the second player has chosen" },
};

/**
 * Words difficulty enum
 * @enum {Object}
 * @readonly
 */
const WordsDifficultyEnum = {
  EASY: { code: 1, name: "easy", rules: "Common nouns that are easy to guess and are not too long", emoji: "🥺" },
  MEDIUM: { code: 2, name: "medium", rules: "Common nouns that are a bit longer and harder to guess", emoji: "😎" },
  HARD: { code: 3, name: "hard", rules: "Common words that do not have to be nouns and are long and hard to guess", emoji: "😱" },
};

/**
 * Words language enum
 * @enum {Object}
 * @readonly
 */
const WordsLanguageEnum = {
  CZECH: { code: "cs", name: "czech", emoji: "🇨🇿" },
  ENGLISH: { code: "en", name: "english", emoji: "🇺🇸" },
};

/**
 * App
 * @constructor
 * @param {*} renderElement
 * @param {*} hangmanImages
 */
function App(renderElement, hangmanImages) {
  this.renderElement = renderElement;
  this.hangmanImages = hangmanImages;
}

/**
 * Clear render element
 * @method
 */
App.prototype.clearRenderElement = function () {
  this.renderElement.innerHTML = "";
};

/**
 * Create game mode selector
 * @method
 * @returns {DocumentFragment}
 */
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
    button.id = `game-mode-${GameModeEnum[gameMode].code}`;
    button.addEventListener("click", this.handleGameModeSelection.bind(this));
    gameModeSelectorButtons.appendChild(button);
  }
  gameModeSelectorDiv.appendChild(gameModeSelectorButtons);

  const gameModeSelectorRules = document.createElement("div");
  gameModeSelectorRules.classList.add("container__rules");
  const gameModeSelectorRulesTitle = document.createElement("h2");
  gameModeSelectorRulesTitle.textContent = "Rules";
  gameModeSelectorRules.appendChild(gameModeSelectorRulesTitle);
  for (const gameMode in GameModeEnum) {
    const rule = document.createElement("div");
    rule.classList.add("rule");
    rule.id = `rule-${GameModeEnum[gameMode].code}`;
    const ruleName = document.createElement("h3");
    ruleName.textContent = GameModeEnum[gameMode].name;
    rule.appendChild(ruleName);
    const ruleText = document.createElement("p");
    ruleText.textContent = GameModeEnum[gameMode].rules;
    rule.appendChild(ruleText);
    gameModeSelectorRules.appendChild(rule);
  }
  gameModeSelectorDiv.appendChild(gameModeSelectorRules);

  fragment.appendChild(gameModeSelectorDiv);
  return fragment;
};

/**
 * Show game mode selector
 * @method
 */
App.prototype.showGameModeSelector = function () {
  this.clearRenderElement();
  const fragment = this.createGameModeSelector();
  this.renderElement.appendChild(fragment);
};

/**
 * Handle game mode selection
 * @method
 * @param {Event} event
 */
App.prototype.handleGameModeSelection = function (event) {
  if (event.target.dataset.gameMode == GameModeEnum.AGAINST_PC.code) {
    this.showWordsDifficultySelector();
  } else {
    // TODO: show screen with input for the word
    // this.showWordsDifficultySelector()
  }
};

/**
 * Create words difficulty selector
 * @method
 * @returns {DocumentFragment}
 */
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
    option.textContent = `${WordsDifficultyEnum[wordsDifficulty].name} ${WordsDifficultyEnum[wordsDifficulty].emoji}`;
    wordsDifficultyDropdown.appendChild(option);
  }
  dropdowns.appendChild(wordsDifficultyDropdown);

  const wordsLanguageDropdown = document.createElement("select");
  wordsLanguageDropdown.id = "words-language-dropdown";
  wordsLanguageDropdown.classList.add("container__dropdown");
  for (const wordsLanguage in WordsLanguageEnum) {
    const option = document.createElement("option");
    option.value = WordsLanguageEnum[wordsLanguage].code;
    option.textContent = `${WordsLanguageEnum[wordsLanguage].name} ${WordsLanguageEnum[wordsLanguage].emoji}`;
    wordsLanguageDropdown.appendChild(option);
  }
  dropdowns.appendChild(wordsLanguageDropdown);

  wordsDifficultySelectorDiv.appendChild(dropdowns);

  const wordsDifficultySelectorRules = document.createElement("div");
  wordsDifficultySelectorRules.classList.add("container__rules");
  wordsDifficultySelectorRules.id = "words-difficulty-selector-rules";
  const wordsDifficultySelectorRulesTitle = document.createElement("h2");
  wordsDifficultySelectorRulesTitle.textContent = "Difficulties";
  wordsDifficultySelectorRules.appendChild(wordsDifficultySelectorRulesTitle);
  for (const wordsDifficulty in WordsDifficultyEnum) {
    const rule = document.createElement("div");
    rule.classList.add("rule");
    rule.id = `rule-${WordsDifficultyEnum[wordsDifficulty].code}`;
    const ruleName = document.createElement("h3");
    ruleName.textContent = `${WordsDifficultyEnum[wordsDifficulty].name} ${WordsDifficultyEnum[wordsDifficulty].emoji}`;
    rule.appendChild(ruleName);
    const ruleText = document.createElement("p");
    ruleText.textContent = WordsDifficultyEnum[wordsDifficulty].rules;
    rule.appendChild(ruleText);
    wordsDifficultySelectorRules.appendChild(rule);
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

/**
 * Show words difficulty selector
 * @method
 */
App.prototype.showWordsDifficultySelector = function () {
  this.clearRenderElement();
  const fragment = this.createWordsDifficultySelector();
  this.renderElement.appendChild(fragment);
};

/**
 * Create game screen
 * @method
 * @param {string} word
 * @returns {DocumentFragment}
 */
App.prototype.createGameScreen = function (word) {
  const fragment = document.createDocumentFragment();
  const gameScreenDiv = document.createElement("div");
  gameScreenDiv.id = "game-screen";
  gameScreenDiv.classList.add("container");

  const gameScreenTitle = document.createElement("h1");
  gameScreenTitle.textContent = "Hangman";
  gameScreenDiv.appendChild(gameScreenTitle);

  const usedChars = document.createElement("div");
  usedChars.id = "used-chars";

  const usedCharsTitle = document.createElement("h2");
  usedCharsTitle.textContent = "Used letters:";
  usedChars.appendChild(usedCharsTitle);
  const usedCharsList = document.createElement("div");
  usedCharsList.id = "used-chars-list";
  // TODO: add used chars
  usedCharsList.textContent = "A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y";
  usedChars.appendChild(usedCharsList);

  gameScreenDiv.appendChild(usedChars);

  const gameScreenWrapper = document.createElement("div");
  gameScreenWrapper.classList.add("container__wrapper--horizontal");

  const gameScreenHangmanImagesDiv = document.createElement("div");
  gameScreenHangmanImagesDiv.id = "game-screen-hangman-images";

  for (let i = 1; i <= Object.keys(this.hangmanImages).length; i++) {
    const gameScreenHangmanImage = document.createElement("img");
    gameScreenHangmanImage.src = this.hangmanImages[i];
    gameScreenHangmanImage.id = `game-screen-hangman-image-${i}`;
    gameScreenHangmanImage.classList.add("hangman-image");
    gameScreenHangmanImage.style.zIndex = i;
    gameScreenHangmanImagesDiv.appendChild(gameScreenHangmanImage);
  }
  gameScreenWrapper.appendChild(gameScreenHangmanImagesDiv);

  const gameScreenGuessArea = document.createElement("div");
  gameScreenGuessArea.classList.add("container__wrapper--vertical");

  const gameScreenWord = document.createElement("div");
  gameScreenWord.id = "game-screen-word";
  for (let i = 0; i < word.length; i++) {
    const charDiv = document.createElement("div");
    charDiv.classList.add("char");
    charDiv.textContent = word[i];
    gameScreenWord.appendChild(charDiv);
  }
  gameScreenGuessArea.appendChild(gameScreenWord);

  const gameScreenInput = document.createElement("input");
  gameScreenInput.id = "game-screen-input";
  gameScreenInput.type = "text";
  gameScreenInput.maxLength = 1;
  gameScreenGuessArea.appendChild(gameScreenInput);

  const gameScreenButtons = document.createElement("div");
  gameScreenButtons.classList.add("container__buttons");

  const gameScreenBackButton = document.createElement("button");
  gameScreenBackButton.id = "game-screen-back-button";
  gameScreenBackButton.textContent = "Back";
  gameScreenBackButton.addEventListener("click", this.showWordsDifficultySelector.bind(this));
  gameScreenButtons.appendChild(gameScreenBackButton);

  const gameScreenButton = document.createElement("button");
  gameScreenButton.id = "game-screen-button";
  gameScreenButton.textContent = "Guess";
  gameScreenButton.addEventListener("click", this.handleGuess.bind(this));
  gameScreenButtons.appendChild(gameScreenButton);

  gameScreenGuessArea.appendChild(gameScreenButtons);

  gameScreenWrapper.appendChild(gameScreenGuessArea);
  gameScreenDiv.appendChild(gameScreenWrapper);
  fragment.appendChild(gameScreenDiv);
  return fragment;
};

/**
 * Show game screen
 * @method
 * @param {string} word
 */
App.prototype.showGameScreen = function (word) {
  this.clearRenderElement();
  const fragment = this.createGameScreen(word);
  this.renderElement.appendChild(fragment);
};

/**
 * Handle guess
 * @method
 * @param {Event} event
 */
App.prototype.handleGuess = function (event) {
  console.log(event);
};

/**
 * Handle words difficulty selection
 * @method
 * @param {Event} event
 */
App.prototype.handleWordsDifficultySelection = function (_event) {
  this.selectedLanguage = document.getElementById("words-language-dropdown").value;
  this.selectedDifficulty = document.getElementById("words-difficulty-dropdown").value;

  const word = getRandomWord(this.selectedDifficulty, this.selectedLanguage);
  this.showGameScreen(word);
};

/**
 * DOMContentLoaded event listener
 */
document.addEventListener("DOMContentLoaded", () => {
  const appElement = document.getElementById("app");
  const hangmanImages = {
    1: "./images/hangman/stage_1.svg",
    2: "./images/hangman/stage_2.svg",
    3: "./images/hangman/stage_3.svg",
    4: "./images/hangman/stage_4.svg",
    5: "./images/hangman/stage_5.svg",
    6: "./images/hangman/stage_6.svg",
    7: "./images/hangman/stage_7.svg",
    8: "./images/hangman/stage_8.svg",
    9: "./images/hangman/stage_9.svg",
    10: "./images/hangman/stage_10_alt.svg",
  };

  const app = new App(appElement, hangmanImages);
  app.showGameModeSelector();
});
