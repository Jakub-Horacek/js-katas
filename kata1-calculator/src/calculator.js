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

    if (e.key == "Enter") {
      solve();
    }
  },
  true
);

let commaAlreadyPlaced = false;
const root = document.querySelector(":root");
const defaultResultSize = getComputedStyle(root).getPropertyValue("--result-number-size");

const addCharacter = (char) => {
  if (char == "." && commaAlreadyPlaced) return;
  document.getElementById("result").innerText += char;
  commaAlreadyPlaced = isResultContainingComma();
  checkResultLength();
};

const isResultContainingComma = () => {
  return document.getElementById("result").innerText.includes(".");
};

const removeCharacter = () => {
  let resultString = document.getElementById("result").innerText;
  document.getElementById("result").innerText = resultString.slice(0, -1);
  commaAlreadyPlaced = isResultContainingComma();
  checkResultLength();
};

const allClear = () => {
  document.getElementById("result").innerText = "";
  root.style.setProperty("--result-number-size", defaultResultSize);
  commaAlreadyPlaced = false;
};

const checkResultLength = () => {
  let resultLength = document.getElementById("result").innerText.length;
  console.log(resultLength);

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

const addbits = (string) => {
  return (string.replace(/\s/g, "").match(/[+-]?([0-9.]+)/g) || []).reduce((sum, value) => {
    return parseFloat(sum) + parseFloat(value);
  });
};

const solve = () => {
  let resultString = document.getElementById("result").innerText;
  let solvedEquation = addbits(resultString);
  document.getElementById("result").innerText = solvedEquation;
};
