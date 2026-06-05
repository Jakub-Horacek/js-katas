/**
 * Logger
 * @constructor
 */
function Logger() {
  this.prefix = "Typing Test";
}

/**
 * Logs message to console
 * @param {string} message - Message to log
 * @param {string} type - Log type (info, warn, error, debug, log)
 */
Logger.prototype.log = function (message, type = "log") {
  switch (type) {
    case "info":
      console.info(`%c${this.prefix} [INFO]: ${message}`, "color: lightblue;");
      break;
    case "warn":
      console.warn(`%c${this.prefix} [WARN]: ${message}`, "color: orange;");
      break;
    case "error":
      console.error(`%c${this.prefix} [ERROR]: ${message}`, "color: red;");
      break;
    case "debug":
      console.debug(`%c${this.prefix} [DEBUG]: ${message}`, "color: grey;");
      break;
    default:
      console.log(`%c${this.prefix} [${type.toUpperCase()}]: ${message}`, "color: white;");
  }
};

/**
 * The player.
 */
function Player() {}

/**
 * Resets the player's score and stats.
 */
Player.prototype.reset = function () {
  this.wpm = 0;
  this.wpmHighScore = 0;
  this.accuracy = "100%";
  this.correctWords = 0;
  this.wrongWords = 0;
  this.wordsTotal = 0;

  this.storageKey = "player.wpm.best";
};

/**
 * Save the player's high score.
 */
Player.prototype.saveHighScore = function () {
  localStorage.setItem(this.storageKey, this.wpm);
};

/**
 * Loads the player's high score.
 */
Player.prototype.loadHighScore = function () {
  this.wpmHighScore = JSON.parse(localStorage.getItem(this.storageKey)) ?? 0;
};

/**
 * The sentence lengths.
 * @enum {object}
 * @readonly
 */
const SentenceLengths = {
  SHORT: {
    min: 2,
    max: 15,
  },
  NORMAL: {
    min: 15,
    max: 50,
  },
  LONG: {
    min: 50,
    max: 100,
  },
};

/**
 * Test view screen
 * @constructor
 */
function TestViewScreen() {}

/**
 * Creates a test screen.
 * @static
 * @param {string} id The ID of the screen.
 * @param {string} title The title of the screen.
 * @returns {object} The screen with fragment, screen, and title elements.
 */
TestViewScreen.create = function (id, title) {
  const fragmentElement = document.createDocumentFragment();

  const screenElement = document.createElement("div");
  screenElement.id = `screen-${id}`;
  screenElement.classList.add("screen");

  const titleElement = document.createElement("h1");
  titleElement.classList.add("title");
  titleElement.textContent = title;

  screenElement.appendChild(titleElement);
  fragmentElement.appendChild(screenElement);

  return { fragmentElement, screenElement, titleElement };
};

/**
 * Test view restart button
 * @constructor
 */
function TestViewRestartButton() {}

/**
 * Creates a test restart button.
 * @static
 * @param {function} onClick The click handler for the restart button.
 * @returns {HTMLElement} The footer with a restart button.
 */
TestViewRestartButton.create = function (onClick) {
  const footerElement = document.createElement("footer");

  const restartButton = document.createElement("button");
  restartButton.classList.add("button");
  restartButton.classList.add("button--restart");

  const restartButtonIcon = document.createElement("div");
  restartButtonIcon.textContent = "🔄";
  restartButtonIcon.classList.add("button__child");
  restartButtonIcon.classList.add("button__icon");
  restartButton.appendChild(restartButtonIcon);

  const restartButtonText = document.createElement("div");
  restartButtonText.textContent = "Restart";
  restartButtonText.classList.add("button__child");
  restartButtonText.classList.add("button__text");
  restartButton.appendChild(restartButtonText);

  restartButton.addEventListener("click", onClick.bind(this));
  footerElement.appendChild(restartButton);

  return footerElement;
};

/**
 * TypingTest
 * @constructor
 * @param {{ debug: boolean; logger: Logger; viewScreen: typeof TestViewScreen; viewRestartButton: typeof TestViewRestartButton; }} [options]
 */
function TypingTest(
  options = {
    debug: false,
    logger: new Logger(),
    viewScreen: TestViewScreen,
    viewRestartButton: TestViewRestartButton,
  }
) {
  this.isDebug = options.debug;
  this.logger = options.logger;
  this.viewScreen = options.viewScreen;
  this.viewRestartButton = options.viewRestartButton;
}

