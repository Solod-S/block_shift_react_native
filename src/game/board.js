/**
 * Board manipulation, collision detection, and line clearing logic
 */

import { BOARD_COLS, BOARD_TOTAL_ROWS, BOARD_HIDDEN_ROWS } from './constants.js';
import { getPieceCells } from './pieces.js';

/**
 * Creates a clean empty 10x24 board filled with null
 */
export function createEmptyBoard() {
  const board = [];
  for (let r = 0; r < BOARD_TOTAL_ROWS; r++) {
    const row = new Array(BOARD_COLS).fill(null);
    board.push(row);
  }
  return board;
}

/**
 * Clones a board deeply
 */
export function cloneBoard(board) {
  return board.map((row) => [...row]);
}

/**
 * Checks if a piece at given coordinates and rotation fits into the board without colliding
 */
export function isValidPosition(board, piece, posX = piece.x, posY = piece.y, rotation = piece.rotation) {
  const cells = getPieceCells(piece, posX, posY, rotation);

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];

    // Out of horizontal bounds
    if (cell.x < 0 || cell.x >= BOARD_COLS) {
      return false;
    }

    // Below board floor
    if (cell.y >= BOARD_TOTAL_ROWS) {
      return false;
    }

    // Above ceiling (cell.y < 0) is allowed during spawn or kicks if x is valid
    if (cell.y < 0) {
      continue;
    }

    // Colliding with locked block
    if (board[cell.y] && board[cell.y][cell.x] !== null) {
      return false;
    }
  }

  return true;
}

/**
 * Tries to move a piece by deltaX, deltaY
 */
export function tryMove(board, piece, deltaX, deltaY) {
  const newX = piece.x + deltaX;
  const newY = piece.y + deltaY;

  if (isValidPosition(board, piece, newX, newY, piece.rotation)) {
    return {
      success: true,
      newX,
      newY,
    };
  }

  return {
    success: false,
    newX: piece.x,
    newY: piece.y,
  };
}

/**
 * Checks if piece is currently grounded (cannot move down 1 cell)
 */
export function isGrounded(board, piece) {
  return !isValidPosition(board, piece, piece.x, piece.y + 1, piece.rotation);
}

/**
 * Locks piece into board array and returns new board
 */
export function lockPiece(board, piece) {
  const newBoard = cloneBoard(board);
  const cells = getPieceCells(piece, piece.x, piece.y, piece.rotation);

  for (let i = 0; i < cells.length; i++) {
    const { x, y, color } = cells[i];
    if (y >= 0 && y < BOARD_TOTAL_ROWS && x >= 0 && x < BOARD_COLS) {
      newBoard[y][x] = color;
    }
  }

  return newBoard;
}

/**
 * Checks if any cell locked in the hidden spawn rows (top out)
 */
export function isTopOut(board, piece) {
  const cells = getPieceCells(piece, piece.x, piece.y, piece.rotation);
  return cells.some((cell) => cell.y < BOARD_HIDDEN_ROWS);
}

/**
 * Finds all full rows indices in the board
 */
export function findFullRows(board) {
  const fullRows = [];
  for (let r = 0; r < BOARD_TOTAL_ROWS; r++) {
    const isFull = board[r].every((cell) => cell !== null);
    if (isFull) {
      fullRows.push(r);
    }
  }
  return fullRows;
}

/**
 * Clears full rows and adds empty rows at the top
 */
export function clearRows(board, fullRows) {
  if (!fullRows || fullRows.length === 0) {
    return cloneBoard(board);
  }

  const remainingRows = board.filter((_, idx) => !fullRows.includes(idx));
  const newEmptyRows = [];

  for (let i = 0; i < fullRows.length; i++) {
    newEmptyRows.push(new Array(BOARD_COLS).fill(null));
  }

  return [...newEmptyRows, ...remainingRows];
}

/**
 * Checks if board is completely empty (for Perfect Clear)
 */
export function isBoardEmpty(board) {
  for (let r = 0; r < BOARD_TOTAL_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      if (board[r][c] !== null) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Returns highest occupied stack height (from bottom of board)
 */
export function getStackHeight(board) {
  for (let r = 0; r < BOARD_TOTAL_ROWS; r++) {
    if (board[r].some((cell) => cell !== null)) {
      return BOARD_TOTAL_ROWS - r;
    }
  }
  return 0;
}
