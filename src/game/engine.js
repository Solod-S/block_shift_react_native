/**
 * Complete Core Game Engine for Block Shift
 */

import {
  GAME_STATES,
  GAME_MODES,
  BOARD_TOTAL_ROWS,
  DANGER_ROW_THRESHOLD,
} from './constants.js';
import { createActivePiece, getPieceCells } from './pieces.js';
import {
  createEmptyBoard,
  cloneBoard,
  isValidPosition,
  tryMove,
  lockPiece,
  isTopOut,
  findFullRows,
  clearRows,
  isBoardEmpty,
  getStackHeight,
} from './board.js';
import { tryRotate } from './rotation.js';
import { getGhostPiece, hardDrop } from './ghost.js';
import { BagManager } from './bag.js';
import { calculateScore, calculateStars } from './scoring.js';
import { getGravityInterval, getSoftDropInterval, clampDelta } from './gravity.js';
import { LockDelayManager } from './lockDelay.js';
import { applyStartingGarbage, addRisingGarbageRow } from './garbage.js';
import { evaluateObjective } from './objectives.js';
import { UPGRADES } from './upgrades.js';

export class BlockShiftEngine {
  constructor({
    mode = GAME_MODES.CAMPAIGN,
    levelDef = null,
    runUpgrades = {},
    onStateChange = null,
    onEvent = null,
    rng = Math.random,
  } = {}) {
    this.mode = mode;
    this.levelDef = levelDef;
    this.runUpgrades = runUpgrades;
    this.onStateChange = onStateChange;
    this.onEvent = onEvent;
    this.rng = rng;

    this.state = GAME_STATES.BOOT;
    this.board = createEmptyBoard();
    this.bagManager = new BagManager(this.rng);

    this.activePiece = null;
    this.ghostPiece = null;
    this.holdPiece = null;
    this.canHold = true;
    this.holdRefreshesLeft = 0;

    this.score = 0;
    this.lines = 0;
    this.level = levelDef ? levelDef.id : 1;
    this.combo = 0;
    this.maxCombo = 0;
    this.isBackToBack = false;
    this.backToBackCount = 0;
    this.quads = 0;
    this.perfectClears = 0;
    this.piecesPlaced = 0;
    this.garbageCleared = 0;
    this.hardDropsCount = 0;
    this.holdsUsed = 0;

    this.isSoftDropping = false;
    this.gravityAccumulator = 0;
    this.lockDelayManager = new LockDelayManager();

    this.timeElapsedMs = 0;
    this.timeRemainingMs = levelDef && levelDef.timeLimitMs ? levelDef.timeLimitMs : null;

    this.clearingRows = [];
    this.clearAnimationTimer = 0;

    this.lastTimestamp = 0;
    this.rafId = null;
    this.isDestroyed = false;

    this.piecesUntilRisingGarbage = levelDef ? levelDef.risingGarbageEveryPieces : null;
    this.isDanger = false;
    this.topOutShields = 0;

    this.init();
  }

  init() {
    this.board = createEmptyBoard();
    if (this.levelDef && this.levelDef.startingGarbage > 0) {
      this.board = applyStartingGarbage(this.board, this.levelDef.startingGarbage);
    }

    // Apply run upgrades
    let extraLockMs = 0;
    if (this.runUpgrades[UPGRADES.LOCK_STABILIZER.id]) {
      extraLockMs = 80 * this.runUpgrades[UPGRADES.LOCK_STABILIZER.id];
    }
    this.lockDelayManager.setBaseDelay(500 + extraLockMs);

    if (this.runUpgrades[UPGRADES.HOLD_BUFFER.id]) {
      this.holdRefreshesLeft = this.runUpgrades[UPGRADES.HOLD_BUFFER.id];
    }

    if (this.runUpgrades[UPGRADES.RECOVERY_PROTOCOL.id]) {
      this.topOutShields = this.runUpgrades[UPGRADES.RECOVERY_PROTOCOL.id];
    }

    this.spawnNextPiece();
    this.state = GAME_STATES.RUNNING;
    this.notifyState();
  }

  getPreviewCount() {
    let count = 5;
    if (this.runUpgrades[UPGRADES.PREVIEW_MATRIX.id]) {
      count += this.runUpgrades[UPGRADES.PREVIEW_MATRIX.id];
    }
    return Math.min(count, 6);
  }

  getGhost() {
    if (!this.activePiece) return null;
    return getGhostPiece(this.board, this.activePiece);
  }

  updateGhost() {
    this.ghostPiece = this.getGhost();
  }