/**
 * Creates the test options.
 * @returns {DocumentFragment} The test options.
 */
TypingTest.prototype.createTestOptions = function () {
  const isMobile = this.getDeviceType() === "mobile";
  const fragment = document.createDocumentFragment();

  const optionsDiv = document.createElement("div");
  optionsDiv.classList.add("wrapper");

  const title = document.createElement("h2");
  title.textContent = isMobile ? "Typing Test" : "Options";
  optionsDiv.appendChild(title);

  if (isMobile) {
    const message = document.createElement("h3");
    message.textContent = "Sorry. This app is not optimized for mobile devices. Please use a desktop or a tablet.";
    optionsDiv.appendChild(message);

    const explanation = document.createElement("p");
    explanation.innerHTML = "You were really going to try the <strong><u>Typing Test</u></strong> on a mobile device, weren't you? 😄";
    optionsDiv.appendChild(explanation);

    fragment.appendChild(optionsDiv);
    return fragment;
  }

  const sentenceLengthWrapper = document.createElement("div");
  sentenceLengthWrapper.classList.add("field-wrapper");
  optionsDiv.appendChild(sentenceLengthWrapper);

  const sentenceLengthLabel = document.createElement("label");
  sentenceLengthLabel.for = "sentences-length";
  sentenceLengthLabel.textContent = "Length of the generated sentences:";
  sentenceLengthWrapper.appendChild(sentenceLengthLabel);

  const sentenceLength = document.createElement("select");
  sentenceLength.id = "sentences-length";
  sentenceLength.name = "sentences-length";
  sentenceLengthWrapper.appendChild(sentenceLength);

  for (const length in SentenceLengths) {
    const lengthOption = document.createElement("option");
    lengthOption.value = length;
    lengthOption.textContent = `${length} (${SentenceLengths[length].min} - ${SentenceLengths[length].max})`;
    sentenceLength.appendChild(lengthOption);
  }

  sentenceLength.value = "NORMAL";

  const timeLimitWrapper = document.createElement("div");
  timeLimitWrapper.classList.add("field-wrapper");
  optionsDiv.appendChild(timeLimitWrapper);

  const timeLimitLabel = document.createElement("label");
  timeLimitLabel.for = "time-limit";
  timeLimitLabel.textContent = "Time limit:";
  timeLimitWrapper.appendChild(timeLimitLabel);

  const timeLimit = document.createElement("select");
  timeLimit.type = "select";
  timeLimit.id = "time-limit";
  timeLimit.name = "time-limit";
  timeLimitWrapper.appendChild(timeLimit);

  const debugDurations = [10, 30];
  const normalDurations = [60, 120, 300];
  const durations = this.isDebug ? [...debugDurations, ...normalDurations] : normalDurations;

  if (this.isDebug) {
    this.logger.log(`Time Limits:\n[${debugDurations}] = [DEBUG options]\n[${normalDurations}] = [STANDARD options]`, "debug");
  }

  durations.forEach((duration) => {
    const durationOption = document.createElement("option");
    durationOption.value = duration;
    durationOption.textContent = `${duration} seconds`;
    timeLimit.appendChild(durationOption);
  });

  timeLimit.value = 60;

  fragment.appendChild(optionsDiv);
  return fragment;
};

/**
 * Gets the test options.
 * @returns {object} The test options.
 */
TypingTest.prototype.getTestOptions = function () {
  const sentenceLengthSelect = document.querySelector("#sentences-length");
  const timerDurationSelect = document.querySelector("#time-limit");

  return {
    sentenceLength: SentenceLengths[sentenceLengthSelect.value],
    secondsDuration: timerDurationSelect.value,
  };
};

/**
 * Gets the user's device type by screen size.
 * @returns {string} The device type.
 */
TypingTest.prototype.getDeviceType = function () {
  const width = window.innerWidth;

  if (width < 768) {
    return "mobile";
  } else if (width < 1024) {
    return "tablet";
  } else {
    return "desktop";
  }
};

/**
 * Creates the intro screen.
 * @returns {DocumentFragment} The intro screen.
 */
