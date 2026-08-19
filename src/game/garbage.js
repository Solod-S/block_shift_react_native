/**
 * Garbage lines generation and rising garbage mechanic
 */

import { BOARD_COLS, BOARD_TOTAL_ROWS, PIECE_COLORS } from './constants.js';
import { cloneBoard } from './board.js';

/**
 * Creates a single garbage row with 1-2 random safe holes
 */
export function createGarbageRow(holeCol = Math.floor(Math.random() * BOARD_COLS)) {
  const row = new Array(BOARD_COLS).fill(PIECE_COLORS.GARBAGE);
  row[holeCol] = null;
  return row;
}

/**
 * Adds initial starting garbage rows to a new board
 */
export function applyStartingGarbage(board, rowCount) {
  if (!rowCount || rowCount <= 0) return board;

  const newBoard = cloneBoard(board);
  let holeCol = Math.floor(Math.random() * BOARD_COLS);

  for (let i = 0; i < rowCount; i++) {
    // Keep hole alignment somewhat consistent with occasional shift
    if (Math.random() < 0.3) {
      holeCol = Math.floor(Math.random() * BOARD_COLS);
    }
    const garbageRow = createGarbageRow(holeCol);
    newBoard.shift(); // Remove top empty row
    newBoard.push(garbageRow); // Push garbage to bottom
  }

  return newBoard;
}

/**
 * Adds a rising garbage row from the bottom
 */
export function addRisingGarbageRow(board, holeCol = Math.floor(Math.random() * BOARD_COLS)) {
  const newBoard = cloneBoard(board);
  const garbageRow = createGarbageRow(holeCol);

  newBoard.shift();
  newBoard.push(garbageRow);

  return newBoard;
}
