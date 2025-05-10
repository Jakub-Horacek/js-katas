import { getCanvasDimensions, saveScreenState } from "./utils.js";
import { showWelcomeScreen } from "./app.js";

/**
 * Shows the paint screen
 * @param {Element} appElement
 */
export const showPaintScreen = (appElement) => {
  const paintScreen = createPaintScreen();
  appElement.innerHTML = "";
  appElement.appendChild(paintScreen);
};

/**
 * Creates the paint screen
 * @returns {DocumentFragment}
 */
const createPaintScreen = () => {
  const paintScreen = document.createDocumentFragment();

  const paintWrapper = document.createElement("div");
  paintWrapper.classList.add("paint-wrapper");
  paintScreen.appendChild(paintWrapper);

  const paintHeader = document.createElement("div");
  paintHeader.classList.add("paint-header");
  paintWrapper.appendChild(paintHeader);

  const paintHeaderTitle = document.createElement("h1");
  paintHeaderTitle.textContent = "Paint";
  paintHeader.appendChild(paintHeaderTitle);

  // Display current canvas dimensions
  const dims = getCanvasDimensions();
  if (dims && dims.width && dims.height) {
    const dimDisplay = document.createElement("span");
    dimDisplay.textContent = `(${dims.width} x ${dims.height})`;
    dimDisplay.className = "paint-dimensions";
    paintHeaderTitle.appendChild(dimDisplay);
  }

  // New Painting button
  const newPaintingBtn = document.createElement("button");
  newPaintingBtn.textContent = "New Painting";
  newPaintingBtn.className = "new-painting-btn";
  newPaintingBtn.addEventListener("click", () => {
    saveScreenState("welcome");
    showWelcomeScreen();
  });
  paintHeader.appendChild(newPaintingBtn);

  const toolbar = createToolbar();
  paintHeader.appendChild(toolbar);

  const canvas = createCanvas();
  paintWrapper.appendChild(canvas);

  return paintScreen;
};

/**
 * Creates the toolbar
 * @returns {DocumentFragment}
 */
const createToolbar = () => {
  const toolbar = document.createElement("div");
  toolbar.classList.add("paint-toolbar");
  return toolbar;
};

/**
 * Creates the canvas
 * @returns {DocumentFragment}
 */
const createCanvas = () => {
  const canvas = document.createElement("canvas");
  canvas.classList.add("paint-canvas");
  canvas.width = getCanvasDimensions().width;
  canvas.height = getCanvasDimensions().height;
  return canvas;
};
