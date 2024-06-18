import { isLegalMove, getPossibleMoves } from "./utils.js";
import { log } from "./logger.js";

const pieceImages = {
  P: "pieces/white-pawn.png",
  p: "pieces/black-pawn.png",
  R: "pieces/white-rook.png",
  r: "pieces/black-rook.png",
  N: "pieces/white-knight.png",
  n: "pieces/black-knight.png",
  B: "pieces/white-bishop.png",
  b: "pieces/black-bishop.png",
  Q: "pieces/white-queen.png",
  q: "pieces/black-queen.png",
  K: "pieces/white-king.png",
  k: "pieces/black-king.png",
};

let selectedPiece = null; // Track the currently selected piece

/**
 * Create initial chess board configuration
 * @returns {Array<Array<string>>} 2D array representing the chess board
 */
export function createChessBoard() {
  return [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ];
}

/**
 * Render chess board
 * @param {HTMLElement} container - The container element to render the board into
 * @param {Array<Array<string>>} board - The 2D array representing the chess board
 */
export function renderChessBoard(container, board) {
  container.innerHTML = ""; // Clear the container

  const boardElement = document.createElement("div");
  boardElement.id = "chessboard";

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = document.createElement("div");
      cellElement.className = `cell ${(rowIndex + colIndex) % 2 === 0 ? "white" : "black"}`;
      cellElement.dataset.row = rowIndex;
      cellElement.dataset.col = colIndex;

      if (cell) {
        const pieceElement = document.createElement("div");
        pieceElement.className = "piece";
        pieceElement.style.backgroundImage = `url(${pieceImages[cell]})`;
        cellElement.appendChild(pieceElement);
        cellElement.addEventListener("click", () => handlePieceClick(rowIndex, colIndex, board));
      }

      boardElement.appendChild(cellElement);
    });
  });

  container.appendChild(boardElement);
}

/**
 * Handle piece click
 * @param {number} row - The row index of the clicked piece
 * @param {number} col - The column index of the clicked piece
 * @param {Array<Array<string>>} board - The 2D array representing the chess board
 */
export function handlePieceClick(row, col, board) {
  log(`Piece clicked: ${board[row][col]}`, "info");
  const piece = board[row][col];

  // Update the selected piece state
  selectedPiece = { row, col, piece };
  const possibleMoves = getPossibleMoves(row, col, piece, board);

  // Clear previous highlights and event listeners
  document.querySelectorAll(".possible-move").forEach((cell) => {
    cell.classList.remove("possible-move");
    cell.replaceWith(cell.cloneNode(true)); // Remove all event listeners by replacing the node
  });

  possibleMoves.forEach(([moveRow, moveCol]) => {
    const cell = document.querySelector(`.cell[data-row="${moveRow}"][data-col="${moveCol}"]`);
    if (cell) {
      cell.classList.add("possible-move");
      cell.addEventListener("click", () => movePiece(selectedPiece.row, selectedPiece.col, moveRow, moveCol, board), { once: true });
    }
  });
}

/**
 * Move piece to new location
 * @param {number} fromRow - The starting row index
 * @param {number} fromCol - The starting column index
 * @param {number} toRow - The target row index
 * @param {number} toCol - The target column index
 * @param {Array<Array<string>>} board - The 2D array representing the chess board
 */
function movePiece(fromRow, fromCol, toRow, toCol, board) {
  if (!isLegalMove(fromRow, fromCol, toRow, toCol, board)) return;

  board[toRow][toCol] = board[fromRow][fromCol];
  board[fromRow][fromCol] = "";

  selectedPiece = null; // Clear the selected piece state
  renderChessBoard(document.getElementById("app"), board);
}
