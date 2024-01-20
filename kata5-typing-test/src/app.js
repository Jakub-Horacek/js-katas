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
 * @param {string} type - Log type
 */
Logger.prototype.log = function (message, type = "info") {
  switch (type) {
    case "info":
      console.info(`${this.prefix} [INFO]: ${message}`);
      break;
    case "warn":
      console.warn(`${this.prefix} [WARN]: ${message}`);
      break;
    case "error":
      console.error(`${this.prefix} [ERROR]: ${message}`);
      break;
    case "debug":
      console.debug(`${this.prefix} [DEBUG]: ${message}`);
      break;
    default:
      console.log(`${this.prefix} [${type.toUpperCase()}]: ${message}`);
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
 * TypingTest test
 * @constructor
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

TypingTest.prototype.getWords = function (count = 10) {
  const apiUrl = `https://random-word-api.herokuapp.com/word?number=${count}`;

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

TypingTest.prototype.createSentence = function () {
  const fragment = document.createDocumentFragment();

  const sentenceElement = document.createElement("div");
  sentenceElement.id = "words";

  this.getWords(10).then(function (data) {
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

/**
 * Creates the test screen.
 * @returns {DocumentFragment} The test screen.
 */
TypingTest.prototype.createTestScreen = function () {
  const screen = this.viewScreen.create("test", "Typing Test");

  const sentence = this.createSentence();
  screen.screenElement.appendChild(sentence);

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