TypingTest.prototype.createIntroScreen = function () {
  const screen = this.viewScreen.create("intro", "Welcome!");

  const testOptions = this.createTestOptions();
  screen.screenElement.appendChild(testOptions);

  const footerElement = document.createElement("footer");

  const startButton = document.createElement("button");
  startButton.classList.add("button");
  startButton.classList.add("button--start");

  const startButtonIcon = document.createElement("div");
  startButtonIcon.textContent = "▶️";
  startButtonIcon.classList.add("button__child");
  startButtonIcon.classList.add("button__icon");
  startButton.appendChild(startButtonIcon);

  const startButtonText = document.createElement("div");
  startButtonText.textContent = "Start";
  startButtonText.classList.add("button__child");
  startButtonText.classList.add("button__text");
  startButton.appendChild(startButtonText);

  startButton.addEventListener("click", () => {
    this.options = { ...this.options, config: this.getTestOptions() };
    this.removeIntroScreen();
    this.showTestScreen();
  });

  footerElement.appendChild(startButton);
  screen.screenElement.appendChild(footerElement);

  return screen.fragmentElement;
};

/**
 * Shows the intro screen.
 */
TypingTest.prototype.showIntroScreen = function () {
  const fragment = this.createIntroScreen();

  this.options.renderElement.appendChild(fragment);
};

/**
 * Removes the intro screen.
 */
TypingTest.prototype.removeIntroScreen = function () {
  const introScreen = document.querySelector("#screen-intro");

  if (introScreen) {
    introScreen.remove();
  }
};

/**
 * Generates a random integer in a given range
 * @param {number} min
 * @param {number} max
 * @returns the generated random integer.
 */
TypingTest.prototype.getRandomInt = function (min = 10, max = 50) {
  min = Math.ceil(min);
  max = Math.floor(max);

  const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;

  if (this.isDebug) {
    this.logger.log(`Random integer in a range [${min}-${max}] is: ${randomInt}`, "debug");
  }

  return randomInt;
};

/**
 * Normalizes and validates a word list from any source.
 * @param {unknown} words
 * @returns {string[]}
 */
TypingTest.prototype.normalizeWords = function (words) {
  if (!Array.isArray(words)) {
    return [];
  }

  return words
    .map((word) => String(word).trim().toLowerCase())
    .filter((word) => /^[a-z]+$/.test(word));
};

/**
 * Gets fallback words from the local customWords library.
 * @param {number} count
 * @returns {string[]}
 */
TypingTest.prototype.getFallbackWords = function (count = 10) {
  const fallbackLibrary = window.customWords ?? {};
  let group = "NORMAL";

  if (this.options?.config?.sentenceLength) {
    const { min, max } = this.options.config.sentenceLength;

    for (const key of Object.keys(fallbackLibrary)) {
      if (SentenceLengths[key]?.min === min && SentenceLengths[key]?.max === max) {
        group = key;
        break;
      }
    }
  }

  const pool = fallbackLibrary[group] ?? fallbackLibrary.NORMAL ?? [];

  if (pool.length === 0) {
    this.logger.log("Custom words library is empty.", "error");
    return [];
  }

  const shuffled = pool.slice().sort(() => Math.random() - 0.5);
  const words = [];

  while (words.length < count) {
    words.push(...shuffled);
  }

  return words.slice(0, count);
};

/**
 * Gets random words from the API with a local fallback.
 * @param {number} count of words to get from the API.
 * @returns {Promise<string[]>}
 */
TypingTest.prototype.getWords = function (count = 10) {
  const apiUrl = `https://random-word-api.herokuapp.com/word?number=${count}`;
  const fetchTimeoutMs = 5000;

  this.logger.log(`Generating ${count} random words.`, "info");

  if (this.isDebug) {
    this.logger.log(`HTTP Request ${apiUrl}`, "debug");
  }

  const useFallback = (reason, type = "warn") => {
    this.logger.log(`${reason} Using fallback words.`, type);
    return this.getFallbackWords(count);
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), fetchTimeoutMs);

  return fetch(apiUrl, { signal: controller.signal })
    .then((response) => {
      if (!response.ok) {
        return useFallback(`API responded with ${response.status}.`);
      }

      return response.json();
    })
    .then((data) => {
      const words = this.normalizeWords(data);

      if (words.length === 0) {
        return useFallback("API returned no usable words.");
      }

      return words.slice(0, count);
    })
    .catch((error) => {
      const reason = error.name === "AbortError" ? "API request timed out." : `API error: ${error.message}.`;
      return useFallback(reason, "error");
    })
    .finally(() => {
      clearTimeout(timeoutId);
    });
};

/**
 * Gets all the children elements of the sentence
 * @returns {HTMLCollection}
 */
