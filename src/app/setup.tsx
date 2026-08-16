import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/theme';
import type { GameMode } from '@/engine';
import { Stepper } from '@/components/Stepper';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;
const MODES: GameMode[] = ['classic', 'question', 'mafia'];
const MODE_LABELS: Record<GameMode, string> = {
  classic: 'Classic',
  question: 'Question',
  mafia: 'Mafia',
};

export default function SetupScreen() {
  const [playerCount, setPlayerCount] = useState(4);
  const [mode, setMode] = useState<GameMode>('classic');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Setup</Text>

        <Stepper
          label="Players"
          value={playerCount}
          min={MIN_PLAYERS}
          max={MAX_PLAYERS}
          onChange={setPlayerCount}
        />

        <View style={styles.modeToggle}>
          {MODES.map((m) => (
            <Text
              key={m}
              onPress={() => setMode(m)}
              style={[styles.modeOption, m === mode && styles.modeOptionActive]}
            >
              {MODE_LABELS[m]}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.canvas,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  heading: {
    fontFamily: theme.fontFamily.serifBold,
    fontSize: theme.fontSize.xxl,
    color: theme.colors.ink,
    marginBottom: 8,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.sunken,
    borderRadius: 10,
    padding: 4,
  },
  modeOption: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    fontFamily: theme.fontFamily.sansMedium,
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
    overflow: 'hidden',
  },
  modeOptionActive: {
    backgroundColor: theme.colors.card,
    color: theme.colors.ink,
  },
});
