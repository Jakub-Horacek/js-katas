// NOTE: Number of cards the player plays with (this number needs to be even)
let playcardsCount = 12;

// Round the playcardsCount to the nearest even number if the number is odd
if ((playcardsCount | 1) === playcardsCount) {
  playcardsCount = 2 * Math.round(playcardsCount / 2);
}
