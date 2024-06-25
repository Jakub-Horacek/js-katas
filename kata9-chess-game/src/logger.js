let debugMode = true; // Set this to false to disable debug logs

/**
 * Log a message to the console
 * @param {string} message - The message to log
 * @param {string} type - The type of log message (info, warn, error, debug)
 */
export function log(message, type = "info") {
  if (type === "debug" && !debugMode) return;

  const styles = {
    info: "color: lightblue;",
    warn: "color: orange;",
    error: "color: red;",
    debug: "color: grey;",
  };

  console.log(`%c[Chess Game - ${type.toUpperCase()}]: ${message}`, styles[type]);
}

/**
 * Set the debug mode
 * @param {boolean} mode - The debug mode to set
 */
export function setDebugMode(mode) {
  debugMode = mode;
  log(`Debug mode set to ${mode}`, "info");
}

// Expose the setDebugMode function to the global scope
window.setDebugMode = setDebugMode;
