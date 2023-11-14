// NOTE: Number of cards the player plays with (this number needs to be even)
let playcardsCount = 12;

const gamegrid = document.querySelector("#playgrid");

// Round the playcardsCount to the nearest even number if the number is odd
if ((playcardsCount | 1) === playcardsCount) {
  playcardsCount = 2 * Math.round(playcardsCount / 2);
}

const renderPlaycard = () => {
  const card = document.createElement("div");
  card.className = "playcard";
  card.addEventListener("click", () => flipCard());

  const sideA = document.createElement("div");
  sideA.className = "playcard__side playcard__side-a playcard__side--visible";
  card.appendChild(sideA);

  const sideB = document.createElement("div");
  sideB.className = "playcard__side playcard__side-b";
  card.appendChild(sideB);

  return card;
};

gamegrid.appendChild(renderPlaycard());
