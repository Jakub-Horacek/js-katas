import { createChessBoard, renderChessBoard, rotateBoard, handlePieceClick } from "./chess.js";

/**
 * App initialization
 */
document.addEventListener("DOMContentLoaded", () => {
  const appElement = document.getElementById("app");

  // Create and render the initial chessboard
  const chessBoard = createChessBoard();
  renderChessBoard(appElement, chessBoard);

  // Rotate board button
  const rotateButton = document.createElement("button");
  rotateButton.id = "rotate-btn";
  rotateButton.textContent = "Rotate Board";
  rotateButton.addEventListener("click", () => rotateBoard(chessBoard));
  appElement.appendChild(rotateButton);
});
