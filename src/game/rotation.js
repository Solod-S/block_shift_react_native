/**
 * Super Rotation System (SRS) Wall Kicks and Floor Kicks implementation
 */

import { PIECE_TYPES } from './constants.js';
import { getPieceCells } from './pieces.js';
import { isValidPosition } from './board.js';

// Standard Wall Kick Data for J, L, S, T, Z
// Offset format: [dx, dy] where positive dx is right, positive dy is down
const JLSTZ_WALL_KICKS = {
  // 0 -> 1 (Clockwise from spawn)
  '0->1': [
    [0, 0],
    [-1, 0],
    [-1, -1],
    [0, 2],
    [-1, 2],
  ],
  // 1 -> 0 (Counter-clockwise to spawn)
  '1->0': [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, -2],
    [1, -2],
  ],
  // 1 -> 2
  '1->2': [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, -2],
    [1, -2],
  ],
  // 2 -> 1
  '2->1': [
    [0, 0],
    [-1, 0],
    [-1, -1],
    [0, 2],
    [-1, 2],
  ],
  // 2 -> 3
  '2->3': [
    [0, 0],
    [1, 0],
    [1, -1],
    [0, 2],
    [1, 2],
  ],
  // 3 -> 2
  '3->2': [
    [0, 0],
    [-1, 0],
    [-1, 1],
    [0, -2],
    [-1, -2],
  ],
  // 3 -> 0
  '3->0': [
    [0, 0],
    [-1, 0],
    [-1, 1],
    [0, -2],
    [-1, -2],
  ],
  // 0 -> 3
  '0->3': [
    [0, 0],
    [1, 0],
    [1, -1],
    [0, 2],
    [1, 2],
  ],
};

// Wall Kick Data for I-Piece (4x4 box)
const I_WALL_KICKS = {
  '0->1': [
    [0, 0],
    [-2, 0],
    [1, 0],
    [-2, 1],
    [1, -2],
  ],
  '1->0': [
    [0, 0],
    [2, 0],
    [-1, 0],
    [2, -1],
    [-1, 2],
  ],
  '1->2': [
    [0, 0],
    [-1, 0],
    [2, 0],
    [-1, -2],
    [2, 1],
  ],
  '2->1': [
    [0, 0],
    [1, 0],
    [-2, 0],
    [1, 2],
    [-2, -1],
  ],
  '2->3': [
    [0, 0],
    [2, 0],
    [-1, 0],
    [2, -1],
    [-1, 2],
  ],
  '3->2': [
    [0, 0],
    [-2, 0],
    [1, 0],
    [-2, 1],
    [1, -2],
  ],
  '3->0': [
    [0, 0],
    [1, 0],
    [-2, 0],
    [1, 2],
    [-2, -1],
  ],
  '0->3': [
    [0, 0],
    [-1, 0],
    [2, 0],
    [-1, -2],
    [2, 1],
  ],
};

/**
 * Attempts to rotate a piece clockwise (direction = 1) or counter-clockwise (direction = -1 / 3).
 * Returns { success: boolean, newX, newY, newRotation, kicked: boolean }
 */
export function tryRotate(board, piece, direction = 1) {
  if (piece.type === PIECE_TYPES.O) {
    // O piece does not need kick calculations
    return {
      success: true,
      newX: piece.x,
      newY: piece.y,
      newRotation: piece.rotation,
      kicked: false,
    };
  }

  const currentRotation = piece.rotation;
  const newRotation = (currentRotation + (direction === 1 ? 1 : 3)) % 4;
  const kickKey = `${currentRotation}->${newRotation}`;

  const kickTable = piece.type === PIECE_TYPES.I ? I_WALL_KICKS : JLSTZ_WALL_KICKS;
  const tests = kickTable[kickKey] || [[0, 0]];

  for (let i = 0; i < tests.length; i++) {
    const [dx, dy] = tests[i];
    const testX = piece.x + dx;
    const testY = piece.y + dy;

    if (isValidPosition(board, piece, testX, testY, newRotation)) {
      return {
        success: true,
        newX: testX,
        newY: testY,
        newRotation,
        kicked: dx !== 0 || dy !== 0,
      };
    }
  }

  return {
    success: false,
    newX: piece.x,
    newY: piece.y,
    newRotation: piece.rotation,
    kicked: false,
  };
}
