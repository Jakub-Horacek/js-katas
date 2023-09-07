window.addEventListener(
  "keydown",
  (e) => {
    if (!isNaN(e.key)) {
      addCharacter(e.key);
    }

    if (e.key == "," || e.key == ".") {
      addCharacter(".");
    }

    if (e.key == "Backspace") {
      removeCharacter();
    }

    if (e.key == "/" || e.key == "*" || e.key == "+" || e.key == "-") {
      addCharacter(e.key);
    }

    if (e.key == "Enter" || e.key == "=") {
      solve();
    }
  },
  true
);

let lastEquationSolved = false;
let commaAlreadyPlaced = false;
const root = document.querySelector(":root");
const defaultResultSize = getComputedStyle(root).getPropertyValue("--result-number-size");

const addCharacter = (char) => {
  if (lastEquationSolved) {
    allClear();
    lastEquationSolved = false;
  }

  if (char == "." && commaAlreadyPlaced) return;

  let resultString = getResultInnerText();
  setResultInnerText(resultString + char);
  commaAlreadyPlaced = isResultContainingComma();
  checkResultLength();
};

const isResultContainingComma = () => {
  return getResultInnerText().includes(".");
};

const removeCharacter = () => {
  let resultString = getResultInnerText();
  setResultInnerText(resultString.slice(0, -1));
  commaAlreadyPlaced = isResultContainingComma();
  checkResultLength();
};

const allClear = () => {
  setResultInnerText("");
  root.style.setProperty("--result-number-size", defaultResultSize);
  commaAlreadyPlaced = false;
};

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

const getResultInnerText = () => {
  return document.getElementById("result").innerText;
};

const setResultInnerText = (text) => {
  document.getElementById("result").innerText = text;
};

const solve = () => {
  let resultString = getResultInnerText();
  let solvedEquation = eval(resultString);
  setResultInnerText(solvedEquation);
  lastEquationSolved = true;
};
