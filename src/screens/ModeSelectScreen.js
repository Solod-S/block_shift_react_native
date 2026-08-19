/**
 * ModeSelectScreen Component
 * Allows user to pick between Marathon, Sprint 40, Time Attack, and Zen modes
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundScene from '../components/BackgroundScene.js';
import { MODE_DEFINITIONS } from '../game/modes.js';
import { GAME_MODES } from '../game/constants.js';

export default function ModeSelectScreen({ saveData = {}, onSelectMode, onBack }) {
  const highScores = saveData?.highScores || {};

  const formatSprintTime = (ms) => {
    if (!ms) return 'None';
    const totalSecs = (ms / 1000).toFixed(2);
    return `${totalSecs}s`;
  };

  const getModeRecord = (modeId) => {
    switch (modeId) {
      case GAME_MODES.MARATHON:
        return highScores.marathon ? `${highScores.marathon.toLocaleString()} pts` : 'No record';
      case GAME_MODES.SPRINT_40:
        return highScores.sprint40Ms ? formatSprintTime(highScores.sprint40Ms) : 'No record';
      case GAME_MODES.TIME_ATTACK:
        return highScores.timeAttack ? `${highScores.timeAttack.toLocaleString()} pts` : 'No record';
      case GAME_MODES.ZEN:
        return 'Endless focus';
      default:
        return '';
    }
  };

  const modesList = [
    MODE_DEFINITIONS[GAME_MODES.MARATHON],
    MODE_DEFINITIONS[GAME_MODES.SPRINT_40],
    MODE_DEFINITIONS[GAME_MODES.TIME_ATTACK],
    MODE_DEFINITIONS[GAME_MODES.ZEN],
  ];

  return (
    <View style={styles.container}>
      <BackgroundScene world={2} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.7} style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>◀ BACK</Text>
          </TouchableOpacity>
          <Text style={styles.title}>GAME MODES</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Modes List */}
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
          {modesList.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              activeOpacity={0.8}
              style={styles.card}
              onPress={() => onSelectMode(mode.id)}
            >
              <View style={styles.cardTop}>
                <View style={styles.cardIconWrapper}>
                  <Text style={styles.cardIcon}>{mode.icon}</Text>
                </View>
                <View style={styles.cardTitleArea}>
                  <Text style={styles.cardTitle}>{mode.title}</Text>
                  <Text style={styles.cardSubtitle}>{mode.subtitle}</Text>
                </View>
              </View>

              <Text style={styles.cardDesc}>{mode.description}</Text>

              <View style={styles.recordBar}>
                <Text style={styles.recordLabel}>RECORD:</Text>
                <Text style={styles.recordValue}>{getModeRecord(mode.id)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A2540',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 8,
  },
  backBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    gap: 14,
  },
  card: {
    backgroundColor: 'rgba(15, 35, 60, 0.85)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#1E6F73',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIconWrapper: {
    backgroundColor: '#0E4957',
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardIcon: {
    fontSize: 22,
  },
  cardTitleArea: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: '#78FFD6',
    fontSize: 12,
    fontWeight: '600',
  },
  cardDesc: {
    color: '#D1E6E7',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  recordBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A2035',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  recordLabel: {
    color: '#78FFD6',
    fontSize: 11,
    fontWeight: '800',
    marginRight: 6,
  },
  recordValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
