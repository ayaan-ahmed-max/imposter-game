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

  function handleReveal() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setPhase('revealed');
    Animated.timing(flip, {
      toValue: 1,
      duration: FLIP_UP_MS,
      useNativeDriver: true,
    }).start();
  }

  function handleHide() {
    Animated.timing(flip, {
      toValue: 0,
      duration: FLIP_DOWN_MS,
      useNativeDriver: true,
    }).start(() => {
      setPhase('facedown');
      setSeatIndex((i) => i + 1);
    });
  }

  function handleContinue() {
    advancePhase();
    router.replace(IN_ROUND_HREF);
  }

  const frontRotate = flip.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotate = flip.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

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

          <Pressable
            onPress={phase === 'facedown' ? handleReveal : handleHide}
            style={styles.cardTouchable}
          >
            <Animated.View
              style={[
                styles.cardFace,
                styles.cardBack,
                { transform: [{ perspective: 1200 }, { rotateY: frontRotate }] },
              ]}
            >
              <View style={styles.cardBackMark} />
              <Text style={styles.cardBackLabel}>IMPOSTER</Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.cardFace,
                styles.cardFront,
                card && isImpostorCard(card) ? styles.cardFrontImpostor : styles.cardFrontCalm,
                { transform: [{ perspective: 1200 }, { rotateY: backRotate }] },
              ]}
            >
              <Text
                style={[
                  styles.cardFrontLabel,
                  card && isImpostorCard(card) ? styles.cardFrontLabelImpostor : styles.cardFrontLabelCalm,
                ]}
              >
                {card?.display}
              </Text>
            </Animated.View>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const CARD_WIDTH = 280;
const CARD_HEIGHT = 380;

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
  cardTouchable: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  cardFace: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    padding: 24,
  },
  cardBack: {
    backgroundColor: theme.colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.hairline,
    gap: 16,
  },
  cardBackMark: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: theme.colors.terracottaTint,
  },
  cardBackLabel: {
    fontFamily: theme.fontFamily.sansSemiBold,
    fontSize: theme.fontSize.sm,
    letterSpacing: 3,
    color: theme.colors.muted,
  },
  cardFront: {},
  cardFrontCalm: {
    backgroundColor: theme.colors.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.hairline,
  },
  cardFrontImpostor: {
    backgroundColor: theme.colors.oxblood,
  },
  cardFrontLabel: {
    fontFamily: theme.fontFamily.serifBold,
    fontSize: theme.fontSize.xl,
    textAlign: 'center',
  },
  cardFrontLabelCalm: {
    color: theme.colors.ink,
  },
  cardFrontLabelImpostor: {
    color: theme.colors.card,
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
