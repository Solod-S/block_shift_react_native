/**
 * LevelClearOverlay Component
 * Victory screen for campaign and sprint/timed levels
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function LevelClearOverlay({
  level = 1,
  stars = 3,
  score = 0,
  stats = {},
  isLastLevel = false,
  hasNextLevel = true,
  hasUpgradePending = false,
  onNextLevel,
  onOpenUpgrades,
  onReplay,
  onMenu,
}) {
  return (
    <View style={styles.overlay}>
      <View style={styles.modalCard}>
        <Text style={styles.headerBadge}>LEVEL {level} COMPLETE</Text>
        <Text style={styles.title}>EXCELLENT!</Text>

        {/* 1-3 Stars Display */}
        <View style={styles.starsRow}>
          <Text style={[styles.star, stars >= 1 ? styles.starLit : styles.starDim]}>★</Text>
          <Text style={[styles.star, stars >= 2 ? styles.starLit : styles.starDim]}>★</Text>
          <Text style={[styles.star, stars >= 3 ? styles.starLit : styles.starDim]}>★</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Final Score</Text>
            <Text style={styles.statValue}>{score.toLocaleString()}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Lines Cleared</Text>
            <Text style={styles.statValue}>{stats.linesCleared || 0}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Max Combo</Text>
            <Text style={styles.statValue}>x{stats.maxCombo || 0}</Text>
          </View>
          {stats.quads > 0 && (
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Quads</Text>
              <Text style={styles.statValue}>{stats.quads}</Text>
            </View>
          )}
        </View>

        {/* Buttons */}
        <View style={styles.buttonList}>
          {hasUpgradePending ? (
            <TouchableOpacity activeOpacity={0.8} style={[styles.btn, styles.upgradeBtn]} onPress={onOpenUpgrades}>
              <Text style={styles.upgradeBtnText}>✨ CHOOSE UPGRADE</Text>
            </TouchableOpacity>
          ) : hasNextLevel ? (
            <TouchableOpacity activeOpacity={0.8} style={[styles.btn, styles.primaryBtn]} onPress={onNextLevel}>
              <Text style={styles.primaryBtnText}>NEXT LEVEL ➔</Text>
            </TouchableOpacity>
          ) : isLastLevel ? (
            <TouchableOpacity activeOpacity={0.8} style={[styles.btn, styles.primaryBtn]} onPress={onNextLevel}>
              <Text style={styles.primaryBtnText}>🏆 FINISH CAMPAIGN</Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.secondaryRow}>
            <TouchableOpacity activeOpacity={0.8} style={[styles.btn, styles.halfBtn]} onPress={onReplay}>
              <Text style={styles.btnText}>🔄 REPLAY</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} style={[styles.btn, styles.halfBtn]} onPress={onMenu}>
              <Text style={styles.btnText}>🏠 MENU</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 5, 25, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modalCard: {
    backgroundColor: '#1E123D',
    borderRadius: 24,
    padding: 24,
    width: '86%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#54368E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  headerBadge: {
    color: '#00D2D3',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 14,
  },
  star: {
    fontSize: 34,
  },
  starLit: {
    color: '#FFD32A',
    textShadowColor: 'rgba(255, 211, 42, 0.6)',
    textShadowRadius: 10,
  },
  starDim: {
    color: '#443366',
  },
  statsContainer: {
    width: '100%',
    backgroundColor: '#160B31',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    color: '#A29BFE',
    fontSize: 13,
    fontWeight: '600',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  buttonList: {
    width: '100%',
    gap: 10,
  },
  btn: {
    backgroundColor: '#2D1B58',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4E338A',
  },
  btnText: {
    color: '#E0DBF5',
    fontSize: 14,
    fontWeight: '700',
  },
  primaryBtn: {
    backgroundColor: '#2ED573',
    borderColor: '#26AF5F',
  },
  primaryBtnText: {
    color: '#0A3B1B',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  upgradeBtn: {
    backgroundColor: '#9B59B6',
    borderColor: '#8E44AD',
  },
  upgradeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  halfBtn: {
    flex: 1,
  },
});
