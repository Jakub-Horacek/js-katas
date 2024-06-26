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
  ENGLISH: { code: "en", name: "english", emoji: "🇺🇸" },
  CZECH: { code: "cs", name: "czech", emoji: "🇨🇿" },
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
    this.showWordUserInputScreen();
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
  wordsDifficultyDropdown.value = WordsDifficultyEnum.MEDIUM.code;
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
 * Create word user input screen
 * @method
 * @returns {DocumentFragment}
 */
App.prototype.createWordUserInputScreen = function () {
  const fragment = document.createDocumentFragment();
  const wordUserInputDiv = document.createElement("div");
  wordUserInputDiv.id = "word-user-input";
  wordUserInputDiv.classList.add("container");

  const wordUserInputTitle = document.createElement("h1");
  wordUserInputTitle.textContent = "Enter a word";
  wordUserInputDiv.appendChild(wordUserInputTitle);

  const wordUserInputInput = document.createElement("input");
  wordUserInputInput.id = "word-user-input-input";
  wordUserInputInput.type = "text";
  wordUserInputInput.maxLength = 20;
  wordUserInputDiv.appendChild(wordUserInputInput);

  const wordUserInputButtons = document.createElement("div");
  wordUserInputButtons.classList.add("container__buttons");

  const wordUserInputBackButton = document.createElement("button");
  wordUserInputBackButton.textContent = "Back";
  wordUserInputBackButton.addEventListener("click", this.showGameModeSelector.bind(this));
  wordUserInputButtons.appendChild(wordUserInputBackButton);

  const wordUserInputButton = document.createElement("button");
  wordUserInputButton.textContent = "Start the game";
  wordUserInputButton.addEventListener("click", this.handleWordUserInput.bind(this));
  wordUserInputButtons.appendChild(wordUserInputButton);

  wordUserInputDiv.appendChild(wordUserInputButtons);
  fragment.appendChild(wordUserInputDiv);
  return fragment;
};

/**
 * Handle word user input
 * @method
 * @param {Event} event
 */
App.prototype.handleWordUserInput = function (_event) {
  const word = document.getElementById("word-user-input-input").value;

  if (!this.isValid(word)) {
    document.getElementById("word-user-input-input").value = "";
    return;
  }

  this.showGameScreen(word);
};

/**
 * Show word user input screen
 * @method
 */
App.prototype.showWordUserInputScreen = function () {
  this.clearRenderElement();
  const fragment = this.createWordUserInputScreen();
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
    gameScreenHangmanImage.classList.add("hangman-image", "hidden");
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
    const char = document.createElement("span");
    char.classList.add("hidden");
    char.textContent = word[i];
    charDiv.appendChild(char);
    gameScreenWord.appendChild(charDiv);
  }
  gameScreenGuessArea.appendChild(gameScreenWord);

  const gameScreenInput = document.createElement("input");
  gameScreenInput.id = "game-screen-input";
  gameScreenInput.type = "text";
  gameScreenInput.maxLength = 1;
  gameScreenInput.addEventListener("keydown", this.handleKeyDown.bind(this));
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
 * Check if the input is valid
 * @method
 * @param {string} input (word or letter)
 * @returns {boolean} isValid
 */
App.prototype.isValid = function (input) {
  if (!input.match(/[a-zěščřžýáíéóůúďťň]/)) {
    console.warn(`Invalid input. The input (${input}) is not a letter`);
    return false;
  }
  return true;
};

/**
 * Handle key down
 * @method
 * @param {Event} event
 */
App.prototype.handleKeyDown = function (event) {
  if (event.key === "Enter") {
    this.handleGuess(event);
  }
};

/**
 * Handle guess
 * @method
 * @param {Event} event
 */