  spawnNextPiece() {
    const nextType = this.bagManager.next();
    this.activePiece = createActivePiece(nextType);
    this.canHold = true;
    this.lockDelayManager.reset();

    // Check if initial spawn position is blocked (Top out)
    if (!isValidPosition(this.board, this.activePiece)) {
      if (this.topOutShields > 0) {
        // Recovery Protocol activated!
        this.topOutShields--;
        this.board = clearRows(this.board, [4, 5, 6, 7]); // Clear upper rows to save player
        this.emitEvent('recoveryShield');
      } else {
        this.gameOver();
        return;
      }
    }

    this.updateGhost();
    this.checkDangerState();
  }

  checkDangerState() {
    const height = getStackHeight(this.board);
    const inDanger = height >= DANGER_ROW_THRESHOLD;
    if (inDanger !== this.isDanger) {
      this.isDanger = inDanger;
      if (this.isDanger) {
        this.emitEvent('danger');
      }
    }
  }

  // --- Controls ---

  moveLeft() {
    if (this.state !== GAME_STATES.RUNNING || !this.activePiece) return false;

    const result = tryMove(this.board, this.activePiece, -1, 0);
    if (result.success) {
      this.activePiece.x = result.newX;
      this.activePiece.y = result.newY;
      this.lockDelayManager.onPieceAction();
      this.updateGhost();
      this.emitEvent('move');
      this.notifyState();
      return true;
    }
    return false;
  }

  moveRight() {
    if (this.state !== GAME_STATES.RUNNING || !this.activePiece) return false;

    const result = tryMove(this.board, this.activePiece, 1, 0);
    if (result.success) {
      this.activePiece.x = result.newX;
      this.activePiece.y = result.newY;
      this.lockDelayManager.onPieceAction();
      this.updateGhost();
      this.emitEvent('move');
      this.notifyState();
      return true;
    }
    return false;
  }

  rotateClockwise() {
    if (this.state !== GAME_STATES.RUNNING || !this.activePiece) return false;

    const result = tryRotate(this.board, this.activePiece, 1);
    if (result.success) {
      this.activePiece.x = result.newX;
      this.activePiece.y = result.newY;
      this.activePiece.rotation = result.newRotation;
      this.lockDelayManager.onPieceAction();
      this.updateGhost();
      this.emitEvent('rotate', { kicked: result.kicked });
      this.notifyState();
      return true;
    } else {
      this.emitEvent('failedRotate');
      return false;
    }
  }

  rotateCounterClockwise() {
    if (this.state !== GAME_STATES.RUNNING || !this.activePiece) return false;

    const result = tryRotate(this.board, this.activePiece, -1);
    if (result.success) {
      this.activePiece.x = result.newX;
      this.activePiece.y = result.newY;
      this.activePiece.rotation = result.newRotation;
      this.lockDelayManager.onPieceAction();
      this.updateGhost();
      this.emitEvent('rotate', { kicked: result.kicked });
      this.notifyState();
      return true;
    } else {
      this.emitEvent('failedRotate');
      return false;
    }
  }

  startSoftDrop() {
    if (this.state !== GAME_STATES.RUNNING) return;
    this.isSoftDropping = true;
  }

  endSoftDrop() {
    this.isSoftDropping = false;
  }

  hold() {
    if (this.state !== GAME_STATES.RUNNING || !this.activePiece) return false;

    if (!this.canHold) {
      if (this.holdRefreshesLeft > 0) {
        this.holdRefreshesLeft--;
      } else {
        return false;
      }
    }

    const currentType = this.activePiece.type;

    if (!this.holdPiece) {
      this.holdPiece = currentType;
      this.spawnNextPiece();
    } else {
      const swappedType = this.holdPiece;
      this.holdPiece = currentType;
      this.activePiece = createActivePiece(swappedType);
      this.updateGhost();
    }

    this.canHold = false;
    this.holdsUsed++;
    this.emitEvent('hold');
    this.notifyState();
    return true;
  }

  performHardDrop() {
    if (this.state !== GAME_STATES.RUNNING || !this.activePiece) return;

    const dropResult = hardDrop(this.board, this.activePiece);
    this.activePiece = dropResult.finalPiece;
    this.hardDropsCount++;

    // Add hard drop score
    const dropScore = dropResult.dropDistance * 2;
    this.score += dropScore;

    this.emitEvent('hardDrop', { distance: dropResult.dropDistance });
    this.lockActivePiece(true);
  }

  // --- Step & Lock ---

  stepDown(isManual = false) {
    if (this.state !== GAME_STATES.RUNNING || !this.activePiece) return false;

    const result = tryMove(this.board, this.activePiece, 0, 1);
    if (result.success) {
      this.activePiece.x = result.newX;
      this.activePiece.y = result.newY;
      if (isManual) {
        this.score += 1; // 1 point for manual soft drop
      }
      this.updateGhost();
      this.notifyState();
      return true;
    }
    return false;
  }

