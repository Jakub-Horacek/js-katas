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

/**
 * Saves the painting pixel data to local storage
 * @param {Uint8ClampedArray} pixelData
 */
export const savePaintingData = (pixelData) => {
  localStorage.setItem("paintingData", JSON.stringify(Array.from(pixelData)));
};

/**
 * Loads the painting pixel data from local storage
 * @returns {Uint8ClampedArray|null}
 */
export const loadPaintingData = () => {
  const data = localStorage.getItem("paintingData");
  if (!data) return null;
  return new Uint8ClampedArray(JSON.parse(data));
};

/**
 * Clears the painting pixel data from local storage
 */
export const clearPaintingData = () => {
  localStorage.removeItem("paintingData");
};

/**
 * Saves the undo/redo stack to local storage (NO-OP, in-memory only)
 */
export const saveHistoryStacks = () => {};

/**
 * Loads the undo/redo stack from local storage (NO-OP, returns empty)
 * @returns {{undoStack: Array, redoStack: Array}}
 */
export const loadHistoryStacks = () => ({ undoStack: [], redoStack: [] });

/**
 * Clears the undo/redo stacks from local storage (NO-OP)
 */
export const clearHistoryStacks = () => {};
