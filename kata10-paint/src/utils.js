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

/**
 * Converts hex color to rgb
 * @param {string} hex
 * @returns {{r:number,g:number,b:number}}
 */
export function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((x) => x + x)
      .join("");
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Exports a canvas as an image to the user's downloads
 * @param {HTMLCanvasElement} canvas
 * @param {'png'|'jpg'|'jpeg'} [format] - Image format
 */
export function exportCanvasAsImage(canvas, format = "png") {
  let link = document.createElement("a");
  let mime = "image/png";
  let filename = "pixel-painting.png";
  let dataUrl;
  if (format === "jpg" || format === "jpeg") {
    mime = "image/jpeg";
    filename = "pixel-painting.jpg";
    // Create a temporary canvas with white background
    const tmp = document.createElement("canvas");
    tmp.width = canvas.width;
    tmp.height = canvas.height;
    const ctx = tmp.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, tmp.width, tmp.height);
    ctx.drawImage(canvas, 0, 0);
    dataUrl = tmp.toDataURL(mime);
  } else {
    dataUrl = canvas.toDataURL("image/png");
  }
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
