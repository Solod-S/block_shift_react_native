/**
 * UpgradeModal Component
 * Milestone upgrade choice modal (3 options)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function UpgradeModal({ choices = [], currentStacks = {}, onSelectUpgrade }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.modalCard}>
        <Text style={styles.headerBadge}>MILESTONE REACHED</Text>
        <Text style={styles.title}>CHOOSE AN UPGRADE</Text>
        <Text style={styles.subtitle}>These passive modifiers boost your current campaign run.</Text>

        <View style={styles.cardList}>
          {choices.map((upgrade) => {
            const stacks = currentStacks[upgrade.id] || 0;

            return (
              <TouchableOpacity
                key={upgrade.id}
                activeOpacity={0.8}
                style={styles.upgradeCard}
                onPress={() => onSelectUpgrade(upgrade.id)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardIcon}>{upgrade.icon}</Text>
                  <View style={styles.cardTitleArea}>
                    <Text style={styles.cardName}>{upgrade.name}</Text>
                    <Text style={styles.cardStack}>
                      Level {stacks + 1} / {upgrade.maxStacks}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardDesc}>{upgrade.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 5, 25, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 110,
  },
  modalCard: {
    backgroundColor: '#1E123D',
    borderRadius: 24,
    padding: 22,
    width: '88%',
    maxWidth: 360,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6C48B0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 24,
  },
  headerBadge: {
    color: '#00D2D3',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    color: '#B0A4D6',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  cardList: {
    width: '100%',
    gap: 12,
  },
  upgradeCard: {
    backgroundColor: '#27174A',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#4E308E',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  cardTitleArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  cardStack: {
    color: '#F1C40F',
    fontSize: 11,
    fontWeight: '700',
  },
  cardDesc: {
    color: '#D1C8EC',
    fontSize: 12,
    lineHeight: 16,
  },
});
