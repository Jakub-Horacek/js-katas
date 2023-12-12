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
function Cookie(icons, type = CookieType.COOKIE) {
  this.icons = icons;
  this.type = type;
  this.handleCookieClick = null;
}

/**
 * Spawn cookie
 */
Cookie.prototype.spawn = function () {
  this.element = document.createElement("div");
  this.element.className = "cookie";

  switch (this.type) {
    case CookieType.COOKIE:
      this.element.classList.add("cookie--cookie");
      this.element.innerHTML = this.icons.cookie;
      break;
    case CookieType.BOMB:
      this.element.classList.add("cookie--bomb");
      this.element.innerHTML = this.icons.bomb;
      break;
  }

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
  this.spawnCookie();
  this.spawnBomb();
};

/**
 * Spawn Cookie
 */
ObservationGame.prototype.spawnCookie = function () {
  const cookie = new Cookie(this.icons, CookieType.COOKIE);
  const spawnedCookie = cookie.spawn();

  this.gameElement.appendChild(spawnedCookie);
};

/**
 * Spawn Bomb
 */
ObservationGame.prototype.spawnBomb = function () {
  const bomb = new Cookie(this.icons, CookieType.BOMB);
  const spawnedBomb = bomb.spawn();

  this.gameElement.appendChild(spawnedBomb);
};

// DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function (event) {
  let observationGame = new ObservationGame();

  observationGame.start();
});
