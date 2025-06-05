import { getCanvasDimensions, saveScreenState } from "./utils.js";
import { showWelcomeScreen } from "./app.js";
import { savePaintingData, loadPaintingData, clearPaintingData, clearHistoryStacks, hexToRgb } from "./utils.js";

/**
 * Painting state and config
 */
const MAX_HISTORY = 50;
let currentColor = "#000000";
let tool = "brush"; // 'brush' or 'delete'

/**
 * PaintSession class encapsulates canvas, context, undo/redo, and painting logic
 */
class PaintSession {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {CanvasRenderingContext2D} ctx
   */
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.undoStack = [];
    this.redoStack = [];
    this.isPainting = false;
    this.dragPoints = [];
    this.init();
  }

  /**
   * Initialize painting state and restore if available
   */
  init() {
    // Restore painting state if available
    const savedData = loadPaintingData();
    if (savedData) {
      const imgData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
      imgData.data.set(savedData);
      this.ctx.putImageData(imgData, 0, 0);
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.saveState();
    this.attachEvents();
  }

  /**
   * Save a snapshot of the current canvas to the undo stack
   */
  saveState() {
    if (this.undoStack.length >= MAX_HISTORY) this.undoStack.shift();
    this.undoStack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
    this.redoStack = [];
  }

  /**
   * Draw a single pixel at (x, y)
   */
  drawPixel(x, y) {
    if (x < 0 || y < 0 || x >= this.canvas.width || y >= this.canvas.height) return;
    const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const idx = (y * this.canvas.width + x) * 4;
    if (tool === "brush") {
      const rgb = hexToRgb(currentColor);
      imgData.data[idx] = rgb.r;
      imgData.data[idx + 1] = rgb.g;
      imgData.data[idx + 2] = rgb.b;
      imgData.data[idx + 3] = 255;
    } else if (tool === "delete") {
      imgData.data[idx + 3] = 0;
    }
    this.ctx.putImageData(imgData, 0, 0);
  }

  /**
   * Draw a line from (x0, y0) to (x1, y1)
   */
  drawLine(x0, y0, x1, y1) {
    let dx = Math.abs(x1 - x0),
      dy = Math.abs(y1 - y0);
    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    while (true) {
      this.drawPixel(x0, y0);
      if (x0 === x1 && y0 === y1) break;
      let e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  /**
   * Undo last action
   */
  undo() {
    if (this.undoStack.length <= 1) return;
    this.redoStack.push(this.undoStack.pop());
    const last = this.undoStack[this.undoStack.length - 1];
    this.ctx.putImageData(last, 0, 0);
    savePaintingData(last.data);
  }

  /**
   * Redo last undone action
   */
  redo() {
    if (this.redoStack.length === 0) return;
    const next = this.redoStack.pop();
    this.undoStack.push(next);
    this.ctx.putImageData(next, 0, 0);
    savePaintingData(next.data);
  }

  /**
   * Attach mouse/touch/keyboard events
   */
  attachEvents() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: Math.floor((e.touches ? e.touches[0].clientX : e.clientX) - rect.left),
        y: Math.floor((e.touches ? e.touches[0].clientY : e.clientY) - rect.top),
      };
    };
    // Mouse
    this.canvas.addEventListener("mousedown", (e) => {
      this.isPainting = true;
      this.dragPoints = [getPos(e)];
      this.drawPixel(this.dragPoints[0].x, this.dragPoints[0].y);
    });
    this.canvas.addEventListener("mousemove", (e) => {
      if (this.isPainting) {
        const pos = getPos(e);
        const last = this.dragPoints[this.dragPoints.length - 1];
        this.drawLine(last.x, last.y, pos.x, pos.y);
        this.dragPoints.push(pos);
      }
    });
    window.addEventListener("mouseup", () => {
      if (this.isPainting) {
        this.isPainting = false;
        this.saveState();
        savePaintingData(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data);
        this.dragPoints = [];
      }
    });
    // Touch
    this.canvas.addEventListener("touchstart", (e) => {
      this.isPainting = true;
      this.dragPoints = [getPos(e)];
      this.drawPixel(this.dragPoints[0].x, this.dragPoints[0].y);
    });
    this.canvas.addEventListener("touchmove", (e) => {
      if (this.isPainting) {
        const pos = getPos(e);
        const last = this.dragPoints[this.dragPoints.length - 1];
        this.drawLine(last.x, last.y, pos.x, pos.y);
        this.dragPoints.push(pos);
      }
    });
    window.addEventListener("touchend", () => {
      if (this.isPainting) {
        this.isPainting = false;
        this.saveState();
        savePaintingData(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data);
        this.dragPoints = [];
      }
    });
    // Keyboard
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        this.undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        this.redo();
      }
    });
  }
}

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
    clearPaintingData();
    clearHistoryStacks();
    showWelcomeScreen();
  });
  paintHeader.appendChild(newPaintingBtn);

  // Create canvas and session
  const { canvas, session } = createCanvas();
  // Create toolbar, always using the current session's undo/redo
  const toolbar = createToolbar(
    () => session.undo(),
    () => session.redo()
  );
  paintHeader.appendChild(toolbar);
  paintWrapper.appendChild(canvas);

  return paintScreen;
};

