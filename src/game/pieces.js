/**
 * Tetromino pieces definitions and rotation states
 * Rotation 0: Initial spawn
 * Rotation 1: 90 deg clockwise (R)
 * Rotation 2: 180 deg (2)
 * Rotation 3: 270 deg clockwise / 90 deg CCW (L)
 */

import { PIECE_COLORS, PIECE_TYPES } from './constants.js';

export const PIECES = {
  [PIECE_TYPES.I]: {
    id: PIECE_TYPES.I,
    color: PIECE_COLORS.I,
    size: 4,
    // Spawn offset (column, row)
    spawnX: 3,
    spawnY: 1,
    rotationStates: [
      // 0: Horizontal
      [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
      ],
      // 1: Vertical
      [
        { x: 2, y: 0 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
        { x: 2, y: 3 },
      ],
      // 2: Horizontal
      [
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
      ],
      // 3: Vertical
      [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
      ],
    ],
  },

  [PIECE_TYPES.O]: {
    id: PIECE_TYPES.O,
    color: PIECE_COLORS.O,
    size: 2,
    spawnX: 4,
    spawnY: 2,
    rotationStates: [
      // All rotations are identical for O
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
    ],
  },

  [PIECE_TYPES.T]: {
    id: PIECE_TYPES.T,
    color: PIECE_COLORS.T,
    size: 3,
    spawnX: 3,
    spawnY: 2,
    rotationStates: [
      // 0: T pointing up
      [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ],
      // 1: T pointing right
      [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 2 },
      ],
      // 2: T pointing down
      [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 2 },
      ],
      // 3: T pointing left
      [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ],
    ],
  },

  [PIECE_TYPES.S]: {
    id: PIECE_TYPES.S,
    color: PIECE_COLORS.S,
    size: 3,
    spawnX: 3,
    spawnY: 2,
    rotationStates: [
      // 0
      [
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      // 1
      [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
      ],
      // 2
      [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 0, y: 2 },
        { x: 1, y: 2 },
      ],
      // 3
      [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ],
    ],
  },

  [PIECE_TYPES.Z]: {
    id: PIECE_TYPES.Z,
    color: PIECE_COLORS.Z,
    size: 3,
    spawnX: 3,
    spawnY: 2,
    rotationStates: [
      // 0
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ],
      // 1
      [
        { x: 2, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 2 },
      ],
      // 2
      [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
      ],
      // 3
      [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 0, y: 2 },
      ],
    ],
  },

  [PIECE_TYPES.J]: {
    id: PIECE_TYPES.J,
    color: PIECE_COLORS.J,
    size: 3,
    spawnX: 3,
    spawnY: 2,
    rotationStates: [
      // 0
      [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ],
      // 1
      [
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ],
      // 2
      [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
      ],
      // 3
      [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 2 },
        { x: 1, y: 2 },
      ],
    ],
  },

  [PIECE_TYPES.L]: {
    id: PIECE_TYPES.L,
    color: PIECE_COLORS.L,
    size: 3,
    spawnX: 3,
    spawnY: 2,
    rotationStates: [
      // 0
      [
        { x: 2, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ],
      // 1
      [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
      ],
      // 2
      [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 0, y: 2 },
      ],
      // 3
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ],
    ],
  },
};

/**
 * Returns absolute grid coordinates of piece blocks
 */
export function getPieceCells(piece, posX = piece.x, posY = piece.y, rotation = piece.rotation) {
  const def = PIECES[piece.type];
  if (!def) return [];
  const state = def.rotationStates[rotation % 4];
  return state.map((cell) => ({
    x: posX + cell.x,
    y: posY + cell.y,
    color: piece.color || def.color,
  }));
}

/**
 * Creates a fresh active piece instance
 */
export function createActivePiece(pieceType) {
  const def = PIECES[pieceType];
  return {
    type: pieceType,
    color: def.color,
    rotation: 0,
    x: def.spawnX,
    y: def.spawnY,
  };
}
