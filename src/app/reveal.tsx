import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { theme } from '@/theme';
import type { HiddenCard } from '@/engine';
import { useRoundStore } from '@/store/roundStore';

// /in-round doesn't exist yet (next stage) — same typedRoutes workaround as
// Setup's REVEAL_HREF before this screen existed.
const IN_ROUND_HREF = '/in-round' as any;

const FLIP_UP_MS = 280;
const FLIP_DOWN_MS = 220;

function isImpostorCard(card: HiddenCard): boolean {
  return card.role === 'impostor' || card.role === 'mafia';
}

export default function RevealScreen() {
  const round = useRoundStore((s) => s.round);
  const advancePhase = useRoundStore((s) => s.advancePhase);

  const [seatIndex, setSeatIndex] = useState(0);
  const [phase, setPhase] = useState<'facedown' | 'revealed'>('facedown');
  const flip = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!round) {
      router.replace('/setup' as any);
    }
  }, [round]);

  if (!round) {
    return null;
  }

  const players = [...round.players].sort((a, b) => a.seat - b.seat);
  const done = seatIndex >= players.length;
  const player = players[seatIndex];
  const card = player ? round.hiddenCards[player.id] : null;

  function handleContinue() {
    advancePhase();
    router.replace(IN_ROUND_HREF);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {done ? (
        <View style={styles.center}>
          <Text style={styles.doneHeading}>Everyone's seen their card</Text>
          <Text style={styles.doneSub}>Time to start the round.</Text>
          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [styles.continueButton, pressed && styles.continueButtonPressed]}
          >
            <Text style={styles.continueButtonLabel}>Continue</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.center}>
          <Text style={styles.passHeading}>Pass to {player.name}</Text>
          <Text style={styles.passHint}>
            {phase === 'facedown' ? 'Tap the card to reveal' : 'Tap to hide and pass on'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.canvas,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  passHeading: {
    fontFamily: theme.fontFamily.serifBold,
    fontSize: theme.fontSize.xl,
    color: theme.colors.ink,
    textAlign: 'center',
  },
  passHint: {
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
    marginBottom: 20,
  },
  doneHeading: {
    fontFamily: theme.fontFamily.serifBold,
    fontSize: theme.fontSize.xl,
    color: theme.colors.ink,
    textAlign: 'center',
  },
  doneSub: {
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.base,
    color: theme.colors.muted,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: theme.colors.terracotta,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  continueButtonPressed: {
    backgroundColor: theme.colors.terracottaPressed,
  },
  continueButtonLabel: {
    fontFamily: theme.fontFamily.sansSemiBold,
    fontSize: theme.fontSize.lg,
    color: theme.colors.card,
  },
});