/**
 * Creates the toolbar with color picker, brush, delete, undo, redo
 * @returns {DocumentFragment}
 */
const createToolbar = (undo, redo) => {
  const toolbar = document.createElement("div");
  toolbar.classList.add("paint-toolbar");

  // Color picker
  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.value = currentColor;
  colorInput.title = "Brush Color";
  colorInput.className = "toolbar-color-picker";
  colorInput.addEventListener("input", (e) => {
    currentColor = e.target.value;
    tool = "brush";
    setActiveToolBtn();
  });
  toolbar.appendChild(colorInput);

  // Brush tool button
  const brushBtn = document.createElement("button");
  brushBtn.textContent = "Brush";
  brushBtn.title = "Brush Tool (1px)";
  brushBtn.className = "toolbar-btn brush-btn";
  brushBtn.addEventListener("click", () => {
    tool = "brush";
    setActiveToolBtn();
  });
  toolbar.appendChild(brushBtn);

  // Delete tool button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.title = "Delete Tool (make transparent)";
  deleteBtn.className = "toolbar-btn delete-btn";
  deleteBtn.addEventListener("click", () => {
    tool = "delete";
    setActiveToolBtn();
  });
  toolbar.appendChild(deleteBtn);

  // Undo button
  const undoBtn = document.createElement("button");
  undoBtn.textContent = "Undo";
  undoBtn.title = "Undo (Ctrl+Z)";
  undoBtn.className = "toolbar-btn undo-btn";
  undoBtn.addEventListener("click", () => {
    undo();
    setActiveToolBtn();
  });
  toolbar.appendChild(undoBtn);

  // Redo button
  const redoBtn = document.createElement("button");
  redoBtn.textContent = "Redo";
  redoBtn.title = "Redo (Ctrl+Y)";
  redoBtn.className = "toolbar-btn redo-btn";
  redoBtn.addEventListener("click", () => {
    redo();
    setActiveToolBtn();
  });
  toolbar.appendChild(redoBtn);

  // Helper to update active tool button
  function setActiveToolBtn() {
    [brushBtn, deleteBtn].forEach((btn) => btn.classList.remove("active", "toolbar-btn--active"));
    if (tool === "brush") brushBtn.classList.add("active", "toolbar-btn--active");
    if (tool === "delete") deleteBtn.classList.add("active", "toolbar-btn--active");
  }
  setActiveToolBtn();

  return toolbar;
};

/**
 * Creates the canvas and sets up painting logic
 * @returns {DocumentFragment}
 */
const createCanvas = () => {
  const dims = getCanvasDimensions();
  const canvas = document.createElement("canvas");
  canvas.classList.add("paint-canvas");
  canvas.width = dims.width;
  canvas.height = dims.height;
  const ctx = canvas.getContext("2d");
  const session = new PaintSession(canvas, ctx);
  return { canvas, session };
};
