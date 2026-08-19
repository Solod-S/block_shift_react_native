/**
 * GameBoard Component
 * Main layout aligning HUD, HoldPanel, BoardRenderer, NextPanel, LevelCard, and Pause Button
 * (Exactly follows the layout in the reference screenshot)
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import Hud from './Hud.js';
import BoardRenderer from './BoardRenderer.js';
import HoldPanel from './HoldPanel.js';
import NextPanel from './NextPanel.js';
import LevelCard from './LevelCard.js';
import TouchControlsOverlay from './TouchControlsOverlay.js';
import { evaluateObjective } from '../game/objectives.js';

export default function GameBoard({
  gameState,
  settings = {},
  onMoveLeft,
  onMoveRight,
  onRotateClockwise,
  onRotateCounterClockwise,
  onSoftDropStart,
  onSoftDropEnd,
  onHardDrop,
  onHold,
  onPause,
}) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  if (!gameState) return null;

  const {
    board,
    activePiece,
    ghostPiece,
    holdPiece,
    canHold,
    nextQueue,
    score,
    lines,
    level,
    combo,
    isBackToBack,
    isDanger,
    clearingRows,
    stats,
    levelDef,
    mode,
  } = gameState;

  // Responsive cell size calculation
  const availableBoardWidth = screenWidth - 140;
  const availableBoardHeight = screenHeight - 160;
  const cellSize = Math.floor(
    Math.min(availableBoardWidth / 10, availableBoardHeight / 20, 24)
  );

  // Evaluate objective progress text if in Campaign mode
  let progressText = '';
  if (levelDef && levelDef.objective) {
    const evalRes = evaluateObjective(levelDef.objective, stats);
    progressText = evalRes.progressText;
  } else {
    progressText = `${lines} lines`;
  }

  const leftHanded = settings.leftHanded || false;
  const ghostEnabled = settings.ghostEnabled !== false;

  const leftCard = leftHanded ? (
    <View style={styles.sideColumn}>
      <NextPanel nextQueue={nextQueue} visibleCount={3} />
      <LevelCard level={level} progressText={progressText} />
    </View>
  ) : (
    <View style={styles.sideColumn}>
      <HoldPanel holdPiece={holdPiece} canHold={canHold} onHoldPress={onHold} />
    </View>
  );

  const rightCard = leftHanded ? (
    <View style={styles.sideColumn}>
      <HoldPanel holdPiece={holdPiece} canHold={canHold} onHoldPress={onHold} />
    </View>
  ) : (
    <View style={styles.sideColumn}>
      <NextPanel nextQueue={nextQueue} visibleCount={3} />
      <LevelCard level={level} progressText={progressText} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top HUD */}
      <Hud
        score={score}
        combo={combo}
        isBackToBack={isBackToBack}
        timeRemainingMs={stats.timeRemainingMs}
        modeName={mode !== 'CAMPAIGN' ? mode : ''}
      />

      {/* Main Play Area with gesture support */}
      <TouchControlsOverlay
        onMoveLeft={onMoveLeft}
        onMoveRight={onMoveRight}
        onRotateClockwise={onRotateClockwise}
        onRotateCounterClockwise={onRotateCounterClockwise}
        onSoftDropStart={onSoftDropStart}
        onSoftDropEnd={onSoftDropEnd}
        onHardDrop={onHardDrop}
        sensitivity={settings.controlSensitivity || 'normal'}
      >
        <View style={styles.playArea}>
          {/* Left Panel */}
          {leftCard}

          {/* Central Matrix Board */}
          <View style={styles.boardWrapper}>
            <BoardRenderer
              board={board}
              activePiece={activePiece}
              ghostPiece={ghostPiece}
              ghostEnabled={ghostEnabled}
              clearingRows={clearingRows}
              isDanger={isDanger}
              cellSize={cellSize}
            />
          </View>

          {/* Right Panel */}
          {rightCard}
        </View>
      </TouchControlsOverlay>

      {/* Bottom Controls / Pause Button (from reference image) */}
      <View style={styles.bottomBar}>
        {/* On-screen control helpers for accessibility */}
        <View style={styles.quickControls}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.quickBtn}
            onPress={onMoveLeft}
          >
            <Text style={styles.quickBtnText}>◀</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.quickBtn}
            onPress={onRotateClockwise}
          >
            <Text style={styles.quickBtnText}>↻</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.quickBtn}
            onPress={onMoveRight}
          >
            <Text style={styles.quickBtnText}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* Floating Pause Button (Bottom Right) */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.pausePill}
          onPress={onPause}
        >
          <Text style={styles.pauseIcon}>⏸️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  playArea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 8,
    gap: 8,
  },
  sideColumn: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    marginTop: 24,
  },
  boardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
    zIndex: 30,
  },
  quickControls: {
    flexDirection: 'row',
    gap: 8,
  },
  quickBtn: {
    backgroundColor: 'rgba(25, 14, 56, 0.65)',
    width: 44,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  quickBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  pausePill: {
    backgroundColor: '#FFFFFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  pauseIcon: {
    fontSize: 16,
  },
});
