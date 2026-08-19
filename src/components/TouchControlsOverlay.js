/**
 * TouchControlsOverlay Component
 * Gesture handler for board touch interactions:
 * - Drag left/right to move
 * - Tap to rotate clockwise
 * - Drag down for soft drop
 * - Fast flick down for hard drop
 */

import React, { useRef, useMemo } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import { GestureProcessor } from '../game/input.js';

export default function TouchControlsOverlay({
  onMoveLeft,
  onMoveRight,
  onRotateClockwise,
  onRotateCounterClockwise,
  onSoftDropStart,
  onSoftDropEnd,
  onHardDrop,
  sensitivity = 'normal',
  children,
}) {
  const processor = useMemo(
    () =>
      new GestureProcessor({
        onMoveLeft,
        onMoveRight,
        onRotateClockwise,
        onRotateCounterClockwise,
        onSoftDropStart,
        onSoftDropEnd,
        onHardDrop,
        sensitivity,
      }),
    [
      onMoveLeft,
      onMoveRight,
      onRotateClockwise,
      onRotateCounterClockwise,
      onSoftDropStart,
      onSoftDropEnd,
      onHardDrop,
      sensitivity,
    ]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => processor.onTouchStart(evt),
      onPanResponderMove: (evt) => processor.onTouchMove(evt),
      onPanResponderRelease: (evt) => processor.onTouchEnd(evt),
      onPanResponderTerminate: () => processor.reset(),
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
