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

  if (isOperator(char) && (operatorPlacedPreviously || isResultEmpty())) return;
  if (char == "." && commaAlreadyPlaced) return;

  let resultString = getResultInnerText();
  setResultInnerText(resultString + char);
  commaAlreadyPlaced = isResultContainingComma();
  operatorPlacedPreviously = isOperator(char);
};

/**
 * Delete the last char of the result innerText
 */
const removeCharacter = () => {
  let resultString = getResultInnerText();
  setResultInnerText(resultString.slice(0, -1));
  commaAlreadyPlaced = isResultContainingComma();
};

/**
 * Toggle the result innerText positive/negative value
 */
const negativeToggle = () => {
  let resultString = getResultInnerText();
  let negativeValue;

  if (isFirstCharacterMinus(resultString)) {
    negativeValue = resultString.slice(1);
  } else {
    negativeValue = "-" + resultString;
  }

  setResultInnerText(negativeValue);
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
  checkResultLength();
};

/**
 *  Check the result if it is already containg a comma
 * @returns true when result is containg comma
 */
const isResultContainingComma = () => {
  return getResultInnerText().includes(".");
};

/**
 * CHeck if result innerText is empty
 * @returns true when result innerText is empty
 */
const isResultEmpty = () => {
  return getResultInnerText() == "";
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
 * Check if the first character of the string is minus
 * @param {*} string
 * @returns true when first character of the string is "-"
 */
const isFirstCharacterMinus = (string) => {
  let firstChar = Array.from(string)[0];
  return firstChar == "-";
};

/**
 * Check whether the string ends with a number
 * @param {string} string
 * @returns true when the string ends with a char that is not a number
 */
const lastCharacterNotNumber = (string) => {
  let lastChar = string.slice(-1);
  return isOperator(lastChar) || isNaN(lastChar);
};

/**
 *  Check if the equation is valid
 * @param {string} equation
 * @returns true when the equation is not valid
 */
const notValidEquation = (equation) => {
  return equation == "" || notContainingAnyOperators(equation) || lastCharacterNotNumber(equation);
};

/**
 * Transform the resultString into a math equation and solve the equation
 * @returns when the equation is not valid
 */
const solve = () => {
  let resultString = getResultInnerText();

  if (notValidEquation(resultString)) {
    // console.warn(`resultString (${resultString}) is not valid math equation`);
    return;
  }

  let solvedEquation = eval(resultString);
  setResultInnerText(solvedEquation);
  lastEquationSolved = true;
};
