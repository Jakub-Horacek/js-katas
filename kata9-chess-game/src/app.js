import { createChessBoard, renderChessBoard, handlePieceClick } from "./chess.js";

/**
 * App initialization
 */
document.addEventListener("DOMContentLoaded", () => {
  const appElement = document.getElementById("app");

  // Create and render the initial chessboard
  const chessBoard = createChessBoard();
  renderChessBoard(appElement, chessBoard);
});
