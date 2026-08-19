/**
 * Automated Test Suite for Block Shift Game Engine
 * Validates Ghost / Hard Drop invariant, 7-Bag, SRS, Hold, Line Clears, and Levels.
 */

import { PIECE_TYPES } from '../game/constants.js';
import { createActivePiece } from '../game/pieces.js';
import {
  createEmptyBoard,
  isValidPosition,
  tryMove,
  lockPiece,
  findFullRows,
  clearRows,
  isBoardEmpty,
} from '../game/board.js';
import { tryRotate } from '../game/rotation.js';
import { getGhostY, hardDrop } from '../game/ghost.js';
import { shuffleBag, BagManager } from '../game/bag.js';
import { calculateScore } from '../game/scoring.js';
import { LockDelayManager } from '../game/lockDelay.js';
import { validateAllLevels } from '../levels/validation.js';

export function runAllTests() {
  const results = [];

  function assert(testName, condition, details = '') {
    if (condition) {
      results.push({ name: testName, passed: true });
    } else {
      results.push({ name: testName, passed: false, error: details });
      console.error(`❌ Test failed: ${testName} - ${details}`);
    }
  }

  // 1. Ghost vs Hard Drop Invariant Test
  const board = createEmptyBoard();
  const pieceTypes = [
    PIECE_TYPES.I,
    PIECE_TYPES.O,
    PIECE_TYPES.T,
    PIECE_TYPES.S,
    PIECE_TYPES.Z,
    PIECE_TYPES.J,
    PIECE_TYPES.L,
  ];

  pieceTypes.forEach((type) => {
    const piece = createActivePiece(type);
    const ghostY = getGhostY(board, piece);
    const dropResult = hardDrop(board, piece);

    assert(
      `Ghost Invariant: ${type} empty board`,
      dropResult.finalPiece.y === ghostY,
      `Hard drop final Y (${dropResult.finalPiece.y}) !== Ghost Y (${ghostY})`
    );

    // Test with rotation
    const rotated = { ...piece, rotation: 1 };
    const rotatedGhostY = getGhostY(board, rotated);
    const rotatedDrop = hardDrop(board, rotated);
    assert(
      `Ghost Invariant: ${type} rotated (R1)`,
      rotatedDrop.finalPiece.y === rotatedGhostY,
      `Rotated hard drop final Y (${rotatedDrop.finalPiece.y}) !== Ghost Y (${rotatedGhostY})`
    );
  });

  // 2. 7-Bag Randomizer Distribution Test
  const bag = shuffleBag();
  assert(
    '7-Bag contains 7 items',
    bag.length === 7,
    `Bag size was ${bag.length}`
  );

  const uniquePieces = new Set(bag);
  assert(
    '7-Bag contains each tetromino exactly once',
    uniquePieces.size === 7,
    `Found only ${uniquePieces.size} unique pieces`
  );

  const bagManager = new BagManager();
  const sequence = [];
  for (let i = 0; i < 14; i++) {
    sequence.push(bagManager.next());
  }
  const first7 = new Set(sequence.slice(0, 7));
  const second7 = new Set(sequence.slice(7, 14));
  assert('BagManager: 1st bag has all 7 pieces', first7.size === 7);
  assert('BagManager: 2nd bag has all 7 pieces', second7.size === 7);

  // 3. Super Rotation System (SRS) Wall Kicks Test
  const jPiece = createActivePiece(PIECE_TYPES.J);
  // Position J against the right wall (x = 8)
  jPiece.x = 8;
  const kickResult = tryRotate(board, jPiece, 1);
  assert(
    'SRS Wall Kick near right wall succeeds',
    kickResult.success && kickResult.newX <= 7,
    `Kick result: ${JSON.stringify(kickResult)}`
  );

  // 4. Line Clear & Perfect Clear Test
  let testBoard = createEmptyBoard();
  // Fill bottom row completely
  testBoard[23] = new Array(10).fill('#00D2D3');
  const fullRows = findFullRows(testBoard);
  assert('Full row detection', fullRows.length === 1 && fullRows[0] === 23);

  testBoard = clearRows(testBoard, fullRows);
  assert(
    'Perfect Clear detection after clearing sole row',
    isBoardEmpty(testBoard),
    'Board was not empty after clearing the only row'
  );

  // 5. Lock Delay & Max Resets Test
  const lockMgr = new LockDelayManager(500, 15);
  lockMgr.onGroundedStateChange(true);
  let resetsPerformed = 0;
  for (let i = 0; i < 20; i++) {
    if (lockMgr.onPieceAction()) {
      resetsPerformed++;
    }
  }
  assert(
    'Lock Delay max resets enforced',
    resetsPerformed === 15,
    `Resets allowed: ${resetsPerformed}, expected 15`
  );

  // 6. Campaign Levels Validation
  const levelValidation = validateAllLevels();
  assert(
    'All 30 Campaign Levels are valid',
    levelValidation.valid,
    levelValidation.errors.join('; ')
  );

  const passedCount = results.filter((r) => r.passed).length;
  console.log(`\n========================================`);
  console.log(`  Block Shift Engine Verification: ${passedCount}/${results.length} PASSED`);
  console.log(`========================================\n`);

  return {
    total: results.length,
    passed: passedCount,
    failed: results.length - passedCount,
    results,
  };
}
