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

function GameViewDisplay() {}
function GameOverDisplay() {}

/**
 * TypingTest game
 * @constructor
 */
function TypingTest(
  options = {
    debug: false,
    logger: new Logger(),
    viewDisplay: GameViewDisplay,
    overRenderer: GameOverDisplay,
  },
) {
  this.debug = options.debug;
  this.logger = options.logger;
  this.viewDisplay = options.GameViewDisplay;
  this.overRenderer = options.GameOverDisplay;
}
