/**
 * Scoring, combo multiplier, Back-to-Back, and Star calculation
 */

import { SCORE_VALUES } from './constants.js';

/**
 * Calculates score for line clear
 */
export function calculateScore({
  linesCleared = 0,
  level = 1,
  combo = 0,
  isBackToBack = false,
  isSpin = false,
  isPerfectClear = false,
  dropCells = 0,
  isHardDrop = false,
  scoreMultiplier = 1,
  comboBonusMultiplier = 1,
}) {
  let baseScore = 0;
  let actionName = '';

  if (isSpin) {
    if (linesCleared === 1) {
      baseScore = SCORE_VALUES.SPIN_SINGLE;
      actionName = 'SPIN SINGLE';
    } else if (linesCleared === 2) {
      baseScore = SCORE_VALUES.SPIN_DOUBLE;
      actionName = 'SPIN DOUBLE';
    } else if (linesCleared === 3) {
      baseScore = SCORE_VALUES.SPIN_TRIPLE;
      actionName = 'SPIN TRIPLE';
    } else {
      baseScore = SCORE_VALUES.SPIN_SINGLE / 2;
      actionName = 'SPIN';
    }
  } else {
    switch (linesCleared) {
      case 1:
        baseScore = SCORE_VALUES.SINGLE;
        actionName = 'SINGLE';
        break;
      case 2:
        baseScore = SCORE_VALUES.DOUBLE;
        actionName = 'DOUBLE';
        break;
      case 3:
        baseScore = SCORE_VALUES.TRIPLE;
        actionName = 'TRIPLE';
        break;
      case 4:
        baseScore = SCORE_VALUES.QUAD;
        actionName = 'QUAD';
        break;
      default:
        baseScore = 0;
    }
  }

  // Level scaling
  let lineScore = baseScore * level;

  // Back-to-back bonus (+50%)
  if (isBackToBack && (linesCleared === 4 || isSpin)) {
    lineScore = Math.floor(lineScore * 1.5);
    actionName = `B2B ${actionName}`;
  }

  // Combo bonus: 50 * combo * level * comboMultiplier
  let comboScore = 0;
  if (combo > 0 && linesCleared > 0) {
    comboScore = Math.floor(50 * combo * level * comboBonusMultiplier);
  }

  // Perfect clear bonus
  let pcScore = 0;
  if (isPerfectClear) {
    pcScore = SCORE_VALUES.PERFECT_CLEAR * level;
    actionName = 'PERFECT CLEAR';
  }

  // Drop points
  let dropScore = 0;
  if (dropCells > 0) {
    dropScore = dropCells * (isHardDrop ? SCORE_VALUES.HARD_DROP : SCORE_VALUES.SOFT_DROP);
  }

  const totalPoints = Math.floor((lineScore + comboScore + pcScore + dropScore) * scoreMultiplier);

  return {
    totalPoints,
    baseScore,
    lineScore,
    comboScore,
    pcScore,
    dropScore,
    actionName,
  };
}

/**
 * Calculates 1-3 stars based on level objective completion and target thresholds
 */
export function calculateStars(levelDef, currentStats) {
  if (!levelDef) return 1;

  let stars = 1; // 1 star for finishing main objective

  // 2nd star: target score reached or bonus objective
  if (levelDef.star2Score && currentStats.score >= levelDef.star2Score) {
    stars = Math.max(stars, 2);
  }

  // 3rd star: mastery condition (high score, quads, combos, or time)
  if (levelDef.star3Score && currentStats.score >= levelDef.star3Score) {
    stars = Math.max(stars, 3);
  } else if (levelDef.star3Condition && levelDef.star3Condition(currentStats)) {
    stars = Math.max(stars, 3);
  }

  return stars;
}
