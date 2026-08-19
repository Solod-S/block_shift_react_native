/**
 * BoardCanopy Component
 * Cute rounded tree crowns/foliage atop the board container (from reference image)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Rect, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function BoardCanopy({ width, height = 40 }) {
  if (!width) return null;

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id="treeGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#81C784" />
            <Stop offset="100%" stopColor="#388E3C" />
          </LinearGradient>
          <LinearGradient id="treeGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#A5D6A7" />
            <Stop offset="100%" stopColor="#4CAF50" />
          </LinearGradient>
          <LinearGradient id="treeGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#66BB6A" />
            <Stop offset="100%" stopColor="#2E7D32" />
          </LinearGradient>
        </Defs>

        {/* Overlapping stylized rounded trees/canopies */}
        <G>
          {/* Left clusters */}
          <Rect x={width * 0.08} y={8} width={22} height={32} rx={11} fill="url(#treeGrad1)" opacity={0.9} />
          <Rect x={width * 0.16} y={4} width={26} height={36} rx={13} fill="url(#treeGrad2)" opacity={0.95} />
          <Rect x={width * 0.26} y={12} width={20} height={28} rx={10} fill="url(#treeGrad3)" opacity={0.85} />

          {/* Center clusters */}
          <Rect x={width * 0.44} y={16} width={22} height={24} rx={11} fill="url(#treeGrad1)" opacity={0.85} />
          <Rect x={width * 0.52} y={10} width={26} height={30} rx={13} fill="url(#treeGrad2)" opacity={0.9} />

          {/* Right clusters */}
          <Rect x={width * 0.68} y={6} width={24} height={34} rx={12} fill="url(#treeGrad1)" opacity={0.95} />
          <Rect x={width * 0.78} y={10} width={26} height={30} rx={13} fill="url(#treeGrad3)" opacity={0.9} />
          <Rect x={width * 0.86} y={14} width={18} height={26} rx={9} fill="url(#treeGrad2)" opacity={0.85} />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -24,
    left: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
