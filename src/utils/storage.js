/**
 * Persistence layer using @react-native-async-storage/async-storage
 * Save Key: block-shift.save.v1
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const SAVE_KEY = 'block-shift.save.v1';

export const DEFAULT_SAVE_DATA = {
  version: 1,
  highScores: {
    campaign: 0,
    marathon: 0,
    sprint40Ms: null,
    timeAttack: 0,
  },
  unlockedLevel: 1,
  campaignComplete: false,
  levels: {
    1: {
      completed: false,
      stars: 0,
      bestScore: 0,
    },
  },
  settings: {
    musicEnabled: true,
    musicVolume: 0.6,
    sfxEnabled: true,
    sfxVolume: 0.8,
    hapticsEnabled: true,
    ghostEnabled: true,
    reducedEffects: false,
    leftHanded: false,
    controlSensitivity: 'normal', // 'low' | 'normal' | 'high'
  },
};

let cachedSaveData = null;

/**
 * Loads save data from AsyncStorage or returns default
 */
export async function loadSaveData() {
  if (cachedSaveData) return cachedSaveData;

  try {
    const raw = await AsyncStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      cachedSaveData = {
        ...DEFAULT_SAVE_DATA,
        ...parsed,
        highScores: { ...DEFAULT_SAVE_DATA.highScores, ...parsed.highScores },
        levels: { ...DEFAULT_SAVE_DATA.levels, ...parsed.levels },
        settings: { ...DEFAULT_SAVE_DATA.settings, ...parsed.settings },
      };
      return cachedSaveData;
    }
  } catch (err) {
    console.warn('Failed to load save data from storage, using defaults', err);
  }

  cachedSaveData = { ...DEFAULT_SAVE_DATA };
  return cachedSaveData;
}

/**
 * Saves full data state to storage
 */
export async function saveGameData(data) {
  try {
    cachedSaveData = { ...data };
    await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to persist save data', err);
  }
}

/**
 * Updates campaign level progress
 */
export async function recordLevelCompletion(levelId, stars, score) {
  const data = await loadSaveData();
  const levelNum = Number(levelId);

  const prev = data.levels[levelNum] || { completed: false, stars: 0, bestScore: 0 };
  data.levels[levelNum] = {
    completed: true,
    stars: Math.max(prev.stars, stars),
    bestScore: Math.max(prev.bestScore, score),
  };

  // Unlock next level
  if (levelNum >= data.unlockedLevel && levelNum < 30) {
    data.unlockedLevel = levelNum + 1;
  }

  if (levelNum === 30) {
    data.campaignComplete = true;
  }

  data.highScores.campaign = Math.max(data.highScores.campaign || 0, score);

  await saveGameData(data);
  return data;
}

/**
 * Records record for other modes
 */
export async function recordModeScore(mode, scoreOrTime) {
  const data = await loadSaveData();

  if (mode === 'MARATHON') {
    data.highScores.marathon = Math.max(data.highScores.marathon || 0, scoreOrTime);
  } else if (mode === 'SPRINT_40') {
    if (!data.highScores.sprint40Ms || scoreOrTime < data.highScores.sprint40Ms) {
      data.highScores.sprint40Ms = scoreOrTime;
    }
  } else if (mode === 'TIME_ATTACK') {
    data.highScores.timeAttack = Math.max(data.highScores.timeAttack || 0, scoreOrTime);
  }

  await saveGameData(data);
  return data;
}

/**
 * Updates settings
 */
export async function updateSettings(newSettings) {
  const data = await loadSaveData();
  data.settings = { ...data.settings, ...newSettings };
  await saveGameData(data);
  return data;
}

/**
 * Resets all user progress
 */
export async function resetAllProgress() {
  cachedSaveData = { ...DEFAULT_SAVE_DATA };
  try {
    await AsyncStorage.removeItem(SAVE_KEY);
  } catch (err) {
    console.warn('Failed to reset storage', err);
  }
  return cachedSaveData;
}
