/**
 * Block Shift Main Screen Entry Point
 * Manages screen transitions between Menu, Mode Select, Level Select, Game, and Victory.
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MenuScreen from '../screens/MenuScreen.js';
import ModeSelectScreen from '../screens/ModeSelectScreen.js';
import LevelSelectScreen from '../screens/LevelSelectScreen.js';
import GameScreen from '../screens/GameScreen.js';
import CampaignCompleteScreen from '../screens/CampaignCompleteScreen.js';
import SettingsModal from '../components/SettingsModal.js';
import { GAME_MODES } from '../game/constants.js';
import {
  loadSaveData,
  updateSettings,
  resetAllProgress,
  DEFAULT_SAVE_DATA,
} from '../utils/storage.js';
import { musicManager, sfxManager } from '../utils/audio.js';
import { hapticsManager } from '../utils/haptics.js';

export default function AppIndex() {
  const [currentScreen, setCurrentScreen] = useState('MENU'); // 'MENU' | 'MODES' | 'LEVELS' | 'GAME' | 'VICTORY'
  const [activeMode, setActiveMode] = useState(GAME_MODES.CAMPAIGN);
  const [selectedLevelId, setSelectedLevelId] = useState(1);
  const [saveData, setSaveData] = useState(DEFAULT_SAVE_DATA);
  const [showSettings, setShowSettings] = useState(false);

  // Load persistence
  useEffect(() => {
    loadSaveData().then((data) => {
      setSaveData(data);
      if (data?.settings) {
        musicManager.setSettings(data.settings.musicEnabled, data.settings.musicVolume);
        sfxManager.setSettings(data.settings.sfxEnabled, data.settings.sfxVolume);
        hapticsManager.setEnabled(data.settings.hapticsEnabled);
      }
      musicManager.playTrack('menu');
    });
  }, []);

  const handleStartCampaign = () => {
    const startLvl = saveData?.unlockedLevel || 1;
    setActiveMode(GAME_MODES.CAMPAIGN);
    setSelectedLevelId(startLvl);
    setCurrentScreen('GAME');
  };

  const handleSelectMode = (modeId) => {
    setActiveMode(modeId);
    setSelectedLevelId(1);
    setCurrentScreen('GAME');
  };

  const handleSelectLevel = (levelId) => {
    setActiveMode(GAME_MODES.CAMPAIGN);
    setSelectedLevelId(levelId);
    setCurrentScreen('GAME');
  };

  const handleReturnMenu = () => {
    loadSaveData().then(setSaveData);
    setCurrentScreen('MENU');
    musicManager.playTrack('menu');
  };

  const handleCampaignComplete = () => {
    loadSaveData().then(setSaveData);
    setCurrentScreen('VICTORY');
  };

  const handleUpdateSettings = (newSettings) => {
    updateSettings(newSettings).then((updated) => {
      setSaveData(updated);
      musicManager.setSettings(updated.settings.musicEnabled, updated.settings.musicVolume);
      sfxManager.setSettings(updated.settings.sfxEnabled, updated.settings.sfxVolume);
      hapticsManager.setEnabled(updated.settings.hapticsEnabled);
    });
  };

  const handleResetProgress = () => {
    resetAllProgress().then((fresh) => {
      setSaveData(fresh);
    });
  };

  return (
    <View style={styles.rootContainer}>
      {currentScreen === 'MENU' && (
        <MenuScreen
          saveData={saveData}
          onStartCampaign={handleStartCampaign}
          onOpenModes={() => setCurrentScreen('MODES')}
          onOpenLevels={() => setCurrentScreen('LEVELS')}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {currentScreen === 'MODES' && (
        <ModeSelectScreen
          saveData={saveData}
          onSelectMode={handleSelectMode}
          onBack={handleReturnMenu}
        />
      )}

      {currentScreen === 'LEVELS' && (
        <LevelSelectScreen
          saveData={saveData}
          onSelectLevel={handleSelectLevel}
          onBack={handleReturnMenu}
        />
      )}

      {currentScreen === 'GAME' && (
        <GameScreen
          mode={activeMode}
          initialLevelId={selectedLevelId}
          onReturnMenu={handleReturnMenu}
          onCampaignComplete={handleCampaignComplete}
        />
      )}

      {currentScreen === 'VICTORY' && (
        <CampaignCompleteScreen
          saveData={saveData}
          onReturnMenu={handleReturnMenu}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={saveData?.settings || {}}
          onUpdateSettings={handleUpdateSettings}
          onResetProgress={handleResetProgress}
          onClose={() => setShowSettings(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#1E123D',
  },
});
