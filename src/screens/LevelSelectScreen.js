/**
 * LevelSelectScreen Component
 * 30 Campaign levels map with World tabs, star indicators, and pulse trial badges
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundScene from '../components/BackgroundScene.js';
import { WORLD_1_LEVELS, WORLD_2_LEVELS, WORLD_3_LEVELS } from '../levels/index.js';

export default function LevelSelectScreen({ saveData = {}, onSelectLevel, onBack }) {
  const [selectedWorld, setSelectedWorld] = useState(1);
  const unlockedLevel = saveData?.unlockedLevel || 1;
  const levelProgress = saveData?.levels || {};

  const worlds = [
    { id: 1, name: 'WORLD 1', title: 'Neon Stack', levels: WORLD_1_LEVELS },
    { id: 2, name: 'WORLD 2', title: 'Shift Circuit', levels: WORLD_2_LEVELS },
    { id: 3, name: 'WORLD 3', title: 'Gravity Core', levels: WORLD_3_LEVELS },
  ];

  const currentWorld = worlds.find((w) => w.id === selectedWorld) || worlds[0];

  return (
    <View style={styles.container}>
      <BackgroundScene world={selectedWorld} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.7} style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>◀ BACK</Text>
          </TouchableOpacity>
          <Text style={styles.title}>CAMPAIGN MAP</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* World Tabs */}
        <View style={styles.worldTabs}>
          {worlds.map((world) => {
            const isActive = world.id === selectedWorld;
            const minLevelInWorld = (world.id - 1) * 10 + 1;
            const isWorldUnlocked = unlockedLevel >= minLevelInWorld;

            return (
              <TouchableOpacity
                key={world.id}
                activeOpacity={0.8}
                style={[styles.worldTab, isActive && styles.worldTabActive]}
                onPress={() => setSelectedWorld(world.id)}
              >
                <Text style={[styles.worldTabName, isActive && styles.worldTabNameActive]}>
                  {world.name}
                </Text>
                <Text style={[styles.worldTabTitle, isActive && styles.worldTabTitleActive]}>
                  {world.title}
                </Text>
                {!isWorldUnlocked && <Text style={styles.lockIcon}>🔒</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Levels Grid */}
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
          <View style={styles.grid}>
            {currentWorld.levels.map((level) => {
              const isUnlocked = level.id <= unlockedLevel;
              const progress = levelProgress[level.id] || {};
              const stars = progress.stars || 0;

              return (
                <TouchableOpacity
                  key={level.id}
                  activeOpacity={0.8}
                  disabled={!isUnlocked}
                  style={[
                    styles.levelTile,
                    !isUnlocked && styles.levelTileLocked,
                    level.isPulseTrial && styles.levelTilePulse,
                  ]}
                  onPress={() => onSelectLevel(level.id)}
                >
                  {level.isPulseTrial && (
                    <View style={styles.pulseBadge}>
                      <Text style={styles.pulseBadgeText}>TRIAL</Text>
                    </View>
                  )}

                  <Text style={[styles.levelNumber, !isUnlocked && styles.textLocked]}>
                    {level.id}
                  </Text>
                  <Text style={[styles.levelName, !isUnlocked && styles.textLocked]} numberOfLines={1}>
                    {level.name}
                  </Text>

                  {/* Stars / Lock */}
                  {isUnlocked ? (
                    <View style={styles.starsRow}>
                      <Text style={[styles.star, stars >= 1 ? styles.starLit : styles.starDim]}>★</Text>
                      <Text style={[styles.star, stars >= 2 ? styles.starLit : styles.starDim]}>★</Text>
                      <Text style={[styles.star, stars >= 3 ? styles.starLit : styles.starDim]}>★</Text>
                    </View>
                  ) : (
                    <Text style={styles.tileLockIcon}>🔒</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 6,
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
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  worldTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(25, 14, 56, 0.8)',
    borderRadius: 16,
    padding: 4,
    gap: 4,
    marginBottom: 16,
  },
  worldTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
  },
  worldTabActive: {
    backgroundColor: '#3E2568',
  },
  worldTabName: {
    color: '#A29BFE',
    fontSize: 10,
    fontWeight: '800',
  },
  worldTabNameActive: {
    color: '#00D2D3',
  },
  worldTabTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  worldTabTitleActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  lockIcon: {
    fontSize: 10,
    marginTop: 2,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  levelTile: {
    width: '47%',
    backgroundColor: 'rgba(30, 18, 61, 0.85)',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#4A2E80',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  levelTileLocked: {
    backgroundColor: 'rgba(20, 12, 40, 0.6)',
    borderColor: '#2D1B50',
    opacity: 0.65,
  },
  levelTilePulse: {
    borderColor: '#FF5252',
    backgroundColor: 'rgba(50, 15, 45, 0.85)',
  },
  pulseBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FF5252',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  pulseBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  levelNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 4,
  },
  levelName: {
    color: '#D1C8EC',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 8,
  },
  textLocked: {
    color: '#6E638E',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  star: {
    fontSize: 16,
  },
  starLit: {
    color: '#FFD32A',
  },
  starDim: {
    color: '#3B2B5C',
  },
  tileLockIcon: {
    fontSize: 16,
  },
});
