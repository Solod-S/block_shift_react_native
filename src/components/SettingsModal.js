/**
 * SettingsModal Component
 * Full settings management: Audio, Haptics, Ghost, Sensitivity, Left-handed, Reset Progress
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';

export default function SettingsModal({
  settings = {},
  onUpdateSettings,
  onResetProgress,
  onClose,
}) {
  const [localSettings, setLocalSettings] = useState({ ...settings });

  const toggle = (key) => {
    const updated = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(updated);
    onUpdateSettings && onUpdateSettings(updated);
  };

  const setSensitivity = (val) => {
    const updated = { ...localSettings, controlSensitivity: val };
    setLocalSettings(updated);
    onUpdateSettings && onUpdateSettings(updated);
  };

  const handleReset = () => {
    const doReset = () => {
      onResetProgress && onResetProgress();
      onClose && onClose();
    };

    if (typeof window !== 'undefined' && window.confirm) {
      if (window.confirm('Are you sure you want to reset all game progress, stars, and high scores?')) {
        doReset();
      }
    } else {
      Alert.alert(
        'Reset Progress',
        'Are you sure you want to reset all campaign progress, stars, and high scores?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Reset', style: 'destructive', onPress: doReset },
        ]
      );
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalCard}>
        <View style={styles.header}>
          <Text style={styles.title}>SETTINGS</Text>
          <TouchableOpacity activeOpacity={0.8} style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
          {/* Audio Section */}
          <Text style={styles.sectionHeader}>AUDIO</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Music</Text>
            <Switch
              value={localSettings.musicEnabled}
              onValueChange={() => toggle('musicEnabled')}
              trackColor={{ false: '#3E2A68', true: '#2ED573' }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Sound Effects</Text>
            <Switch
              value={localSettings.sfxEnabled}
              onValueChange={() => toggle('sfxEnabled')}
              trackColor={{ false: '#3E2A68', true: '#2ED573' }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Haptic Feedback</Text>
            <Switch
              value={localSettings.hapticsEnabled}
              onValueChange={() => toggle('hapticsEnabled')}
              trackColor={{ false: '#3E2A68', true: '#2ED573' }}
            />
          </View>

          {/* Gameplay Section */}
          <Text style={styles.sectionHeader}>GAMEPLAY</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Ghost Piece Projection</Text>
            <Switch
              value={localSettings.ghostEnabled}
              onValueChange={() => toggle('ghostEnabled')}
              trackColor={{ false: '#3E2A68', true: '#2ED573' }}
            />
          </View>

          <View style={styles.columnRow}>
            <Text style={styles.label}>Control Sensitivity</Text>
            <View style={styles.pillGroup}>
              {['low', 'normal', 'high'].map((val) => (
                <TouchableOpacity
                  key={val}
                  activeOpacity={0.8}
                  style={[
                    styles.pill,
                    localSettings.controlSensitivity === val && styles.pillActive,
                  ]}
                  onPress={() => setSensitivity(val)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      localSettings.controlSensitivity === val && styles.pillTextActive,
                    ]}
                  >
                    {val.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Left-Handed UI Layout</Text>
            <Switch
              value={localSettings.leftHanded}
              onValueChange={() => toggle('leftHanded')}
              trackColor={{ false: '#3E2A68', true: '#2ED573' }}
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Reduced Visual Effects</Text>
            <Switch
              value={localSettings.reducedEffects}
              onValueChange={() => toggle('reducedEffects')}
              trackColor={{ false: '#3E2A68', true: '#2ED573' }}
            />
          </View>

          {/* Danger Zone */}
          <Text style={[styles.sectionHeader, { color: '#FF5252' }]}>DANGER ZONE</Text>
          <TouchableOpacity activeOpacity={0.8} style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.resetBtnText}>🗑️ RESET ALL PROGRESS</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 5, 25, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 120,
  },
  modalCard: {
    backgroundColor: '#1E123D',
    borderRadius: 24,
    width: '90%',
    maxWidth: 360,
    maxHeight: '85%',
    borderWidth: 2,
    borderColor: '#4A2E80',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2F1E5E',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    color: '#A29BFE',
    fontSize: 18,
    fontWeight: '700',
  },
  scrollArea: {
    flexGrow: 0,
  },
  scrollContent: {
    padding: 20,
    gap: 12,
  },
  sectionHeader: {
    color: '#00D2D3',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 8,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  columnRow: {
    paddingVertical: 6,
    gap: 8,
  },
  label: {
    color: '#E0DBF5',
    fontSize: 14,
    fontWeight: '600',
  },
  pillGroup: {
    flexDirection: 'row',
    backgroundColor: '#160B31',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  pill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  pillActive: {
    backgroundColor: '#2ED573',
  },
  pillText: {
    color: '#A29BFE',
    fontSize: 11,
    fontWeight: '800',
  },
  pillTextActive: {
    color: '#0A3B1B',
  },
  resetBtn: {
    backgroundColor: '#381323',
    borderColor: '#7A1C3E',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  resetBtnText: {
    color: '#FF5252',
    fontSize: 13,
    fontWeight: '800',
  },
});
