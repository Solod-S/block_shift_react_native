/**
 * HoldPanel Component
 * Coral rounded card on the left (from reference image)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PiecePreview from './PiecePreview.js';

export default function HoldPanel({ holdPiece, canHold = true, onHoldPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onHoldPress}
      style={[
        styles.card,
        {
          opacity: canHold ? 1 : 0.6,
        },
      ]}
    >
      <Text style={styles.title}>Hold</Text>
      <View style={styles.previewBox}>
        <PiecePreview pieceType={holdPiece} size={11} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#D64545',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 6,
    width: 62,
    minHeight: 68,
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
  previewBox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
  },
});
