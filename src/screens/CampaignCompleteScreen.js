/**
 * CampaignCompleteScreen Component
 * Grand Victory Screen after beating Level 30
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundScene from '../components/BackgroundScene.js';

export default function CampaignCompleteScreen({ saveData = {}, onReturnMenu }) {
  const levels = saveData?.levels || {};
  let totalStars = 0;
  let totalScore = 0;

  Object.values(levels).forEach((lvl) => {
    totalStars += lvl.stars || 0;
    totalScore += lvl.bestScore || 0;
  });

  return (
    <View style={styles.container}>
      <BackgroundScene world={3} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
          <View style={styles.badgeWrapper}>
            <Text style={styles.victoryBadge}>★ CAMPAIGN COMPLETE ★</Text>
          </View>

          <Text style={styles.title}>CORE STABILIZED</Text>
          <Text style={styles.subtitle}>
            You have mastered all 30 levels across Neon Stack, Shift Circuit, and Gravity Core!
          </Text>

          {/* Grand Trophy Card */}
          <View style={styles.trophyCard}>
            <Text style={styles.trophyIcon}>🏆</Text>
            <Text style={styles.trophyTitle}>MASTER OF THE SHIFT</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>TOTAL STARS</Text>
                <Text style={styles.statVal}>{totalStars} / 90 ⭐</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>CAMPAIGN BEST</Text>
                <Text style={styles.statVal}>{totalScore.toLocaleString()} pts</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={onReturnMenu}>
            <Text style={styles.btnText}>🏠 RETURN TO MAIN MENU</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#240B36',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    zIndex: 10,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  badgeWrapper: {
    backgroundColor: '#FFD32A',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  victoryBadge: {
    color: '#240B36',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    color: '#D1C8EC',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  trophyCard: {
    width: '100%',
    backgroundColor: 'rgba(35, 15, 55, 0.9)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8E1D4F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: 32,
  },
  trophyIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  trophyTitle: {
    color: '#FFD32A',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  statsGrid: {
    width: '100%',
    gap: 12,
  },
  statBox: {
    backgroundColor: '#180726',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    color: '#A29BFE',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statVal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  btn: {
    backgroundColor: '#2ED573',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#2ED573',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  btnText: {
    color: '#0A3B1B',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
