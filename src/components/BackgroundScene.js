/**
 * BackgroundScene Component
 * Visual aesthetic matching the reference image:
 * Soft pastel sunset gradient, glowing sun, wavy landscape hills, and tree canopy atop the board
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
  Path,
  G,
} from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function BackgroundScene({ world = 1, isDanger = false }) {
  // Color themes for different worlds
  const gradients = {
    1: {
      // Sunset pastel (from reference)
      top: '#371A5E',
      mid1: '#6E2C82',
      mid2: '#A84C8B',
      mid3: '#E2788F',
      bottom: '#FBB1A5',
      sun: '#FFE494',
      sunGlow: '#FFA69E',
      hills1: '#843B7C',
      hills2: '#C95F8B',
    },
    2: {
      // Shift Circuit: Cyan / Deep Emerald
      top: '#0A2540',
      mid1: '#0F4C60',
      mid2: '#167D7F',
      mid3: '#29A19C',
      bottom: '#A2DE96',
      sun: '#A8FF78',
      sunGlow: '#78FFD6',
      hills1: '#125B66',
      hills2: '#218C8D',
    },
    3: {
      // Gravity Core: Deep Crimson / Violet
      top: '#240B36',
      mid1: '#4A154B',
      mid2: '#8E1D4F',
      mid3: '#C31432',
      bottom: '#F77062',
      sun: '#FFDD93',
      sunGlow: '#FE5196',
      hills1: '#641548',
      hills2: '#A51842',
    },
  };

  const theme = gradients[world] || gradients[1];

  return (
    <View style={[StyleSheet.absoluteFillObject, { zIndex: 0 }]} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`} style={StyleSheet.absoluteFillObject}>
        <Defs>
          {/* Sky Gradient */}
          <LinearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={isDanger ? '#3A0D1B' : theme.top} />
            <Stop offset="25%" stopColor={isDanger ? '#5E132B' : theme.mid1} />
            <Stop offset="50%" stopColor={isDanger ? '#8C1D38' : theme.mid2} />
            <Stop offset="75%" stopColor={isDanger ? '#B83248' : theme.mid3} />
            <Stop offset="100%" stopColor={isDanger ? '#E0565B' : theme.bottom} />
          </LinearGradient>

          {/* Sun Radial Glow */}
          <RadialGradient id="sunGlowGrad" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={theme.sun} stopOpacity="0.9" />
            <Stop offset="40%" stopColor={theme.sunGlow} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={theme.mid2} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Sky Background */}
        <Rect x="0" y="0" width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="url(#skyGrad)" />

        {/* Glowing Sun / Moon in upper sky */}
        <Circle cx={SCREEN_WIDTH * 0.5} cy={SCREEN_HEIGHT * 0.13} r={42} fill="url(#sunGlowGrad)" />
        <Circle cx={SCREEN_WIDTH * 0.5} cy={SCREEN_HEIGHT * 0.13} r={18} fill={theme.sun} opacity={0.95} />

        {/* Distant Rolling Sunset Hills / Waves */}
        <Path
          d={`M0,${SCREEN_HEIGHT * 0.48} Q${SCREEN_WIDTH * 0.3},${SCREEN_HEIGHT * 0.44} ${SCREEN_WIDTH * 0.7},${SCREEN_HEIGHT * 0.5} T${SCREEN_WIDTH},${SCREEN_HEIGHT * 0.47} L${SCREEN_WIDTH},${SCREEN_HEIGHT} L0,${SCREEN_HEIGHT} Z`}
          fill={theme.hills1}
          opacity={0.35}
        />
        <Path
          d={`M0,${SCREEN_HEIGHT * 0.68} Q${SCREEN_WIDTH * 0.4},${SCREEN_HEIGHT * 0.64} ${SCREEN_WIDTH * 0.8},${SCREEN_HEIGHT * 0.7} T${SCREEN_WIDTH},${SCREEN_HEIGHT * 0.66} L${SCREEN_WIDTH},${SCREEN_HEIGHT} L0,${SCREEN_HEIGHT} Z`}
          fill={theme.hills2}
          opacity={0.4}
        />
        <Path
          d={`M0,${SCREEN_HEIGHT * 0.84} Q${SCREEN_WIDTH * 0.25},${SCREEN_HEIGHT * 0.8} ${SCREEN_WIDTH * 0.65},${SCREEN_HEIGHT * 0.86} T${SCREEN_WIDTH},${SCREEN_HEIGHT * 0.82} L${SCREEN_WIDTH},${SCREEN_HEIGHT} L0,${SCREEN_HEIGHT} Z`}
          fill={theme.bottom}
          opacity={0.65}
        />
      </Svg>
    </View>
  );
}
