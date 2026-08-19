/**
 * NextPanel Component
 * Teal / mint rounded card on the right (from reference image)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PiecePreview from './PiecePreview.js';

export default function NextPanel({ nextQueue = [], visibleCount = 3 }) {
  const displayQueue = nextQueue.slice(0, visibleCount);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Next</Text>
      <View style={styles.queueContainer}>
        {displayQueue.map((pieceType, index) => (
          <View key={`next-queue-${index}`} style={styles.previewSlot}>
            <PiecePreview pieceType={pieceType} size={10} />
          </View>
        ))}
      </View>
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
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  queueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  previewSlot: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