  lockActivePiece(isHardDrop = false) {
    if (!this.activePiece) return;

    this.board = lockPiece(this.board, this.activePiece);
    this.piecesPlaced++;

    if (isTopOut(this.board, this.activePiece)) {
      if (this.topOutShields > 0) {
        this.topOutShields--;
        this.board = clearRows(this.board, [4, 5, 6, 7]);
        this.emitEvent('recoveryShield');
      } else {
        this.gameOver();
        return;
      }
    }

    this.activePiece = null;
    this.ghostPiece = null;
    this.lockDelayManager.reset();

    // Check full rows
    const fullRows = findFullRows(this.board);

    if (fullRows.length > 0) {
      this.handleLineClear(fullRows);
    } else {
      this.combo = 0;
      this.emitEvent('lock');
      this.afterPieceLock();
    }
  }

  handleLineClear(fullRows) {
    const linesCount = fullRows.length;
    this.lines += linesCount;
    this.combo++;
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
    }

    if (linesCount === 4) {
      this.quads++;
    }

    const isB2B = linesCount === 4 && this.isBackToBack;
    if (linesCount === 4) {
      this.isBackToBack = true;
      if (isB2B) {
        this.backToBackCount++;
      }
    } else {
      this.isBackToBack = false;
    }

    // Check if board will be empty
    const testClearedBoard = clearRows(this.board, fullRows);
    const isPC = isBoardEmpty(testClearedBoard);
    if (isPC) {
      this.perfectClears++;
    }

    // Upgrades multiplier
    let scoreMult = 1;
    if (this.runUpgrades[UPGRADES.SHIFT_MULTIPLIER.id]) {
      scoreMult = 1 + 0.12 * this.runUpgrades[UPGRADES.SHIFT_MULTIPLIER.id];
    }
    let comboMult = 1;
    if (this.runUpgrades[UPGRADES.COMBO_DRIVER.id]) {
      comboMult = 1 + 0.18 * this.runUpgrades[UPGRADES.COMBO_DRIVER.id];
    }

    const scoreResult = calculateScore({
      linesCleared: linesCount,
      level: this.level,
      combo: this.combo,
      isBackToBack: isB2B,
      isPerfectClear: isPC,
      scoreMultiplier: scoreMult,
      comboBonusMultiplier: comboMult,
    });

    this.score += scoreResult.totalPoints;

    // Garbage scrubber upgrade check
    if (this.runUpgrades[UPGRADES.GARBAGE_SCRUBBER.id] && (linesCount === 4 || isB2B)) {
      // Remove one bottom row if it contains garbage
      const bottomRow = this.board[BOARD_TOTAL_ROWS - 1];
      if (bottomRow && bottomRow.includes('#718093')) {
        this.board.pop();
        this.board.unshift(new Array(10).fill(null));
        this.garbageCleared++;
      }
    }

    // Set animation state
    this.clearingRows = fullRows;
    this.clearAnimationTimer = 180; // ms
    this.state = GAME_STATES.LINE_CLEAR;

    this.emitEvent('lineClear', {
      linesCount,
      combo: this.combo,
      isBackToBack: isB2B,
      isPerfectClear: isPC,
      scoreResult,
    });

