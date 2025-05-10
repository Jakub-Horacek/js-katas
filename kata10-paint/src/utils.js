/**
 * Saves the canvas dimensions to local storage
 * @param {number} width
 * @param {number} height
 */
export const saveCanvasDimensions = (width, height) => {
  localStorage.setItem("canvasDimensions", JSON.stringify({ width, height }));
};

/**
 * Gets the canvas dimensions from local storage
 * @returns {Object}
 */
export const getCanvasDimensions = () => {
  return JSON.parse(localStorage.getItem("canvasDimensions"));
};

/**
 * Saves the current screen state to local storage
 * @param {string} screen - 'welcome' or 'paint'
 */
export const saveScreenState = (screen) => {
  localStorage.setItem("screenState", screen);
};

/**
 * Gets the current screen state from local storage
 * @returns {string|null}
 */
export const getScreenState = () => {
  return localStorage.getItem("screenState");
};
