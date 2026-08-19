/**
 * MenuScreen Component
 * Main Landing Screen for Block Shift
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundScene from '../components/BackgroundScene.js';

export default function MenuScreen({
  saveData = {},
  onStartCampaign,
  onOpenModes,
  onOpenLevels,
  onOpenSettings,
}) {
  const campaignScore = saveData?.highScores?.campaign || 0;
  const marathonScore = saveData?.highScores?.marathon || 0;
  const unlockedLevel = saveData?.unlockedLevel || 1;

  return (
    <View style={styles.container}>
      <BackgroundScene world={1} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header Title Area */}
        <View style={styles.header}>
          <Text style={styles.kicker}>ARCADE PUZZLE</Text>
          <Text style={styles.title}>BLOCK</Text>
          <Text style={[styles.title, styles.titleShift]}>SHIFT</Text>
          <Text style={styles.tagline}>PRECISION FALLING-BLOCK EXPERIENCE</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonList}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.btn, styles.campaignBtn]}
            onPress={onStartCampaign}
          >
            <Text style={styles.campaignBtnText}>▶ PLAY CAMPAIGN</Text>
            <Text style={styles.btnSubtext}>Level {unlockedLevel} / 30</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.btn, styles.modeBtn]}
            onPress={onOpenModes}
          >
            <Text style={styles.modeBtnText}>🕹️ GAME MODES</Text>
            <Text style={styles.btnSubtext}>Marathon, Sprint 40, Time Attack, Zen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.btn}
            onPress={onOpenLevels}
          >
            <Text style={styles.btnText}>🗺️ LEVEL SELECT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.btn, styles.settingsBtn]}
            onPress={onOpenSettings}
          >
            <Text style={styles.settingsBtnText}>⚙️ SETTINGS</Text>
          </TouchableOpacity>
        </View>

        {/* Footer High Scores */}
        <View style={styles.footerScores}>
          <View style={styles.scorePill}>
            <Text style={styles.scorePillLabel}>CAMPAIGN BEST</Text>
            <Text style={styles.scorePillValue}>{campaignScore.toLocaleString()}</Text>
          </View>
          <View style={styles.scorePill}>
            <Text style={styles.scorePillLabel}>MARATHON BEST</Text>
            <Text style={styles.scorePillValue}>{marathonScore.toLocaleString()}</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E123D',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 24,
  },
  kicker: {
    color: '#00D2D3',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 46,
    fontWeight: '900',
    letterSpacing: 3,
    lineHeight: 48,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  titleShift: {
    color: '#FF6B81',
  },
  tagline: {
    color: '#E0DBF5',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 8,
  },
  buttonList: {
    width: '100%',
    maxWidth: 320,
    gap: 12,
  },
  btn: {
    backgroundColor: 'rgba(25, 14, 56, 0.8)',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#4E308E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  btnText: {
    color: '#E0DBF5',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  btnSubtext: {
    color: '#A29BFE',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  campaignBtn: {
    backgroundColor: '#2ED573',
    borderColor: '#26AF5F',
    paddingVertical: 16,
  },
  campaignBtnText: {
    color: '#0A3B1B',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  modeBtn: {
    backgroundColor: '#3867D6',
    borderColor: '#2F54B8',
  },
  modeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  settingsBtn: {
    backgroundColor: 'transparent',
    borderColor: '#3D256D',
  },
  settingsBtnText: {
    color: '#D1C8EC',
    fontSize: 14,
    fontWeight: '700',
  },
  footerScores: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  scorePill: {
    backgroundColor: 'rgba(25, 14, 56, 0.6)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  scorePillLabel: {
    color: '#A29BFE',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scorePillValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 1,
  },
});
