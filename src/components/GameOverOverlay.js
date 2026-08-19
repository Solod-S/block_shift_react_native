/**
 * GameOverOverlay Component
 * Game Over screen with score summary, retry, and main menu options
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function GameOverOverlay({
  score = 0,
  highScore = 0,
  stats = {},
  onRetry,
  onMenu,
}) {
  const isNewRecord = score > 0 && score >= highScore;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalCard}>
        <Text style={styles.dangerBadge}>MATRIX OVERLOAD</Text>
        <Text style={styles.title}>GAME OVER</Text>

        {isNewRecord && (
          <View style={styles.recordBadge}>
            <Text style={styles.recordText}>🏆 NEW HIGH SCORE!</Text>
          </View>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Best</Text>
            <Text style={styles.statValue}>{highScore.toLocaleString()}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Lines</Text>
            <Text style={styles.statValue}>{stats.linesCleared || 0}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Max Combo</Text>
            <Text style={styles.statValue}>x{stats.maxCombo || 0}</Text>
          </View>
        </View>

        <View style={styles.buttonList}>
          <TouchableOpacity activeOpacity={0.8} style={[styles.btn, styles.primaryBtn]} onPress={onRetry}>
            <Text style={styles.primaryBtnText}>🔄 TRY AGAIN</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={onMenu}>
            <Text style={styles.btnText}>🏠 MAIN MENU</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 5, 20, 0.9)',
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
    borderColor: '#7A1C3E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 20,
  },
  dangerBadge: {
    color: '#FF5252',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  recordBadge: {
    backgroundColor: '#FFD32A',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  recordText: {
    color: '#1E123D',
    fontSize: 12,
    fontWeight: '900',
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
  scoreValue: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '900',
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
    backgroundColor: '#FF5252',
    borderColor: '#D63031',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
