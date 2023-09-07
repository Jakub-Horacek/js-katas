window.addEventListener(
  "keydown",
  (e) => {
    if (!isNaN(e.key) || isOperator(e.key)) {
      addCharacter(e.key);
    }

    if (e.key == "," || e.key == ".") {
      addCharacter(".");
    }

    if (e.key == "Backspace") {
      removeCharacter();
    }

    if (e.key == "Enter" || e.key == "=") {
      solve();
    }
  },
  true
);

let operatorPlacedPreviously = false;
let lastEquationSolved = false;
let commaAlreadyPlaced = false;
const root = document.querySelector(":root");
const defaultResultSize = getComputedStyle(root).getPropertyValue("--result-number-size");

/**
 *  Add provided char into the string equation
 * @param {string} char to add into the result innerText
 * @returns when trying to place more operators next to eachother
 * @returns when trying to place already existing comma
 */
const addCharacter = (char) => {
  if (lastEquationSolved) {
    allClear();
    lastEquationSolved = false;
  }

  if (isOperator(char) && operatorPlacedPreviously) return;
  if (char == "." && commaAlreadyPlaced) return;

  let resultString = getResultInnerText();
  setResultInnerText(resultString + char);
  commaAlreadyPlaced = isResultContainingComma();
  operatorPlacedPreviously = isOperator(char);
  checkResultLength();
};

/**
 * Delete the last char of the result innerText
 */
const removeCharacter = () => {
  let resultString = getResultInnerText();
  setResultInnerText(resultString.slice(0, -1));
  commaAlreadyPlaced = isResultContainingComma();
  checkResultLength();
};

/**
 * Clear the result innerText
 */
const allClear = () => {
  setResultInnerText("");
  root.style.setProperty("--result-number-size", defaultResultSize);
  commaAlreadyPlaced = false;
};

/**
 * Adjust the result font size by the result innerText length
 */
const checkResultLength = () => {
  let resultLength = getResultInnerText().length;

  if (resultLength >= 5) {
    root.style.setProperty("--result-number-size", "90px");
  }

  if (resultLength >= 7) {
    root.style.setProperty("--result-number-size", "70px");
  }

  if (resultLength >= 10) {
    root.style.setProperty("--result-number-size", "50px");
  }

  if (resultLength >= 13) {
    root.style.setProperty("--result-number-size", "30px");
  }
};

/**
 * Get the result innerText
 * @returns the innerText of the result HTML element
 */
const getResultInnerText = () => {
  return document.getElementById("result").innerText;
};

/**
 * Display the given string in the result
 * @param {string} text which will be displayed in the result
 */
const setResultInnerText = (text) => {
  document.getElementById("result").innerText = text;
};

/**
 *  Check the result if it is already containg a comma
 * @returns true when result is containg comma
 */
const isResultContainingComma = () => {
  return getResultInnerText().includes(".");
};

/**
 * Check if the provided char is an operator
 * @param {string} char
 * @returns true when the char is an operator
 */
const isOperator = (char) => {
  return char == "/" || char == "*" || char == "+" || char == "-";
};

/**
 *  Check if the string is containing any operators
 * @param {string} equation
 * @returns true when not containing at least one of the 4 logical operators
 */
const notContainingAnyOperators = (equation) => {
  return !(equation.includes("/") || equation.includes("*") || equation.includes("+") || equation.includes("-"));
};

/**
 *  Check if the equation is valid
 * @param {string} equation
 * @returns true when the equation is not valid
 */
const notValidEquation = (equation) => {
  return equation == "" || notContainingAnyOperators(equation);
};

/**
 * Transform the resultString into a math equation and solve the equation
 * @returns when the equation is not valid
 */
const solve = () => {
  let resultString = getResultInnerText();

  if (notValidEquation(resultString)) {
    console.log("not valid");
    return;
  }

  let solvedEquation = eval(resultString);
  setResultInnerText(solvedEquation);
  lastEquationSolved = true;
};
