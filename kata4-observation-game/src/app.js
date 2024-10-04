/**
 * Player numbers
 */
let Player = {
  cookies: {
    spawned: 0,
    collected: 0,
    missed: 0,
  },
  bombs: {
    clicked: 0,
    spawned: 0,
  },
  health: {
    current: 50,
    dmg: {
      explosion: 50,
      miss: 25,
    },
    gain: 5,
  },
};

/**
 * Cookie type
 * @enum {number}
 */
const CookieType = {
  COOKIE: 1,
  BOMB: 2,
};

/**
 * Cookie class
 * @constructor
 * @param {object} icons
 * @param {CookieType} type
 */
function Cookie(icons, type) {
  this.icons = icons;
  this.type = type;
  this.handleCookieClick = null;
  this.getRandomPosition = function (min, max) {
    return Math.random() * (max - min) + min;
  };
}

/**
 * On cookie click
 * @param {function} callback
 */
Cookie.prototype.onClicked = function (callback) {
  this.handleCookieClick = callback;
  this.element.addEventListener("click", this.handleCookieClick);
};

/**
 * Get cookie element
 * @returns {HTMLElement}
 */
Cookie.prototype.getElement = function () {
  return this.element;
};

/**
 * Spawn cookie
 */
Cookie.prototype.spawn = function () {
  this.clicked = false;
  this.element = document.createElement("div");
  this.element.className = "cookie";
  const { cookie, bomb } = this.icons;

  switch (this.type) {
    case CookieType.COOKIE:
      this.element.classList.add("cookie--cookie");
      this.element.innerHTML = cookie;
      break;
    case CookieType.BOMB:
      this.element.classList.add("cookie--bomb");
      this.element.innerHTML = bomb;
      break;
  }

  this.element.style.left = `${this.getRandomPosition(0, window.innerWidth - 35)}px`;
  this.element.style.top = `${this.getRandomPosition(0, window.innerHeight - 35)}px`;
};

/**
 * Observation game class
 * @constructor
 */
function ObservationGame() {
  this.gameElement = document.getElementById("game");
  this.icons = {
    cookie: String.fromCodePoint(0x1f36a),
    bomb: String.fromCodePoint(0x1f4a3),
  };
  this.bombChance = 10; // percentage (maximum is 100)
}

/**
 * Update cookie count
 * @param {number} count
 * @param {boolean} isNew - only for cookie counter creation at the start of the game
 */
ObservationGame.prototype.updateCookieCount = function (count, isNew = false) {
  const cookieCounter = document.getElementById("cookie-counter");
  const cookieCount = isNew ? document.createElement("div") : document.getElementById("cookie-count");

  cookieCount.innerText = `Cookies: ${count}`;

  if (isNew) {
    cookieCount.id = "cookie-count";
    cookieCounter.appendChild(cookieCount);
  }
};

/**
 * Start the game
 */
ObservationGame.prototype.start = function () {
  this.updateHealthpoints(Player.health.current, true);
  this.updateCookieCount(Player.cookies.collected, true);
  this.spawning();
};

/**
 * Handle cookie click
 * @param {Cookie} cookie
 */
ObservationGame.prototype.handleCookieClick = function (cookie) {
  if (cookie.type === CookieType.COOKIE) {
    this.updateCookieCount(Player.cookies.collected++);
    this.updateHealthpoints(Player.health.current + Player.health.gain);
  } else {
    Player.bombs.clicked++;
    this.updateHealthpoints(Player.health.current - Player.health.dmg.explosion);
  }

  this.gameElement.removeChild(cookie.getElement());
};

/**
 * Update the healthbar
 * @param {number} hp
 * @param {boolean} isNew - only for healthbar creation at the start of the game
 */
