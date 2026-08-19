/**
 * HUD Component
 * Top bar with star score, combo indicator, timer, and active mode badges
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Hud({
  score = 0,
  combo = 0,
  isBackToBack = false,
  timeRemainingMs = null,
  modeName = '',
}) {
  const formatTime = (ms) => {
    if (ms === null) return '';
    const totalSecs = Math.max(0, Math.ceil(ms / 1000));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.hudContainer}>
      {/* Top Left: Star Icon and Score (from reference image) */}
      <View style={styles.scoreBadge}>
        <Text style={styles.starIcon}>⭐</Text>
        <Text style={styles.scoreText}>{score.toLocaleString()}</Text>
      </View>

      {/* Center: Active Combo / B2B Badges */}
      <View style={styles.centerArea}>
        {combo > 1 && (
          <View style={styles.comboBadge}>
            <Text style={styles.comboText}>COMBO x{combo} 🔥</Text>
          </View>
        )}
        {isBackToBack && (
          <View style={styles.b2bBadge}>
            <Text style={styles.b2bText}>B2B ✨</Text>
          </View>
        )}
      </View>

      {/* Top Right: Timer or Mode name */}
      <View style={styles.rightArea}>
        {timeRemainingMs !== null ? (
          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>⏱️ {formatTime(timeRemainingMs)}</Text>
          </View>
        ) : modeName ? (
          <View style={styles.modeBadge}>
            <Text style={styles.modeText}>{modeName}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hudContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 20,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 14, 56, 0.65)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  starIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  centerArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  comboBadge: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  comboText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  b2bBadge: {
    backgroundColor: '#F39C12',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  b2bText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  rightArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerBadge: {
    backgroundColor: '#E84118',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  modeBadge: {
    backgroundColor: 'rgba(25, 14, 56, 0.65)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  modeText: {
    color: '#A29BFE',
    fontSize: 12,
    fontWeight: '700',
  },
});
