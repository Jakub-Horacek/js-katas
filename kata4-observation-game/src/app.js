/**
 * Player health
 * TODO: I should put this health object into some kind of Player.prototype or something
 */
let health = {
  current: 50,
  dmg: 15,
  gain: 5,
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
function Cookie(icons, type = CookieType.COOKIE, updateHealthpoints) {
  this.icons = icons;
  this.type = type;
  this.handleCookieClick = null;
  this.updateHealthpoints = updateHealthpoints;
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
        this.updateHealthpoints(health.current + health.gain);
      };
      break;
    case CookieType.BOMB:
      this.element.classList.add("cookie--bomb");
      this.element.innerHTML = bomb;
      this.handleCookieClick = () => {
        console.log(bomb);
        this.updateHealthpoints(health.current - health.dmg);
      };
      break;
  }

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
}

/**
 * Start spawning
 */
ObservationGame.prototype.start = function () {
  this.updateHealthpoints(health.current, true);
  this.spawnCookie();
  this.spawnBomb();
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

  health.current = hp;
};

/**
 * Spawn Cookie
 */
ObservationGame.prototype.spawnCookie = function () {
  const cookie = new Cookie(
    this.icons,
    CookieType.COOKIE,
    this.updateHealthpoints,
  );
  const spawnedCookie = cookie.spawn();

  this.gameElement.appendChild(spawnedCookie);
};

/**
 * Spawn Bomb
 */
ObservationGame.prototype.spawnBomb = function () {
  const bomb = new Cookie(this.icons, CookieType.BOMB, this.updateHealthpoints);
  const spawnedBomb = bomb.spawn();

  this.gameElement.appendChild(spawnedBomb);
};

// DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function (event) {
  let observationGame = new ObservationGame();

  observationGame.start();
});
