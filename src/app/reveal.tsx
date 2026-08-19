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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.center} />
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
});
