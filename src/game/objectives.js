/**
 * Campaign level objectives evaluation
 */

export const OBJECTIVE_TYPES = {
  CLEAR_LINES: 'clearLines',
  REACH_SCORE: 'reachScore',
  SURVIVE_PIECES: 'survivePieces',
  COMBO_TARGET: 'comboTarget',
  QUAD_CLEAR: 'quadClear',
  BACK_TO_BACK: 'backToBack',
  TIME_ATTACK: 'timeAttack',
  LIMITED_PIECES: 'limitedPieces',
  CLEAR_GARBAGE: 'clearGarbage',
};

/**
 * Checks progress of the current objective and returns formatted text / completion status
 */
export function evaluateObjective(objective, stats) {
  if (!objective) {
    return {
      isComplete: false,
      isFailed: false,
      current: 0,
      target: 0,
      progressText: '',
      title: '',
    };
  }

  let isComplete = false;
  let isFailed = false;
  let current = 0;
  let target = objective.target || 0;
  let progressText = '';
  let title = '';

  switch (objective.type) {
    case OBJECTIVE_TYPES.CLEAR_LINES:
      title = 'Clear Lines';
      current = stats.linesCleared;
      isComplete = current >= target;
      progressText = `${current} / ${target}`;
      break;

    case OBJECTIVE_TYPES.REACH_SCORE:
      title = 'Reach Score';
      current = stats.score;
      isComplete = current >= target;
      progressText = `${current.toLocaleString()} / ${target.toLocaleString()}`;
      break;

    case OBJECTIVE_TYPES.SURVIVE_PIECES:
      title = 'Survive Pieces';
      current = stats.piecesPlaced;
      isComplete = current >= target;
      progressText = `${current} / ${target}`;
      break;

    case OBJECTIVE_TYPES.COMBO_TARGET:
      title = 'Reach Combo';
      current = stats.maxCombo;
      isComplete = current >= target;
      progressText = `x${current} / x${target}`;
      break;

    case OBJECTIVE_TYPES.QUAD_CLEAR:
      title = 'Perform Quads';
      current = stats.quads;
      isComplete = current >= target;
      progressText = `${current} / ${target}`;
      break;

    case OBJECTIVE_TYPES.BACK_TO_BACK:
      title = 'Back-to-Back';
      current = stats.backToBackCount;
      isComplete = current >= target;
      progressText = `${current} / ${target}`;
      break;

    case OBJECTIVE_TYPES.TIME_ATTACK:
      title = 'Time Attack';
      current = stats.linesCleared;
      isComplete = current >= target;
      progressText = `${current} / ${target}`;
      if (stats.timeRemainingMs !== null && stats.timeRemainingMs <= 0 && !isComplete) {
        isFailed = true;
      }
      break;

    case OBJECTIVE_TYPES.LIMITED_PIECES:
      title = 'Limited Pieces';
      current = stats.linesCleared;
      isComplete = current >= target;
      const piecesLeft = Math.max(0, objective.maxPieces - stats.piecesPlaced);
      progressText = `${current}/${target} (${piecesLeft} left)`;
      if (stats.piecesPlaced >= objective.maxPieces && !isComplete) {
        isFailed = true;
      }
      break;

    case OBJECTIVE_TYPES.CLEAR_GARBAGE:
      title = 'Clear Garbage';
      current = stats.garbageCleared || 0;
      isComplete = current >= target;
      progressText = `${current} / ${target}`;
      break;

    default:
      title = 'Goal';
      progressText = `${stats.linesCleared}`;
  }

  return {
    isComplete,
    isFailed,
    current,
    target,
    progressText,
    title,
  };
}
