import identifiers from "./utilities.js";
const maximumPlaycardsCount = identifiers.length / 2;
let flippedCards = [];
const cardDelayMS = 1000;
let cannotClick = false;
let attempts = 0;

// NOTE: Number of cards the player plays with (this number needs to be even)
let playcardsCount = 12;

const gamegrid = document.querySelector("#playgrid");
const counter = document.querySelector("#counter");

// Round the playcardsCount to the nearest even number if the number is odd
if ((playcardsCount | 1) === playcardsCount) {
  playcardsCount = 2 * Math.round(playcardsCount / 2);
}

// Make sure the playcardsCount is lower than maximumPlaycardsCount
if (playcardsCount >= maximumPlaycardsCount) {
  playcardsCount = maximumPlaycardsCount;
}

const getUniqueId = () => {
  return Date.now().toString(32) + Math.random().toString(16).replace(".", "");
};

const flipCard = (cardId) => {
  if (cannotClick) {
    return;
  }

  const card = document.getElementById(cardId);
  const sideA = card.querySelector(".playcard__side-a");
  const sideB = card.querySelector(".playcard__side-b");
  const cardIdentifier = sideB.style.background;

  flippedCards.push({ cardId, cardIdentifier });

  let notFlipped = sideA.classList.contains("playcard__side--visible");

  if (notFlipped) {
    sideA.classList.toggle("playcard__side--visible");
    sideB.classList.toggle("playcard__side--visible");

    if (flippedCards.length >= 2) {
      if (flippedCards[0].cardIdentifier === flippedCards[1].cardIdentifier) {
        console.log("SUCCESS");
        flippedCards.forEach((card) => {
          removeCard(card.cardId);
        });
      } else {
        console.log("FAIL");
        flippedCards.forEach((card) => {
          hideCard(card.cardId);
        });
      }

      attempts++;

      if (attempts === 1) {
        counter.style.opacity = 1;
      }

      counter.innerText = "Attempts: " + attempts;
      flippedCards = [];
    }
  }
};

const hideCard = (cardId) => {
  cannotClick = true;
  const card = document.getElementById(cardId);
  const sideA = card.querySelector(".playcard__side-a");
  const sideB = card.querySelector(".playcard__side-b");

  setTimeout(() => {
    sideA.classList.add("playcard__side--visible");
    sideB.classList.remove("playcard__side--visible");
    cannotClick = false;
  }, cardDelayMS);
};

const removeCard = (cardId) => {
  cannotClick = true;
  const card = document.getElementById(cardId);

  setTimeout(() => {
    gamegrid.removeChild(card);
    cannotClick = false;
  }, cardDelayMS);
};

const renderPlaycard = (identifier) => {
  const card = document.createElement("div");
  card.id = getUniqueId();
  card.className = "playcard";
  card.addEventListener("click", () => flipCard(card.id));

  const sideA = document.createElement("div");
  sideA.className = "playcard__side playcard__side-a playcard__side--visible";
  card.appendChild(sideA);

  const sideB = document.createElement("div");
  sideB.className = "playcard__side playcard__side-b";
  sideB.style.background = identifier;
  card.appendChild(sideB);

  return card;
};

const renderPlayercards = (count) => {
  for (let card = 0; card < count; card += 2) {
    // Render two cards with same identifier
    gamegrid.appendChild(renderPlaycard(identifiers[card]));
    gamegrid.appendChild(renderPlaycard(identifiers[card]));
  }
  shuffleCards();
};

const shuffleCards = () => {
  const cards = Array.from(gamegrid.children);

  while (cards.length) {
    const card = cards.splice(Math.floor(Math.random() * cards.length), 1)[0];
    gamegrid.append(card);
  }
};

renderPlayercards(playcardsCount);
