/**
 * Player
 */
let Player = {
  score: {
    current: 0,
    cookie: 150,
    bomb: 200,
  },
  health: {
    current: 50,
    dmg: 15,
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
 * @param {CookieType} type
 */
function Cookie(icons, type, updateHealthpoints) {
  this.icons = icons;
  this.type = type;
  this.handleCookieClick = null;
  this.updateHealthpoints = updateHealthpoints;
  this.getRandomPosition = function (min, max) {
    return Math.random() * (max - min) + min;
  };
}

/**
 * Spawn cookie
 */
Cookie.prototype.spawn = function () {
  this.element = document.createElement("div");
  this.element.className = "cookie";
  const { cookie, bomb } = this.icons;

  switch (this.type) {
    case CookieType.COOKIE:
      this.element.classList.add("cookie--cookie");
      this.element.innerHTML = cookie;
      this.handleCookieClick = () => {
        console.log(cookie);
        this.updateHealthpoints(Player.health.current + Player.health.gain);
      };
      break;
    case CookieType.BOMB:
      this.element.classList.add("cookie--bomb");
      this.element.innerHTML = bomb;
      this.handleCookieClick = () => {
        console.log(bomb);
        this.updateHealthpoints(Player.health.current - Player.health.dmg);
      };
      break;
  }

  this.element.style.left = `${this.getRandomPosition(
    0,
    window.innerWidth - 35,
  )}px`;
  this.element.style.top = `${this.getRandomPosition(
    0,
    window.innerHeight - 35,
  )}px`;

  this.element.addEventListener("click", this.handleCookieClick);
  return this.element;
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
  this.bombChance = 15; // percentage (maximum is 100)
}

/**
 * Start spawning
 */
ObservationGame.prototype.start = function () {
  this.updateHealthpoints(Player.health.current, true);
  this.spawning();
};

/**
 * Update the healthbar
 * @param {number} hp
 * @param {boolean} isNew
 */
ObservationGame.prototype.updateHealthpoints = function (hp, isNew = false) {
  const healthbar = document.getElementById("healthbar");

  if (hp <= 0) {
    hp = 0;
    console.warn("GAME OVER");
  } else if (hp >= 100) {
    hp = 100;
  }

  const hpTitle = isNew
    ? document.createElement("div")
    : document.getElementById("hp-title");
  hpTitle.className = "hp--title";
  hpTitle.innerText = `Healthpoints: ${hp}/100`;

  const hpBar = isNew
    ? document.createElement("div")
    : document.getElementById("hp-bar");
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
 * Spawn Cookie
 */
ObservationGame.prototype.spawnCookie = function (lifespan) {
  const cookie = new Cookie(
    this.icons,
    CookieType.COOKIE,
    this.updateHealthpoints,
  );
  const spawnedCookie = cookie.spawn();

  this.gameElement.appendChild(spawnedCookie);
  setTimeout(() => {
    this.gameElement.removeChild(spawnedCookie);
  }, lifespan);
};

/**
 * Spawn Bomb
 */
ObservationGame.prototype.spawnBomb = function (lifespan) {
  const bomb = new Cookie(this.icons, CookieType.BOMB, this.updateHealthpoints);
  const spawnedBomb = bomb.spawn();

  this.gameElement.appendChild(spawnedBomb);
  setTimeout(() => {
    this.gameElement.removeChild(spawnedBomb);
  }, lifespan);
};

ObservationGame.prototype.spawning = function () {
  setInterval(() => {
    const number = Math.random() * (100 - 0);

    if (number <= this.bombChance) {
      this.spawnBomb(6000);
    } else {
      this.spawnCookie(5000);
    }
  }, 2000);
};

// DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function (event) {
  let observationGame = new ObservationGame();

  observationGame.start();
});
