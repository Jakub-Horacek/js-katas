import { log } from "./logger.js";

/**
 * Determine if a move is legal
 * @param {number} fromRow - The starting row index
 * @param {number} fromCol - The starting column index
 * @param {number} toRow - The target row index
 * @param {number} toCol - The target column index
 * @param {Array<Array<string>>} board - The 2D array representing the chess board
 * @returns {boolean} True if the move is legal, false otherwise
 */
export function isLegalMove(fromRow, fromCol, toRow, toCol, board) {
  // Implement logic to determine if the move is legal
  const piece = board[fromRow][fromCol];
  const target = board[toRow][toCol];

  // Basic rules: piece cannot move to a square occupied by a piece of the same color
  if (piece && target && checkColor(piece) === checkColor(target)) {
    log("Illegal move: piece cannot move to a square occupied by a piece of the same color", "warn");
    return false;
  }

  const possibleMoves = getPossibleMoves(fromRow, fromCol, piece, board);
  return possibleMoves.some(([row, col]) => row === toRow && col === toCol);
}

function checkColor(pieceCharacter) {
  if (pieceCharacter === pieceCharacter.toUpperCase()) {
    return "WHITE";
  } else if (pieceCharacter === pieceCharacter.toLowerCase()) {
    return "BLACK";
  }
}

/**
 * Get possible moves for a piece
 * @param {number} row - The row index of the piece
 * @param {number} col - The column index of the piece
 * @param {string} piece - The piece type
 * @param {Array<Array<string>>} board - The 2D array representing the chess board
 * @returns {Array<Array<number>>} Array of possible move positions
 */
export function getPossibleMoves(row, col, piece, board) {
  const moves = [];
  const directions = {
    P: [[-1, 0]], // White pawn moves up
    p: [[1, 0]], // Black pawn moves down
    R: [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ], // Rook
    B: [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ], // Bishop
    N: [
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
      [1, 2],
      [1, -2],
      [-1, 2],
      [-1, -2],
    ], // Knight
    Q: [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ], // Queen
    K: [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ], // King
  };

  const isWithinBoard = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

  if (piece.toLowerCase() === "r" || piece.toLowerCase() === "q") {
    for (const [dr, dc] of directions.R) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        if (!isWithinBoard(newRow, newCol)) break;
        if (board[newRow][newCol]) {
          if (piece.toLowerCase() !== board[newRow][newCol].toLowerCase()) moves.push([newRow, newCol]);
          break;
        }
        moves.push([newRow, newCol]);
      }
    }
  }
  if (piece.toLowerCase() === "b" || piece.toLowerCase() === "q") {
    for (const [dr, dc] of directions.B) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        if (!isWithinBoard(newRow, newCol)) break;
        if (board[newRow][newCol]) {
          if (piece.toLowerCase() !== board[newRow][newCol].toLowerCase()) moves.push([newRow, newCol]);
          break;
        }
        moves.push([newRow, newCol]);
      }
    }
  }
  if (piece.toLowerCase() === "n") {
    for (const [dr, dc] of directions.N) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (isWithinBoard(newRow, newCol) && (!board[newRow][newCol] || piece.toLowerCase() !== board[newRow][newCol].toLowerCase())) {
        moves.push([newRow, newCol]);
      }
    }
  }
  if (piece.toLowerCase() === "k") {
    for (const [dr, dc] of directions.K) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (isWithinBoard(newRow, newCol) && (!board[newRow][newCol] || piece.toLowerCase() !== board[newRow][newCol].toLowerCase())) {
        moves.push([newRow, newCol]);
      }
    }
  }
  if (piece === "P") {
    const [dr, dc] = directions.P[0];
    const newRow = row + dr;
    const newCol = col + dc;
    if (isWithinBoard(newRow, newCol) && !board[newRow][newCol]) moves.push([newRow, newCol]);
  }
  if (piece === "p") {
    const [dr, dc] = directions.p[0];
    const newRow = row + dr;
    const newCol = col + dc;
    if (isWithinBoard(newRow, newCol) && !board[newRow][newCol]) moves.push([newRow, newCol]);
  }

  return moves;
}