TypingTest.prototype.getSentenceChildren = function () {
  return document.querySelector("#words").children;
};

/**
 * Builds the words container and fills it asynchronously.
 * @returns {Promise<HTMLElement>}
 */
TypingTest.prototype.createSentence = function () {
  const sentenceElement = document.createElement("div");
  sentenceElement.id = "words";

  const minLength = this.options.config.sentenceLength.min;
  const maxLength = this.options.config.sentenceLength.max;
  const wordCount = this.getRandomInt(minLength, maxLength);

  return this.getWords(wordCount).then((words) => {
    words.forEach((word) => {
      const wordElement = document.createElement("div");
      wordElement.classList.add("word");
      wordElement.textContent = word;
      sentenceElement.appendChild(wordElement);
    });

    if (words.length === 0) {
      sentenceElement.textContent = "Unable to load words. Please restart the test.";
    }

    return sentenceElement;
  });
};

/**
 * Replaces the current sentence and refreshes sentenceWords when ready.
 * @returns {Promise<void>}
 */
TypingTest.prototype.replaceSentence = function () {
  return this.createSentence().then((sentenceElement) => {
    const screen = this.getTestScreen();
    const oldSentence = screen?.querySelector("#words");

    if (screen && oldSentence) {
      screen.replaceChild(sentenceElement, oldSentence);
    }

    this.sentenceWords = this.getSentenceChildren();
  });
};

/**
 * Checks if the provided word matches the current one
 * @param {string} inputWord The provided word
 */
TypingTest.prototype.checkWordMatch = function (inputWord) {
  if (this.isLoadingSentence) {
    return;
  }

  if (this.wordIndex >= this.sentenceWords.length) {
    if (this.isDebug) {
      this.logger.log("Player has reached the end of the current sentence.", "debug");
    }

    this.isLoadingSentence = true;
    this.wordIndex = 0;

    return this.replaceSentence()
      .finally(() => {
        this.isLoadingSentence = false;
      })
      .then(() => {
        this.checkWordMatch(inputWord);
      });
  }

  const currentWordElement = this.sentenceWords.item(this.wordIndex);

  if (!currentWordElement) {
    return;
  }

  const currentWord = currentWordElement.textContent;

  this.currentPlayer.wordsTotal++;

  if (currentWord === inputWord) {
    this.logger.log("CORRECT");
    currentWordElement.classList.add("word--correct");
    this.currentPlayer.correctWords++;
  } else {
    this.logger.log("WRONG");
    currentWordElement.classList.add("word--wrong");
    this.currentPlayer.wrongWords++;
  }

  if (this.isDebug) {
    this.logger.log(`Current word index is: ${this.wordIndex}`, "debug");
    this.logger.log(`\nCorrect word: ${currentWord}\nYour input: ${inputWord}`, "debug");
  }
};

/**
 * <input> element's keydown handler
 * @param {event} event
 * @param {HTMLElement} inputElement
 */
TypingTest.prototype.handleInputEvent = function (event, inputElement) {
  if (event.code === "Enter" || event.code === "Space") {
    event.preventDefault();

    if (this.isLoadingSentence) {
      return;
    }

    const inputWord = inputElement.value.toLowerCase().trim();

    if (!inputWord) {
      return;
    }

    if (this.isDebug) {
      this.logger.log(`word "${inputWord}" submitted`, "debug");
    }

    const matchResult = this.checkWordMatch(inputWord);

    const advance = () => {
      this.wordIndex++;
      inputElement.value = "";
    };

    if (matchResult instanceof Promise) {
      matchResult.then(advance);
      return;
    }

    advance();
  }
};

/**
 * Creates an input element with a keydown event listener
 * @returns {DocumentFragment} input element
 */
TypingTest.prototype.createInput = function () {
  const fragment = document.createDocumentFragment();
  this.wordIndex = 0;

  const inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.id = "input";

  inputElement.addEventListener("keydown", (e) => this.handleInputEvent(e, inputElement));

  fragment.appendChild(inputElement);

  return fragment;
};

/**
 * Creates the timer.
 * @param {string} separator - default is ":"
 * @returns {DocumentFragment} timer
 */
