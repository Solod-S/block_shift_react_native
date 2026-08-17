/**
 * Game constants for Block Shift
 */

export const BOARD_COLS = 10;
export const BOARD_VISIBLE_ROWS = 20;
export const BOARD_HIDDEN_ROWS = 4;
export const BOARD_TOTAL_ROWS = BOARD_VISIBLE_ROWS + BOARD_HIDDEN_ROWS; // 24 rows

export const SPAWN_ROW = 2; // Spawn in hidden rows
export const SPAWN_COL = 3;

export const DEFAULT_LOCK_DELAY_MS = 500;
export const MAX_LOCK_RESETS = 15;
export const MAX_DELTA_MS = 100; // Delta clamp to prevent gravity burst after pause/lag

export const CELL_DRAG_THRESHOLD = 26; // Pixels per grid step
export const TAP_MAX_DURATION_MS = 250;
export const TAP_MAX_DISTANCE = 15;
export const SWIPE_DOWN_VELOCITY_THRESHOLD = 0.6;
export const SWIPE_DOWN_DISTANCE_THRESHOLD = 50;

export const GAME_STATES = {
  BOOT: 'BOOT',
  MENU: 'MENU',
  MODE_SELECT: 'MODE_SELECT',
  LEVEL_SELECT: 'LEVEL_SELECT',
  COUNTDOWN: 'COUNTDOWN',
  RUNNING: 'RUNNING',
  LINE_CLEAR: 'LINE_CLEAR',
  LEVEL_CLEAR: 'LEVEL_CLEAR',
  UPGRADE_SELECT: 'UPGRADE_SELECT',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
  CAMPAIGN_COMPLETE: 'CAMPAIGN_COMPLETE',
};

export const GAME_MODES = {
  CAMPAIGN: 'CAMPAIGN',
  MARATHON: 'MARATHON',
  SPRINT_40: 'SPRINT_40',
  TIME_ATTACK: 'TIME_ATTACK',
  ZEN: 'ZEN',
};

export const PIECE_TYPES = {
  I: 'I',
  O: 'O',
  T: 'T',
  S: 'S',
  Z: 'Z',
  J: 'J',
  L: 'L',
};

// Rich vibrant pastel & cyber-arcade color palette
export const PIECE_COLORS = {
  I: '#00D2D3', // Bright cyan / teal
  O: '#FBC531', // Warm gold / yellow
  T: '#9B59B6', // Vibrant purple
  S: '#2ECC71', // Vivid green
  Z: '#FF5252', // Soft coral red
  J: '#2E86DE', // Royal blue
  L: '#E67E22', // Radiant orange
  GARBAGE: '#718093', // Steel grey for garbage
};

export const PIECE_ACCENT_COLORS = {
  I: '#48DBFB',
  O: '#FED330',
  T: '#BE2EDD',
  S: '#26DE81',
  Z: '#FC5C65',
  J: '#45AAF2',
  L: '#FA8231',
  GARBAGE: '#A5B1C2',
};

export const SCORE_VALUES = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  QUAD: 800,
  SPIN_SINGLE: 200,
  SPIN_DOUBLE: 400,
  SPIN_TRIPLE: 700,
  PERFECT_CLEAR: 1500,
  SOFT_DROP: 1, // per dropped cell
  HARD_DROP: 2, // per dropped cell
};

export const DANGER_ROW_THRESHOLD = 14; // Visible rows from bottom before danger triggers (row index <= 10 in total 24)
