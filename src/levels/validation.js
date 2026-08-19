/**
 * Validation logic for all 30 Campaign levels
 */

import { WORLD_1_LEVELS } from './world1.js';
import { WORLD_2_LEVELS } from './world2.js';
import { WORLD_3_LEVELS } from './world3.js';
import { OBJECTIVE_TYPES } from '../game/objectives.js';

export const ALL_LEVELS = [...WORLD_1_LEVELS, ...WORLD_2_LEVELS, ...WORLD_3_LEVELS];

export function validateAllLevels() {
  const errors = [];
  const validObjectiveTypes = Object.values(OBJECTIVE_TYPES);
  const seenIds = new Set();

  if (ALL_LEVELS.length !== 30) {
    errors.push(`Expected 30 levels, but found ${ALL_LEVELS.length}`);
  }

  ALL_LEVELS.forEach((level, index) => {
    const expectedId = index + 1;
    if (level.id !== expectedId) {
      errors.push(`Level at index ${index} has id ${level.id}, expected ${expectedId}`);
    }

    if (seenIds.has(level.id)) {
      errors.push(`Duplicate level id ${level.id}`);
    }
    seenIds.add(level.id);

    if (![1, 2, 3].includes(level.world)) {
      errors.push(`Level ${level.id} has invalid world: ${level.world}`);
    }

    if (!level.name || typeof level.name !== 'string') {
      errors.push(`Level ${level.id} missing name`);
    }

    if (!level.gravityMultiplier || level.gravityMultiplier <= 0) {
      errors.push(`Level ${level.id} invalid gravityMultiplier: ${level.gravityMultiplier}`);
    }

    if (!level.objective || !validObjectiveTypes.includes(level.objective.type)) {
      errors.push(`Level ${level.id} has unknown objective type: ${level.objective?.type}`);
    }

    if (!level.objective.target || level.objective.target <= 0) {
      errors.push(`Level ${level.id} objective target must be positive, got: ${level.objective?.target}`);
    }

    if (level.startingGarbage < 0 || level.startingGarbage > 15) {
      errors.push(`Level ${level.id} invalid startingGarbage: ${level.startingGarbage}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function getLevelById(id) {
  return ALL_LEVELS.find((l) => l.id === Number(id)) || null;
}
