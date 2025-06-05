import { saveCanvasDimensions, saveScreenState, getScreenState } from "./utils.js";
import { showPaintScreen } from "./paint.js";

let appElement;

/**
 * App initialization
 */
document.addEventListener("DOMContentLoaded", () => {
  appElement = document.getElementById("app");
  const screenState = getScreenState();
  if (screenState === "paint") {
    showPaintScreen(appElement);
  } else {
    showWelcomeScreen();
  }
});

/**
 * Hides the welcome screen
 */
const hideWelcomeScreen = () => {
  const welcomeScreen = document.getElementById("welcome-screen");
  if (welcomeScreen) welcomeScreen.remove();
};

/**
 * Shows the welcome screen (exported for use in paint.js)
 */
export const showWelcomeScreen = () => {
  appElement.innerHTML = "";
  saveScreenState("welcome");
  const welcomeScreen = createWelcomeScreen();
  appElement.appendChild(welcomeScreen);
};

/**
 * Runs the paint app
 */
const runPaintApp = () => {
  hideWelcomeScreen();
  saveScreenState("paint");
  showPaintScreen(appElement);
};

/**
 * Creates the welcome screen
 * @returns {DocumentFragment}
 */
const createWelcomeScreen = () => {
  const welcomeScreen = document.createDocumentFragment();

  const screenWrapper = document.createElement("div");
  screenWrapper.id = "welcome-screen";
  screenWrapper.classList.add("screen-wrapper");
  welcomeScreen.appendChild(screenWrapper);

  const title = document.createElement("h1");
  title.textContent = "Welcome to Pixelart Paint";
  screenWrapper.appendChild(title);

  const description = document.createElement("p");
  description.textContent = "Select the size of the canvas and start painting!";
  screenWrapper.appendChild(description);

  // Preset select field
  const presetSelectLabel = document.createElement("label");
  presetSelectLabel.textContent = "Presets: ";
  presetSelectLabel.setAttribute("for", "preset-select");
  presetSelectLabel.className = "preset-select-label";
  screenWrapper.appendChild(presetSelectLabel);

  // Use new function to create select field, passing the inputs (inputs not yet created, so create dummy for now)
  // We'll create the actual inputs below and update this call
  let widthInput, heightInput;
  // Custom section title
  const customTitle = document.createElement("div");
  customTitle.textContent = "Custom";
  customTitle.className = "custom-title";

  // Two input fields for width and height (up to 8k resolution - 8192x8192)
  widthInput = document.createElement("input");
  widthInput.type = "number";
  widthInput.min = 1;
  widthInput.max = 8192;
  widthInput.value = 400;
  widthInput.className = "dimension-input";

  heightInput = document.createElement("input");
  heightInput.type = "number";
  heightInput.min = 1;
  heightInput.max = 8192;
  heightInput.value = 400;
  heightInput.className = "dimension-input";

  // Now create the select field with the real inputs
  const presetSelect = createSelectField(widthInput, heightInput);
  presetSelect.value = "400x400";
  screenWrapper.appendChild(presetSelect);
  screenWrapper.appendChild(customTitle);
  screenWrapper.appendChild(widthInput);
  screenWrapper.appendChild(heightInput);

  const startButton = document.createElement("button");
  startButton.textContent = "Start";
  startButton.className = "start-btn";
  startButton.addEventListener("click", () => {
    const width = widthInput.value;
    const height = heightInput.value;
    saveCanvasDimensions(width, height);
    runPaintApp();
  });
  screenWrapper.appendChild(startButton);

  return welcomeScreen;
};

/**
 * Creates the preset select field
 * @param {HTMLInputElement} widthInput
 * @param {HTMLInputElement} heightInput
 * @returns {HTMLSelectElement}
 */
function createSelectField(widthInput, heightInput) {
  const presetSelect = document.createElement("select");
  presetSelect.id = "preset-select";
  presetSelect.className = "preset-select";

  // Big and Small Preset definitions
  const bigPresets = [
    { label: "Landscape (1920x1080)", width: 1920, height: 1080 },
    { label: "Portrait (1080x1920)", width: 1080, height: 1920 },
    { label: "Instagram (1080x1080)", width: 1080, height: 1080 },
  ];
  const smallPresets = [
    { label: "Small Landscape (800x600)", width: 800, height: 600 },
    { label: "Small Portrait (600x800)", width: 600, height: 800 },
    { label: "Small Square (400x400)", width: 400, height: 400 },
    { label: "VGA (640x480)", width: 640, height: 480 },
  ];

  // Add optgroups and options
  const bigOptGroup = document.createElement("optgroup");
  bigOptGroup.label = "Big";
  bigPresets.forEach((preset) => {
    const option = document.createElement("option");
    option.value = `${preset.width}x${preset.height}`;
    option.textContent = preset.label;
    option.dataset.width = preset.width;
    option.dataset.height = preset.height;
    bigOptGroup.appendChild(option);
  });
  presetSelect.appendChild(bigOptGroup);

  const smallOptGroup = document.createElement("optgroup");
  smallOptGroup.label = "Small";
  smallPresets.forEach((preset) => {
    const option = document.createElement("option");
    option.value = `${preset.width}x${preset.height}`;
    option.textContent = preset.label;
    option.dataset.width = preset.width;
    option.dataset.height = preset.height;
    smallOptGroup.appendChild(option);
  });
  presetSelect.appendChild(smallOptGroup);

  // Add event listener to update inputs
  presetSelect.addEventListener("change", (e) => {
    const selectedOption = presetSelect.options[presetSelect.selectedIndex];
    if (selectedOption && selectedOption.dataset.width && selectedOption.dataset.height) {
      widthInput.value = selectedOption.dataset.width;
      heightInput.value = selectedOption.dataset.height;
    }
  });

  return presetSelect;
}
