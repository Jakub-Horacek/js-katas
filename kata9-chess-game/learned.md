# New stuff I learned while working on this kata

- I used the `cloneNode()` method for the first time. It creates a copy of a node and returns the clone. I used it to remove any event listeners attached to a cell by replacing the cell with a clone of itself that does not have any event listeners attached.

- I also used the `{ once: true }` option for the `addEventListener()` method for the first time. It removes the event listener after it has been triggered once. I used it to remove the event listener for the `click` event on a cell after the cell has been clicked.

- I learned about `.some()` method. It tests whether at least one element in the array passes the test implemented by the provided function. It returns a Boolean value. I used it to check if the clicked cell is a valid move in the `isLegalMove()` function in the `utils.js` file.

- I also tried to use more ES6 features like arrow functions, destructuring, and template literals.
  - Arrow functions: I used arrow functions for example in the event listeners.
  - Destructuring: I used destructuring to extract the `row` and `col` values from the `move` when determining the possible moves for a piece.
  - Template literals: I used template literals the most whenever I was logging something to the console.
