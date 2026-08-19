/**
 * Game Modes configuration and mode specific rules
 */

import { GAME_MODES } from './constants.js';

export const MODE_DEFINITIONS = {
  [GAME_MODES.CAMPAIGN]: {
    id: GAME_MODES.CAMPAIGN,
    title: 'Campaign',
    subtitle: '30 Levels Across 3 Worlds',
    description: 'Master objectives, unlock upgrades and conquer the pulse trials.',
    icon: '🪐',
    color: '#8C7AE6',
  },
  [GAME_MODES.MARATHON]: {
    id: GAME_MODES.MARATHON,
    title: 'Marathon',
    subtitle: 'Endless Classic',
    description: 'Survive as long as you can while the speed increases every 10 lines.',
    icon: '🏃',
    color: '#2ED573',
  },
  [GAME_MODES.SPRINT_40]: {
    id: GAME_MODES.SPRINT_40,
    title: 'Sprint 40',
    subtitle: 'Speed Challenge',
    description: 'Clear 40 lines in record time. Pure speed and precision.',
    icon: '⚡',
    color: '#FFA502',
  },
  [GAME_MODES.TIME_ATTACK]: {
    id: GAME_MODES.TIME_ATTACK,
    title: 'Time Attack',
    subtitle: '2-Minute Rush',
    description: 'Rack up the highest possible score in 120 seconds.',
    icon: '⏱️',
    color: '#FF4757',
  },
  [GAME_MODES.ZEN]: {
    id: GAME_MODES.ZEN,
    title: 'Zen',
    subtitle: 'Relaxed Endless',
    description: 'Slow pace, no game over pressure, calm music and pure focus.',
    icon: '🌸',
    color: '#1DD1A1',
  },
};