ObservationGame.prototype.updateHealthpoints = function (hp, isNew = false) {
  const healthbar = document.getElementById("healthbar");

  if (hp <= 0) {
    hp = 0;
    this.over();
  } else if (hp >= 100) {
    hp = 100;
  }

  const hpTitle = isNew ? document.createElement("div") : document.getElementById("hp-title");
  hpTitle.className = "hp--title";
  hpTitle.innerText = `Healthpoints: ${hp}/100`;

  const hpBar = isNew ? document.createElement("div") : document.getElementById("hp-bar");
  hpBar.className = "hp--fill";
  hpBar.style.width = `${hp}%`;

  switch (true) {
    case hp <= 15:
      hpBar.style.background = "red";
      break;
    case hp <= 30:
      hpBar.style.background = "orange";
      break;
    default:
      hpBar.style.background = "green";
      break;
  }

  if (isNew) {
    hpTitle.id = "hp-title";
    healthbar.appendChild(hpTitle);

    hpBar.id = "hp-bar";
    healthbar.appendChild(hpBar);
    this.gameElement.appendChild(healthbar);
  }

  Player.health.current = hp;
};

/**
 * Spawn Cookie element
 * @param {CookieType} elementType - bomb / cookie
 * @param {number} lifespan - how long does the element live
 */
ObservationGame.prototype.spawnElement = function (elementType, lifespan) {
  const cookie = new Cookie(this.icons, elementType);
  const isNotBomb = elementType !== CookieType.BOMB;

  cookie.spawn();
  const cookieElement = cookie.getElement();
  this.gameElement.appendChild(cookieElement);

  if (isNotBomb) {
    Player.cookies.spawned++;
  } else {
    Player.bombs.spawned++;
  }

  cookie.onClicked(this.handleCookieClick.bind(this, cookie));

  setTimeout(() => {
    if (this.gameElement.contains(cookieElement)) {
      this.gameElement.removeChild(cookieElement);

      if (isNotBomb) {
        Player.cookies.missed++;
        this.updateHealthpoints(Player.health.current - Player.health.dmg.miss);
      }
    }
  }, lifespan);
};

/**
 * Start spawning game elements
 */
ObservationGame.prototype.spawning = function () {
  this.spawnElement(CookieType.COOKIE, 5000);

  this.gameInterval = setInterval(() => {
    const number = Math.random() * (100 - 0);

    if (number <= this.bombChance) {
      this.spawnElement(CookieType.BOMB, 8000);
    } else {
      this.spawnElement(CookieType.COOKIE, 6000);
    }
  }, 500);
};

/**
 * Remove all cookies and bombs
 */
ObservationGame.prototype.removeAllCookiesAndBombs = function () {
  const cookies = document.querySelectorAll(".cookie");

  cookies.forEach((cookie) => {
    this.gameElement.removeChild(cookie);
  });
};

/**
 * Update and return the highscore
 * @param {number} score
 * @returns {number} highscore
 */
ObservationGame.prototype.setAndReturnHighscore = function (score) {
  let highscore = JSON.parse(localStorage.getItem("highscore")) ?? 0;

  if (score > highscore) {
    highscore = score;
  }

  localStorage.setItem("highscore", JSON.stringify(highscore));
  return highscore;
};

/**
 * Game over
 */
ObservationGame.prototype.over = function () {
  const score = Player.cookies.collected;
  const highscore = this.setAndReturnHighscore(score);

  clearInterval(this.gameInterval);
  this.removeAllCookiesAndBombs();
  console.warn("GAME OVER");
  location.reload();

  window.confirm(
    `⚠️ GAME OVER \n Here are your stats: \n\n 🍪 COOKIES \n Cookies collected (HIGHSCORE): ${highscore} \n Cookies collected (current score): ${score} \n Cookies missed: ${Player.cookies.missed} \n Cookies spawned: ${Player.cookies.spawned} \n\n 💣 BOMBS \n Bombs clicked: ${Player.bombs.clicked} \n Bombs spawned: ${Player.bombs.spawned} \n\n ℹ️ NOTE \n After closing this dialog the game automaticaly restarts.`
  );
};

// DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
  let observationGame = new ObservationGame();

  observationGame.start();
});
