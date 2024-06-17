/**
 * Logs message to console
 * @param {string} message - Message to log
 * @param {string} type - Log type (info, warn, error, debug, log)
 */
export function log(message, type = "log") {
  let prefix = "Chess Game";

  switch (type) {
    case "info":
      console.info(`%c${prefix} [INFO]: ${message}`, "color: lightblue;");
      break;
    case "warn":
      console.warn(`%c${prefix} [WARN]: ${message}`, "color: orange;");
      break;
    case "error":
      console.error(`%c${prefix} [ERROR]: ${message}`, "color: red;");
      break;
    case "debug":
      console.debug(`%c${prefix} [DEBUG]: ${message}`, "color: grey;");
      break;
    default:
      console.log(`%c${prefix} [${type.toUpperCase()}]: ${message}`, "color: white;");
  }
}