App.prototype.handleGuess = function (_event) {
  if (!this.canGuess) {
    return;
  }

  // Get the guessed letter
  const guessedLetter = document.getElementById("game-screen-input").value.toLowerCase();
  const word = document.getElementById("game-screen-word").children;

  // Check if the guessed letter is in the word
  let found = false;
  for (let i = 0; i < word.length; i++) {
    if (word[i].children[0].textContent.toLowerCase() === guessedLetter) {
      word[i].children[0].classList.remove("hidden");
      found = true;
    }
  }

  // Update used characters list
  const usedCharsList = document.getElementById("used-chars-list");
  const usedChars = usedCharsList.textContent ? usedCharsList.textContent.split(", ") : [];

  // Clear input
  document.getElementById("game-screen-input").value = "";

  // Check if the guessed letter is already in used characters
  if (usedChars.includes(guessedLetter)) {
    console.warn(`The letter ${guessedLetter.toUpperCase()} has already been used`);
    return;
  }

  // Check if the guessed letter is a letter
  if (!this.isValid(guessedLetter)) {
    return;
  }

  usedChars.push(guessedLetter);
  usedCharsList.textContent = usedChars.join(", ");

  // Check if the guessed letter is not in the word
  if (!found) {
    this.updateHangmanImage(); // If not found, update the hangman image
  }

  if (this.checkWin(word)) {
    this.gameOver(true);
  }
};

/**
 * Update hangman image
 * @method
 */
App.prototype.updateHangmanImage = function () {
  const hangmanImages = document.getElementById("game-screen-hangman-images").children;
  for (let i = 0; i < hangmanImages.length; i++) {
    if (hangmanImages[i].classList.contains("hidden")) {
      hangmanImages[i].classList.remove("hidden");
      this.stage = i;
      if (this.stage === hangmanImages.length - 1) {
        this.gameOver(false);
      }
      break;
    }
  }
};

/**
 * Check win condition
 * @method
 * @param {HTMLCollection} word
 * @returns {boolean}
 */
App.prototype.checkWin = function (word) {
  for (let i = 0; i < word.length; i++) {
    // Taking the first child of the word element because each letter is wrapped in a span element
    if (word[i].children[0].classList.contains("hidden")) {
      return false;
    }
  }
  return true;
};

/**
 * Create game over overlay
 * @method
 * @param {boolean} win
 * @returns {DocumentFragment}
 */
App.prototype.createGameOverLay = function (win) {
  const fragment = document.createDocumentFragment();
  const gameOverDiv = document.createElement("div");
  gameOverDiv.id = "game-over";
  gameOverDiv.classList.add("container");

  const gameOverTitle = document.createElement("h1");
  gameOverTitle.textContent = win ? "🏆 You won!" : "😢 You lost!";
  gameOverDiv.appendChild(gameOverTitle);

  const gameOverTextDiv = document.createElement("div");
  gameOverTextDiv.classList.add("container__wrapper--horizontal");

  const gameOverText = document.createElement("p");
  gameOverText.textContent = win ? "Congratulations! You have guessed the word!" : "You have lost! The word was:";
  gameOverTextDiv.appendChild(gameOverText);
  const gameOverWord = document.createElement("p");
  gameOverWord.classList.add("game-over-word");
  gameOverWord.textContent = document.getElementById("game-screen-word").textContent;
  gameOverTextDiv.appendChild(gameOverWord);

  gameOverDiv.appendChild(gameOverTextDiv);

  const gameOverButtons = document.createElement("div");
  gameOverButtons.classList.add("container__buttons");

  const gameOverMenuButton = document.createElement("button");
  gameOverMenuButton.textContent = "Main menu";
  gameOverMenuButton.addEventListener("click", this.showGameModeSelector.bind(this));
  gameOverButtons.appendChild(gameOverMenuButton);

  gameOverDiv.appendChild(gameOverButtons);
  fragment.appendChild(gameOverDiv);
  return fragment;
};

/**
 * Show game over overlay
 * @method
 * @param {boolean} win
 */
App.prototype.gameOver = function (win) {
  const fragment = this.createGameOverLay(win);
  this.canGuess = false;
  document.activeElement.blur();
  this.renderElement.appendChild(fragment);
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
  this.canGuess = true;
  document.getElementById("game-screen-input").focus();
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

  // Reset hangman images to hide all stages
  const hangmanImages = document.getElementById("game-screen-hangman-images").children;
  for (let i = 0; i < hangmanImages.length; i++) {
    hangmanImages[i].classList.add("hidden");
  }
};

/**
 * DOMContentLoaded event listener
 * @eventlistener
 */
document.addEventListener("DOMContentLoaded", () => {
  const appElement = document.getElementById("app");
  // Easy access to hangman images paths
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