TypingTest.prototype.createTimer = function (separator = ":") {
  const fragment = document.createDocumentFragment();

  const timerElement = document.createElement("div");
  timerElement.id = "timer";

  const iconElement = document.createElement("div");
  iconElement.id = "timer-icon";
  iconElement.innerText = "⏰";
  timerElement.appendChild(iconElement);

  const minutesElement = document.createElement("div");
  minutesElement.id = "time-minutes";
  minutesElement.classList.add("time");
  minutesElement.classList.add("time--minutes");
  minutesElement.innerText = 0;
  timerElement.appendChild(minutesElement);

  const separatorElement = document.createElement("div");
  separatorElement.classList.add("time");
  separatorElement.classList.add("time--separator");
  separatorElement.innerText = separator;
  timerElement.appendChild(separatorElement);

  const secondsElement = document.createElement("div");
  secondsElement.id = "time-seconds";
  secondsElement.classList.add("time");
  secondsElement.classList.add("time--seconds");
  secondsElement.innerText = 0;
  timerElement.appendChild(secondsElement);

  fragment.appendChild(timerElement);

  return fragment;
};

/**
 * Gets the test screen element
 * @returns test screen element
 */
TypingTest.prototype.getTestScreen = function () {
  return document.querySelector("#screen-test");
};

/**
 * Creates the test screen.
 * @returns {DocumentFragment} The test screen.
 */
TypingTest.prototype.createTestScreen = function () {
  const screen = this.viewScreen.create("test", "Typing Test");

  const loadingElement = document.createElement("div");
  loadingElement.id = "words";
  loadingElement.classList.add("words--loading");
  loadingElement.textContent = "Loading words...";
  screen.screenElement.appendChild(loadingElement);

  const input = this.createInput();
  screen.screenElement.appendChild(input);

  const timer = this.createTimer();
  screen.screenElement.appendChild(timer);

  const restartButton = this.viewRestartButton.create(() => {
    console.clear();
    this.logger.log("Restarted", "info");
    this.currentPlayer.reset();
    this.removeTestScreen();
    this.showIntroScreen();
  });

  screen.screenElement.appendChild(restartButton);

  return screen;
};

/**
 * Shows the test screen.
 */
TypingTest.prototype.showTestScreen = function () {
  this.isLoadingSentence = true;

  const screen = this.createTestScreen();

  this.options.renderElement.appendChild(screen.fragmentElement);

  this.replaceSentence()
    .then(() => {
      document.querySelector("#input")?.focus();
      this.runTest();
    })
    .finally(() => {
      this.isLoadingSentence = false;
    });
};

/**
 * Removes the test screen.
 */
TypingTest.prototype.removeTestScreen = function () {
  const testScreen = document.querySelector("#screen-test");

  if (testScreen) {
    testScreen.remove();
  }
};

/**
 * Creates the end screen.
 * @returns {DocumentFragment} The end screen.
 */
TypingTest.prototype.createEndScreen = function () {
  const screen = this.viewScreen.create("end", "Game Over");

  const statsWrapper = document.createElement("div");
  statsWrapper.classList.add("wrapper");

  const statsTitle = document.createElement("h2");
  statsTitle.textContent = "Your Statistics";
  statsWrapper.appendChild(statsTitle);

  const wpmElement = document.createElement("div");
  wpmElement.textContent = `🕒 WPM: ${this.currentPlayer.wpm}`;
  wpmElement.title = "Words Per Minute";
  statsWrapper.appendChild(wpmElement);

  const bestWpmElement = document.createElement("div");
  bestWpmElement.textContent = `🏁 Best WPM: ${this.currentPlayer.wpmHighScore}`;
  bestWpmElement.title = "Words Per Minute - Highscore";
  statsWrapper.appendChild(bestWpmElement);

  const accuracyElement = document.createElement("div");
  accuracyElement.textContent = `🎯 Accuracy: ${this.currentPlayer.accuracy}`;
  statsWrapper.appendChild(accuracyElement);

  const correctElement = document.createElement("div");
  correctElement.textContent = `✅ Correct words: ${this.currentPlayer.correctWords}`;
  statsWrapper.appendChild(correctElement);

  const wrongElement = document.createElement("div");
  wrongElement.textContent = `❌ Wrong words: ${this.currentPlayer.wrongWords}`;
  statsWrapper.appendChild(wrongElement);

  const restartButton = this.viewRestartButton.create(() => {
    console.clear();
    this.logger.log("Restarted", "info");
    this.currentPlayer.reset();
    this.removeEndScreen();
    this.showIntroScreen();
  });

  screen.screenElement.appendChild(statsWrapper);
  screen.screenElement.appendChild(restartButton);

  return screen.fragmentElement;
};

