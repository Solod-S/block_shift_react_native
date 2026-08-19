/**
 * LevelCard Component
 * Teal rounded card below Next panel (from reference image)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LevelCard({ level = 1, progressText = '' }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Level</Text>
      <Text style={styles.levelNumber}>{level}</Text>
      {progressText ? <Text style={styles.progressText}>{progressText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#4EBAAA',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 6,
    width: 62,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  levelNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 22,
  },
  progressText: {
    color: '#E0F8F5',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
});
