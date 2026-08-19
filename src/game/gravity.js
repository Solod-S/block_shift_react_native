/**
 * Gravity timing and speed calculation
 */

import { MAX_DELTA_MS } from './constants.js';

/**
 * Returns gravity interval in milliseconds for a given level
 * Level 1: ~900ms -> Level 15: ~120ms -> Level 30: ~45ms
 */
export function getGravityInterval(level = 1, gravityMultiplier = 1, upgradeDampener = 0) {
  // Classic-like exponential decay formula
  const baseSpeed = Math.pow(0.8 - (level - 1) * 0.007, level - 1) * 1000;
  const clampedBase = Math.max(40, Math.min(1000, baseSpeed));

  let finalInterval = clampedBase / gravityMultiplier;

  // If upgrade dampener is active (e.g. -8% speed = +8% interval)
  if (upgradeDampener > 0) {
    finalInterval *= (1 + upgradeDampener);
  }

  return Math.max(35, finalInterval);
}

/**
 * Returns soft drop speed (approx 15-20x faster than normal gravity)
 */
export function getSoftDropInterval(normalInterval) {
  return Math.max(25, Math.min(normalInterval / 16, 50));
}

/**
 * Clamps delta time to prevent physics/gravity bursts during frame drops or unpausing
 */
export function clampDelta(deltaMs) {
  return Math.max(0, Math.min(deltaMs, MAX_DELTA_MS));
}