    this.notifyState();
  }

  afterPieceLock() {
    // Check rising garbage
    if (this.piecesUntilRisingGarbage && this.piecesPlaced % this.piecesUntilRisingGarbage === 0) {
      this.board = addRisingGarbageRow(this.board);
      this.emitEvent('risingGarbage');
    }

    // Check mode objectives
    this.checkObjectives();

    if (this.state === GAME_STATES.RUNNING) {
      this.spawnNextPiece();
      this.notifyState();
    }
  }

  checkObjectives() {
    if (this.mode === GAME_MODES.CAMPAIGN && this.levelDef) {
      const evalResult = evaluateObjective(this.levelDef.objective, this.getStats());
      if (evalResult.isComplete) {
        this.levelClear();
        return;
      }
      if (evalResult.isFailed) {
        this.gameOver();
        return;
      }
    } else if (this.mode === GAME_MODES.SPRINT_40) {
      if (this.lines >= 40) {
        this.levelClear();
        return;
      }
    } else if (this.mode === GAME_MODES.MARATHON) {
      // Level up every 10 lines
      const expectedLevel = 1 + Math.floor(this.lines / 10);
      if (expectedLevel > this.level) {
        this.level = expectedLevel;
        this.emitEvent('levelUp', { level: this.level });
      }
    }
  }

  levelClear() {
    this.state = GAME_STATES.LEVEL_CLEAR;
    const stars = this.levelDef ? calculateStars(this.levelDef, this.getStats()) : 3;
    this.emitEvent('levelClear', { stars, stats: this.getStats() });
    this.notifyState();
  }

  gameOver() {
    this.state = GAME_STATES.GAME_OVER;
    this.emitEvent('gameOver', { stats: this.getStats() });
    this.notifyState();
  }

  pause() {
    if (this.state === GAME_STATES.RUNNING || this.state === GAME_STATES.LINE_CLEAR) {
      this.state = GAME_STATES.PAUSED;
      this.notifyState();
    }
  }

  resume() {
    if (this.state === GAME_STATES.PAUSED) {
      this.state = GAME_STATES.RUNNING;
      this.lastTimestamp = 0;
      this.gravityAccumulator = 0;
      this.notifyState();
    }
  }

  // --- Game Loop Update ---

  update(deltaMs) {
    if (this.state === GAME_STATES.LINE_CLEAR) {
      this.clearAnimationTimer -= deltaMs;
      if (this.clearAnimationTimer <= 0) {
        this.board = clearRows(this.board, this.clearingRows);
        this.clearingRows = [];
        this.state = GAME_STATES.RUNNING;
        this.afterPieceLock();
      }
      return;
    }

    if (this.state !== GAME_STATES.RUNNING || !this.activePiece) return;

    this.timeElapsedMs += deltaMs;
    if (this.timeRemainingMs !== null) {
      this.timeRemainingMs = Math.max(0, this.timeRemainingMs - deltaMs);
      if (this.timeRemainingMs <= 0) {
        this.checkObjectives();
        if (this.state === GAME_STATES.RUNNING) {
          this.gameOver();
          return;
        }
      }
    }

    // Calculate gravity interval
    let dampener = 0;
    if (this.runUpgrades[UPGRADES.GRAVITY_DAMPENER.id]) {
      dampener = 0.06 * this.runUpgrades[UPGRADES.GRAVITY_DAMPENER.id];
    }
    const gravityMult = this.levelDef ? this.levelDef.gravityMultiplier || 1 : 1;
    let gravityInterval = getGravityInterval(this.level, gravityMult, dampener);

    if (this.isSoftDropping) {
      gravityInterval = getSoftDropInterval(gravityInterval);
    }

    // Focus Window upgrade: slow down if combo >= 3
    if (this.runUpgrades[UPGRADES.FOCUS_WINDOW.id] && this.combo >= 3) {
      gravityInterval *= 1.3;
    }

    this.gravityAccumulator += deltaMs;

    while (this.gravityAccumulator >= gravityInterval) {
      const moved = this.stepDown(this.isSoftDropping);
      this.gravityAccumulator -= gravityInterval;
      if (!moved) break;
    }

    // Check lock delay
    const grounded = !isValidPosition(this.board, this.activePiece, this.activePiece.x, this.activePiece.y + 1, this.activePiece.rotation);
    this.lockDelayManager.onGroundedStateChange(grounded);

    if (grounded) {
      const shouldLock = this.lockDelayManager.update(deltaMs);
      if (shouldLock) {
        this.lockActivePiece(false);
      }
    }
  }

  // --- Loop Execution ---

  start() {
    this.lastTimestamp = Date.now();

    const loop = () => {
      if (this.isDestroyed) return;

      const now = Date.now();
      const rawDelta = now - (this.lastTimestamp || now);
      const delta = clampDelta(rawDelta);
      this.lastTimestamp = now;

      if (this.state === GAME_STATES.RUNNING || this.state === GAME_STATES.LINE_CLEAR) {
        this.update(delta);
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  destroy() {
    this.isDestroyed = true;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  getStats() {
    return {
      score: this.score,
      linesCleared: this.lines,
      level: this.level,
      combo: this.combo,
      maxCombo: this.maxCombo,
      backToBackCount: this.backToBackCount,
      quads: this.quads,
      perfectClears: this.perfectClears,
      piecesPlaced: this.piecesPlaced,
      garbageCleared: this.garbageCleared,
      holdsUsed: this.holdsUsed,
      hardDrops: this.hardDropsCount,
      timeElapsedMs: this.timeElapsedMs,
      timeRemainingMs: this.timeRemainingMs,
    };
  }

  getRenderState() {
    return {
      state: this.state,
      mode: this.mode,
      board: this.board,
      activePiece: this.activePiece,
      ghostPiece: this.ghostPiece,
      holdPiece: this.holdPiece,
      canHold: this.canHold,
      nextQueue: this.bagManager.peek(this.getPreviewCount()),
      score: this.score,
      lines: this.lines,
      level: this.level,
      combo: this.combo,
      isBackToBack: this.isBackToBack,
      isDanger: this.isDanger,
      clearingRows: this.clearingRows,
      stats: this.getStats(),
      levelDef: this.levelDef,
    };
  }

  emitEvent(eventName, payload = {}) {
    if (this.onEvent) {
      this.onEvent(eventName, payload);
    }
  }

  notifyState() {
    if (this.onStateChange) {
      this.onStateChange(this.getRenderState());
    }
  }
}
