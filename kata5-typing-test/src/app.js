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
      console.log(
        `%c${this.prefix} [${type.toUpperCase()}]: ${message}`,
        "color: white;",
      );
  }
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
  },
) {
  this.isDebug = options.debug;
  this.logger = options.logger;
  this.viewScreen = options.viewScreen;
  this.viewRestartButton = options.viewRestartButton;
}

/**
 * Creates the intro screen.
 * @returns {DocumentFragment} The intro screen.
 */
TypingTest.prototype.createIntroScreen = function () {
  const screen = this.viewScreen.create("intro", "Welcome!");

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
    this.logger.log(
      `Random integer in a range [${min}-${max}] is: ${randomInt}`,
      "debug",
    );
  }

  return randomInt;
};

/**
 * Gets random words from the API
 * @param {number} count of words to get from the API.
 * @returns {Promise} The promise object with response
 */
TypingTest.prototype.getWords = function (count = 10) {
  const apiUrl = `https://random-word-api.herokuapp.com/word?number=${count}`;

  this.logger.log(`Generating ${count} random words.`, "info");

  if (this.isDebug) {
    this.logger.log(`HTTP Request ${apiUrl}`, "debug");
  }

  return new Promise((resolve, reject) => {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          reject(new Error("Network response was not ok"));
        }

        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * Creates a sentece of a random words.
 * @returns {DocumentFragment} The sentece.
 */
TypingTest.prototype.createSentence = function () {
  const fragment = document.createDocumentFragment();

  const sentenceElement = document.createElement("div");
  sentenceElement.id = "words";

  this.getWords(this.getRandomInt()).then(function (data) {
    const words = data;

    words.forEach((word) => {
      const wordElement = document.createElement("div");
      wordElement.classList.add("word");
      wordElement.innerText = word;
      sentenceElement.appendChild(wordElement);
    });
  });

  fragment.appendChild(sentenceElement);

  return fragment;
};

TypingTest.prototype.createInput = function () {
  const fragment = document.createDocumentFragment();

  const inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.focus();

  inputElement.addEventListener(
    "keydown",
    function (event) {
      if (event.code === "Enter" || event.code === "Space") {
        event.preventDefault();

        if (this.isDebug) {
          this.logger.log(`word [${inputElement.value}] submitted`, "debug");
        }

        inputElement.value = "";
      }
    }.bind(this),
    false,
  );

  fragment.appendChild(inputElement);

  return fragment;
};

/**
 * Creates the test screen.
 * @returns {DocumentFragment} The test screen.
 */
TypingTest.prototype.createTestScreen = function () {
  const screen = this.viewScreen.create("test", "Typing Test");

  const sentence = this.createSentence();
  screen.screenElement.appendChild(sentence);

  const input = this.createInput();
  screen.screenElement.appendChild(input);

  const restartButton = this.viewRestartButton.create(() => {
    this.logger.log("Restarted", "info");
    this.removeTestScreen();
    this.showIntroScreen();
  });

  screen.screenElement.appendChild(restartButton);

  return screen.fragmentElement;
};

/**
 * Shows the test screen.
 */
TypingTest.prototype.showTestScreen = function () {
  const fragment = this.createTestScreen();

  this.options.renderElement.appendChild(fragment);

  this.runTest();
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

TypingTest.prototype.runTest = function () {
  this.logger.log("Started", "info");
};

TypingTest.prototype.init = function (
  options = {
    renderElement: null,
  },
) {
  this.options = options;

  if (!this.options.renderElement) {
    this.logger.log("init - No render element provided", "warn");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const logger = new Logger();
  const test = new TypingTest({
    debug: true,
    logger: logger,
    viewScreen: TestViewScreen,
    viewRestartButton: TestViewRestartButton,
  });

  const appElement = document.querySelector("#app");

  test.init({ renderElement: appElement });

  logger.log("DOMContentLoaded, Test initialized.", "info");

  test.showIntroScreen();
});
