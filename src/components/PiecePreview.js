/**
 * PiecePreview Component
 * Renders a centered miniature preview of a piece for Hold and Next panels
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PIECES } from '../game/pieces.js';

export default function PiecePreview({ pieceType, size = 12 }) {
  if (!pieceType) return <View style={[styles.container, { width: size * 4, height: size * 3 }]} />;

  const def = PIECES[pieceType];
  if (!def) return null;

  // Use spawn rotation (0)
  const cells = def.rotationStates[0];

  // Compute bounding box for centering
  const minX = Math.min(...cells.map((c) => c.x));
  const maxX = Math.max(...cells.map((c) => c.x));
  const minY = Math.min(...cells.map((c) => c.y));
  const maxY = Math.max(...cells.map((c) => c.y));

  const pieceWidth = (maxX - minX + 1) * size;
  const pieceHeight = (maxY - minY + 1) * size;

  return (
    <View style={[styles.container, { width: size * 4.2, height: size * 3.2 }]}>
      <View style={{ width: pieceWidth, height: pieceHeight, position: 'relative' }}>
        {cells.map((cell, idx) => (
          <View
            key={`preview-${idx}`}
            style={[
              styles.block,
              {
                width: size - 1.5,
                height: size - 1.5,
                left: (cell.x - minX) * size,
                top: (cell.y - minY) * size,
                backgroundColor: def.color,
              },
            ]}
          >
            <View style={styles.blockHighlight} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  block: {
    position: 'absolute',
    borderRadius: 3,
    overflow: 'hidden',
  },
  blockHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});