/**
 * Shows the end screen.
 */
TypingTest.prototype.showEndScreen = function () {
  const fragment = this.createEndScreen();

  this.options.renderElement.appendChild(fragment);
};

/**
 * Removes the end screen.
 */
TypingTest.prototype.removeEndScreen = function () {
  const endScreen = document.querySelector("#screen-end");

  if (endScreen) {
    endScreen.remove();
  }
};

/**
 * Calculates and returns the Words Per Minute (WPM).
 * @param {number} seconds The duration of the whole Typing Test
 * @returns WPM
 */
TypingTest.prototype.getWpm = function (seconds) {
  const wpm = Math.round((this.currentPlayer.correctWords / seconds) * 60);

  if (this.isDebug) {
    this.logger.log(`\nWPM Calculation:\nMath.floor(${this.currentPlayer.correctWords} / ${seconds} * 60) = ${wpm}`, "debug");
  }

  return wpm;
};

/**
 * Calculates and returns the Player Accuracy.
 * @returns {number} 0 when the Accuracy is Not A Number
 * @returns {string} accuracy percentage
 */
TypingTest.prototype.getAccuracy = function () {
  const accuracy = Math.round((this.currentPlayer.correctWords / this.currentPlayer.wordsTotal) * 100);

  if (this.isDebug) {
    this.logger.log(
      `\nAccuracy Calculation:\nMath.round((${this.currentPlayer.correctWords} / ${this.currentPlayer.wordsTotal}) * 100) = ${accuracy}`,
      "debug"
    );
  }

  if (isNaN(accuracy) || accuracy == null) {
    return 0;
  }

  return accuracy;
};

TypingTest.prototype.gameOver = function () {
  this.currentPlayer.loadHighScore();

  this.currentPlayer.wpm = this.getWpm(this.options.config.secondsDuration);
  this.currentPlayer.accuracy = `${this.getAccuracy()}%`;

  if (this.currentPlayer.wpm > this.currentPlayer.wpmHighScore) {
    if (this.isDebug) {
      this.logger.log(`Saving new WPM highscore (${this.currentPlayer.wpm})`, "debug");
    }
    this.currentPlayer.saveHighScore();
  }

  this.removeTestScreen();
  this.showEndScreen();
};

/**
 * Starts the timer.
 * @param {number} totalSeconds
 * @returns
 */
TypingTest.prototype.startTimer = function (totalSeconds) {
  // NOTE: "~~" is a shortcut for "Math.floor"
  const minutes = ~~(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // TODO - provide the element itself instead of getting it by the querySelector
  document.querySelector("#time-minutes").innerText = minutes;
  document.querySelector("#time-seconds").innerText = seconds;

  if (totalSeconds === 0) {
    this.logger.log("TIME OUT!");
    document.querySelector("#timer-icon").innerText = "🟥";

    this.gameOver();
    return;
  }

  return setTimeout(() => {
    this.startTimer(--totalSeconds);
  }, 1000);
};

/**
 * Runs the Typing Test.
 */
TypingTest.prototype.runTest = function () {
  this.logger.log("Started", "info");

  const timerSecondsDuration = this.options.config.secondsDuration;
  this.startTimer(timerSecondsDuration);

  if (this.isDebug) {
    this.logger.log(`${timerSecondsDuration} seconds timer started`, "debug");
  }
};

/**
 * Initailization of the whole App.
 * @param {options} options
 */
TypingTest.prototype.init = function (
  options = {
    renderElement: null,
  }
) {
  this.options = options;

  if (!this.options.renderElement) {
    this.logger.log("init - No render element provided", "warn");
  }

  this.currentPlayer = new Player();
  this.currentPlayer.reset();
};

/**
 * Handles DOMContentLoaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const debug = urlParams.get("debug") == "true";

  const logger = new Logger();
  const test = new TypingTest({
    debug: debug,
    logger: logger,
    viewScreen: TestViewScreen,
    viewRestartButton: TestViewRestartButton,
  });

  const appElement = document.querySelector("#app");

  test.init({ renderElement: appElement });

  logger.log(
    `\n- DOMContentLoaded, Test initialized with DEBUG mode ${
      debug ? "ON" : 'OFF\n- To turn the DEBUG mode ON, add "?debug=true" parameter to the end of the URL'
    }`,
    "info"
  );

  test.showIntroScreen();
});
