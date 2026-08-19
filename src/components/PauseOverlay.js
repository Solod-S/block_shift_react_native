/**
 * PauseOverlay Component
 * Pause menu with Resume, Restart, Settings, and Menu options
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function PauseOverlay({ onResume, onRestart, onSettings, onMenu }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.modalCard}>
        <Text style={styles.title}>PAUSED</Text>
        <Text style={styles.subtitle}>Take a breath and plan your next shift</Text>

        <View style={styles.buttonList}>
          <TouchableOpacity activeOpacity={0.8} style={[styles.btn, styles.primaryBtn]} onPress={onResume}>
            <Text style={styles.primaryBtnText}>▶ RESUME</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={onRestart}>
            <Text style={styles.btnText}>🔄 RESTART</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={onSettings}>
            <Text style={styles.btnText}>⚙️ SETTINGS</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={[styles.btn, styles.menuBtn]} onPress={onMenu}>
            <Text style={styles.menuBtnText}>🏠 MAIN MENU</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 5, 25, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modalCard: {
    backgroundColor: '#1E123D',
    borderRadius: 24,
    padding: 24,
    width: '84%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A2E80',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    color: '#B0A4D6',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonList: {
    width: '100%',
    gap: 12,
  },
  btn: {
    backgroundColor: '#2D1B58',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4E338A',
  },
  btnText: {
    color: '#E0DBF5',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  primaryBtn: {
    backgroundColor: '#2ED573',
    borderColor: '#26AF5F',
  },
  primaryBtnText: {
    color: '#0A3B1B',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  menuBtn: {
    backgroundColor: 'transparent',
    borderColor: '#3D256D',
  },
  menuBtnText: {
    color: '#A29BFE',
    fontSize: 14,
    fontWeight: '600',
  },
});
