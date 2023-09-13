window.addEventListener(
  "keydown",
  (e) => {
    if (showEquationLog) return;

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

let showEquationLog = false;
let operatorPlacedPreviously = false;
let previousEquationSolved = false;
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
  if (previousEquationSolved) {
    previousEquationSolved = false;
    if (!isOperator(char)) {
      allClear();
    }
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
 * Toggle the showEquationLog true/false
 */
const equationLogToggle = () => {
  const calculatorElement = document.getElementById("calculator");
  const equationLogElement = document.getElementById("calculator-equation-log");
  const buttonsElement = document.getElementById("calculator-buttons");
  const resultElement = document.getElementById("result");

  showEquationLog = !showEquationLog;

  if (showEquationLog) {
    equationLogElement.classList.remove("hidden");
    buttonsElement.classList.add("hidden");
    resultElement.classList.add("hidden");
    calculatorElement.style.justifyContent = "start";

    waitAndDisableElement([buttonsElement, resultElement], 500, true);
    waitAndDisableElement([equationLogElement], 0, false);

    parseEquationLogToHTML();
  } else {
    equationLogElement.classList.add("hidden");
    buttonsElement.classList.remove("hidden");
    resultElement.classList.remove("hidden");
    calculatorElement.style.justifyContent = "end";

    waitAndDisableElement([buttonsElement, resultElement], 0, false);
    waitAndDisableElement([equationLogElement], 500, true);

    // HACK: This line below somehow fixes the weird bug in the parseEquationLogToHTML() method
    document.getElementById("equation-list").innerHTML = "";
  }
};

/**
 * Apply or remove "visibility: hidden" css atribute for the provided elements to stop user from interacting with the disabled elements
 * @param {Array} elements to be disabled/enabled
 * @param {Number} delay (in ms) set to the same delay as the element's transition in the CSS (elements should be disabled after the CSS animation is complete)
 * @param {Boolean} disabled / enabled
 */
const waitAndDisableElement = (elements, delay, disabled) => {
  setTimeout(() => {
    elements.forEach((element) => {
      element.style.visibility = disabled ? "hidden" : "visible";
    });
  }, delay);
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
  // TODO: Currently it is checking the whole result. It should check each number separately.
  // Split the whole result by operators as the separators and check each number separately.
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
 * @param {string} string
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
 * Save the solved equation into the localStorage
 * @param {string} equation - resultString
 * @param {number} result - solvedEquation
 */
const saveToEquationLog = (equation, result) => {
  let equationLog = JSON.parse(localStorage.getItem("equationLog"));
  if (equationLog == null) equationLog = [];

  let valueToSave = {
    date: new Date(),
    equation: equation,
    result: result,
  };

  equationLog.push(valueToSave);
  localStorage.setItem("equationLog", JSON.stringify(equationLog));
};

/**
 * Displays the equationLog from the localStorage in the styled HTML code
 * @returns when the equationLog is null
 */
const parseEquationLogToHTML = () => {
  let equationLog = JSON.parse(localStorage.getItem("equationLog"));
  if (equationLog == null) return;

  equationLog.forEach((element) => {
    const equationListItem = `<li class="history__item" 
    title="Solved: ${new Date(element.date).getDay()}.${new Date(element.date).getMonth()}. ${new Date(element.date).getFullYear()} - ${new Date(
      element.date
    ).getHours()}:${new Date(element.date).getMinutes()}"
    >
    <div class="history__value">${element.equation} = <div class="history__result">${element.result}</div></div>
    </li>`;

    // NOTE: this code below is somehow causing troubles with the calculator functionality
    // quick fix is in the equationLogToggle() method (with the HACK comment)
    document.getElementById("equation-list").innerHTML += equationListItem;
  });
};

/**
 * Clear the whole equation log from the localStorage when confirmed
 */
const clearTheEquationLog = () => {
  if (confirm("Do you really want to delete the whole equation log?")) {
    localStorage.setItem("equationLog", JSON.stringify(null));
    document.getElementById("equation-list").innerHTML = "";
  }
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
  saveToEquationLog(resultString, solvedEquation);

  previousEquationSolved = true;
};
