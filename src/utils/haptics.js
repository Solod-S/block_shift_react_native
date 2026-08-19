/**
 * Haptic feedback wrapper using expo-haptics
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export class HapticsManager {
  constructor(enabled = true) {
    this.enabled = enabled;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  async trigger(type = 'light') {
    if (!this.enabled || Platform.OS === 'web') return;

    try {
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        default:
          await Haptics.selectionAsync();
      }
    } catch (err) {
      // Gracefully ignore haptics errors on unsupported devices
    }
  }

  onRotate() {
    this.trigger('light');
  }

  onHold() {
    this.trigger('light');
  }

  onHardDrop() {
    this.trigger('medium');
  }

  onLineClear(linesCount) {
    if (linesCount === 4) {
      this.trigger('success');
    } else if (linesCount >= 2) {
      this.trigger('medium');
    } else {
      this.trigger('light');
    }
  }

  onGameOver() {
    this.trigger('heavy');
  }

  onLevelClear() {
    this.trigger('success');
  }
}

export const hapticsManager = new HapticsManager();
