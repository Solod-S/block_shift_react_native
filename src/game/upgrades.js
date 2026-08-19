/**
 * Campaign Run Upgrades definition and random card pool selection
 */

export const UPGRADES = {
  GRAVITY_DAMPENER: {
    id: 'GRAVITY_DAMPENER',
    name: 'Gravity Dampener',
    icon: '⚡',
    description: '-6% gravity speed for smoother control',
    maxStacks: 3,
    effect: (stacks) => ({ gravityReduction: 0.06 * stacks }),
  },
  LOCK_STABILIZER: {
    id: 'LOCK_STABILIZER',
    name: 'Lock Stabilizer',
    icon: '⏱️',
    description: '+80ms lock delay on piece placement',
    maxStacks: 3,
    effect: (stacks) => ({ extraLockDelayMs: 80 * stacks }),
  },
  PREVIEW_MATRIX: {
    id: 'PREVIEW_MATRIX',
    name: 'Preview Matrix',
    icon: '👁️',
    description: '+1 extra visible NEXT piece queue',
    maxStacks: 2,
    effect: (stacks) => ({ extraPreviewCount: 1 * stacks }),
  },
  SHIFT_MULTIPLIER: {
    id: 'SHIFT_MULTIPLIER',
    name: 'Shift Multiplier',
    icon: '✨',
    description: '+12% bonus points on all line clears',
    maxStacks: 3,
    effect: (stacks) => ({ scoreMultiplier: 1 + 0.12 * stacks }),
  },
  COMBO_DRIVER: {
    id: 'COMBO_DRIVER',
    name: 'Combo Driver',
    icon: '🔥',
    description: '+18% bonus points on combo chains',
    maxStacks: 3,
    effect: (stacks) => ({ comboBonusMultiplier: 1 + 0.18 * stacks }),
  },
  HOLD_BUFFER: {
    id: 'HOLD_BUFFER',
    name: 'Hold Buffer',
    icon: '🔄',
    description: 'Allows 1 free extra Hold per level without lock',
    maxStacks: 1,
    effect: (stacks) => ({ extraHoldRefreshes: 1 * stacks }),
  },
  GARBAGE_SCRUBBER: {
    id: 'GARBAGE_SCRUBBER',
    name: 'Garbage Scrubber',
    icon: '🧹',
    description: 'Quads & B2B clears instantly erase 1 bottom garbage row',
    maxStacks: 2,
    effect: (stacks) => ({ garbageScrubbing: true }),
  },
  FOCUS_WINDOW: {
    id: 'FOCUS_WINDOW',
    name: 'Focus Window',
    icon: '🎯',
    description: 'Combo x3+ slows gravity by 30% for 3 seconds',
    maxStacks: 1,
    effect: (stacks) => ({ focusWindowActive: true }),
  },
  RECOVERY_PROTOCOL: {
    id: 'RECOVERY_PROTOCOL',
    name: 'Recovery Protocol',
    icon: '🛡️',
    description: 'One-time emergency shield that clears top 4 rows on top-out',
    maxStacks: 1,
    effect: (stacks) => ({ topOutShields: 1 * stacks }),
  },
};

export const UPGRADE_MILESTONES = [3, 6, 9, 13, 16, 19, 23, 26, 29];

/**
 * Selects 3 random available upgrade cards considering max stacks
 */
export function getAvailableUpgradeChoices(currentRunUpgrades = {}) {
  const available = Object.values(UPGRADES).filter((upgrade) => {
    const currentStacks = currentRunUpgrades[upgrade.id] || 0;
    return currentStacks < upgrade.maxStacks;
  });

  // Shuffle and pick 3
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(3, shuffled.length));
}
