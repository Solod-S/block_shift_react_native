/**
 * Ghost Piece calculation and Hard Drop invariant
 * Ghost Y is the single source of truth for Hard Drop landing position.
 */

import { isValidPosition } from './board.js';
import { getPieceCells } from './pieces.js';

/**
 * Pure helper to compute lowest valid Y for active piece in its current rotation
 */
export function getGhostY(board, activePiece) {
  if (!activePiece) return 0;

  let ghostY = activePiece.y;

  while (
    isValidPosition(
      board,
      activePiece,
      activePiece.x,
      ghostY + 1,
      activePiece.rotation
    )
  ) {
    ghostY += 1;
  }

  return ghostY;
}

/**
 * Returns ghost piece representation with computed coordinates
 */
export function getGhostPiece(board, activePiece) {
  if (!activePiece) return null;

  const ghostY = getGhostY(board, activePiece);

  return {
    type: activePiece.type,
    color: activePiece.color,
    rotation: activePiece.rotation,
    x: activePiece.x,
    y: ghostY,
    cells: getPieceCells(activePiece, activePiece.x, ghostY, activePiece.rotation),
  };
}

/**
 * Performs Hard Drop: uses computed Ghost Y as exact landing target
 * Invariant: hardDrop(board, activePiece).finalY === getGhostY(board, activePiece)
 */
export function hardDrop(board, activePiece) {
  const targetY = getGhostY(board, activePiece);
  const dropDistance = Math.max(0, targetY - activePiece.y);

  return {
    finalPiece: {
      ...activePiece,
      y: targetY,
    },
    dropDistance,
    targetY,
  };
}
