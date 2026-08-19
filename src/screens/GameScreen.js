/**
 * GameScreen Component
 * Full gameplay loop orchestrator for Block Shift
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundScene from '../components/BackgroundScene.js';
import GameBoard from '../components/GameBoard.js';
import PauseOverlay from '../components/PauseOverlay.js';
import LevelClearOverlay from '../components/LevelClearOverlay.js';
import GameOverOverlay from '../components/GameOverOverlay.js';
import UpgradeModal from '../components/UpgradeModal.js';
import SettingsModal from '../components/SettingsModal.js';

import { BlockShiftEngine } from '../game/engine.js';
import { GAME_STATES, GAME_MODES } from '../game/constants.js';
import { getLevelById } from '../levels/index.js';
import { getAvailableUpgradeChoices, UPGRADE_MILESTONES } from '../game/upgrades.js';
import {
  loadSaveData,
  recordLevelCompletion,
  recordModeScore,
  updateSettings,
  resetAllProgress,
} from '../utils/storage.js';
import { musicManager, sfxManager } from '../utils/audio.js';
import { hapticsManager } from '../utils/haptics.js';

export default function GameScreen({
  mode = GAME_MODES.CAMPAIGN,
  initialLevelId = 1,
  onReturnMenu,
  onCampaignComplete,
}) {
  const [currentLevelId, setCurrentLevelId] = useState(initialLevelId);
  const [renderState, setRenderState] = useState(null);
  const [saveData, setSaveData] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeChoices, setUpgradeChoices] = useState([]);
  const [runUpgrades, setRunUpgrades] = useState({});

  const engineRef = useRef(null);
  const levelDef = mode === GAME_MODES.CAMPAIGN ? getLevelById(currentLevelId) : null;
  const currentWorld = levelDef ? levelDef.world : 1;

  // Initialize save data and audio/haptic settings
  useEffect(() => {
    loadSaveData().then((data) => {
      setSaveData(data);
      if (data?.settings) {
        musicManager.setSettings(data.settings.musicEnabled, data.settings.musicVolume);
        sfxManager.setSettings(data.settings.sfxEnabled, data.settings.sfxVolume);
        hapticsManager.setEnabled(data.settings.hapticsEnabled);
      }
    });
  }, []);

  // Handle AppState changes (Auto-pause on background)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState.match(/inactive|background/)) {
        if (engineRef.current) {
          engineRef.current.pause();
        }
        musicManager.pause();
      } else if (nextAppState === 'active') {
        musicManager.resume();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Initialize or restart engine
  const initEngine = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.destroy();
      engineRef.current = null;
    }

    const currentLevel = mode === GAME_MODES.CAMPAIGN ? getLevelById(currentLevelId) : null;

    const newEngine = new BlockShiftEngine({
      mode,
      levelDef: currentLevel,
      runUpgrades,
      onStateChange: (newState) => {
        setRenderState(newState);
      },
      onEvent: (eventName, payload) => {
        // SFX and Haptics triggers
        sfxManager.play(eventName, payload);

        if (eventName === 'rotate') {
          hapticsManager.onRotate();
        } else if (eventName === 'hold') {
          hapticsManager.onHold();
        } else if (eventName === 'hardDrop') {
          hapticsManager.onHardDrop();
        } else if (eventName === 'lineClear') {
          hapticsManager.onLineClear(payload.linesCount);
        } else if (eventName === 'gameOver') {
          hapticsManager.onGameOver();
          // Save game over score
          if (mode === GAME_MODES.CAMPAIGN && currentLevel) {
            recordLevelCompletion(currentLevel.id, 0, newEngine.score).then(setSaveData);
          } else {
            recordModeScore(mode, newEngine.score).then(setSaveData);
          }
        } else if (eventName === 'levelClear') {
          hapticsManager.onLevelClear();
          // Save level clear progress
          if (mode === GAME_MODES.CAMPAIGN && currentLevel) {
            recordLevelCompletion(currentLevel.id, payload.stars, newEngine.score).then(setSaveData);
          } else if (mode === GAME_MODES.SPRINT_40) {
            recordModeScore(mode, newEngine.timeElapsedMs).then(setSaveData);
          } else {
            recordModeScore(mode, newEngine.score).then(setSaveData);
          }
        }
      },
    });

    engineRef.current = newEngine;
    setRenderState(newEngine.getRenderState());
    newEngine.start();

    // Start appropriate music track
    if (mode === GAME_MODES.ZEN) {
      musicManager.playTrack('zen');
    } else if (mode === GAME_MODES.MARATHON) {
      musicManager.playTrack('marathon');
    } else {
      musicManager.playTrack(`world${currentWorld}`);
    }
  }, [mode, currentLevelId, runUpgrades, currentWorld]);

  // Start engine when level or mode changes
  useEffect(() => {
    initEngine();
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
      musicManager.stop();
    };
  }, [initEngine]);

  // Controller callbacks
  const handleMoveLeft = () => engineRef.current?.moveLeft();
  const handleMoveRight = () => engineRef.current?.moveRight();
  const handleRotateCW = () => engineRef.current?.rotateClockwise();
  const handleRotateCCW = () => engineRef.current?.rotateCounterClockwise();
  const handleSoftDropStart = () => engineRef.current?.startSoftDrop();
  const handleSoftDropEnd = () => engineRef.current?.endSoftDrop();
  const handleHardDrop = () => engineRef.current?.performHardDrop();
  const handleHold = () => engineRef.current?.hold();
  const handlePause = () => engineRef.current?.pause();
  const handleResume = () => engineRef.current?.resume();
  const handleRestart = () => initEngine();

  // Navigation callbacks
  const handleNextLevel = () => {
    if (currentLevelId >= 30) {
      onCampaignComplete && onCampaignComplete();
      return;
    }

    const nextId = currentLevelId + 1;
    setCurrentLevelId(nextId);

    // Check if milestone upgrade should appear
    if (UPGRADE_MILESTONES.includes(currentLevelId)) {
      const choices = getAvailableUpgradeChoices(runUpgrades);
      if (choices.length > 0) {
        setUpgradeChoices(choices);
        setShowUpgradeModal(true);
      }
    }
  };

  const handleSelectUpgrade = (upgradeId) => {
    const currentStacks = runUpgrades[upgradeId] || 0;
    setRunUpgrades((prev) => ({
      ...prev,
      [upgradeId]: currentStacks + 1,
    }));
    setShowUpgradeModal(false);
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
      initEngine();
    });
  };

  if (!renderState) return null;

  const isPaused = renderState.state === GAME_STATES.PAUSED;
  const isLevelClear = renderState.state === GAME_STATES.LEVEL_CLEAR;
  const isGameOver = renderState.state === GAME_STATES.GAME_OVER;
  const isMilestone = UPGRADE_MILESTONES.includes(currentLevelId);
  const highScore =
    mode === GAME_MODES.CAMPAIGN
      ? saveData?.highScores?.campaign || 0
      : mode === GAME_MODES.MARATHON
      ? saveData?.highScores?.marathon || 0
      : saveData?.highScores?.timeAttack || 0;

  return (
    <View style={styles.container}>
      <BackgroundScene world={currentWorld} isDanger={renderState.isDanger} />

      <SafeAreaView style={styles.safeArea}>
        <GameBoard
          gameState={renderState}
          settings={saveData?.settings || {}}
          onMoveLeft={handleMoveLeft}
          onMoveRight={handleMoveRight}
          onRotateClockwise={handleRotateCW}
          onRotateCounterClockwise={handleRotateCCW}
          onSoftDropStart={handleSoftDropStart}
          onSoftDropEnd={handleSoftDropEnd}
          onHardDrop={handleHardDrop}
          onHold={handleHold}
          onPause={handlePause}
        />
      </SafeAreaView>

      {/* Pause Overlay */}
      {isPaused && (
        <PauseOverlay
          onResume={handleResume}
          onRestart={handleRestart}
          onSettings={() => setShowSettings(true)}
          onMenu={onReturnMenu}
        />
      )}

      {/* Level Clear Overlay */}
      {isLevelClear && (
        <LevelClearOverlay
          level={currentLevelId}
          stars={renderState.levelDef?.stars || 3}
          score={renderState.score}
          stats={renderState.stats}
          isLastLevel={currentLevelId === 30}
          hasNextLevel={currentLevelId < 30}
          hasUpgradePending={isMilestone && getAvailableUpgradeChoices(runUpgrades).length > 0}
          onNextLevel={handleNextLevel}
          onOpenUpgrades={() => {
            setUpgradeChoices(getAvailableUpgradeChoices(runUpgrades));
            setShowUpgradeModal(true);
          }}
          onReplay={handleRestart}
          onMenu={onReturnMenu}
        />
      )}

      {/* Game Over Overlay */}
      {isGameOver && (
        <GameOverOverlay
          score={renderState.score}
          highScore={highScore}
          stats={renderState.stats}
          onRetry={handleRestart}
          onMenu={onReturnMenu}
        />
      )}

      {/* Milestone Upgrades Modal */}
      {showUpgradeModal && (
        <UpgradeModal
          choices={upgradeChoices}
          currentStacks={runUpgrades}
          onSelectUpgrade={handleSelectUpgrade}
        />
      )}

      {/* Settings Modal */}
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
  container: {
    flex: 1,
    backgroundColor: '#1E123D',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    zIndex: 10,
  },
});
