import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { theme } from '@/theme';
import { useRoundStore } from '@/store/roundStore';

// /round-end doesn't exist yet (next stage) — same href-cast workaround
// Reveal used for /in-round before this screen existed.
const ROUND_END_HREF = '/round-end' as any;

export default function InRoundScreen() {
  const round = useRoundStore((s) => s.round);
  const [questionRevealed, setQuestionRevealed] = useState(false);

  useEffect(() => {
    if (!round) {
      router.replace('/setup' as any);
    }
  }, [round]);

  if (!round) {
    return null;
  }

  const players = [...round.players].sort((a, b) => a.seat - b.seat);

  function handleEnd() {
    router.replace(ROUND_END_HREF);
  }

  const showEndButton = round.mode !== 'question' || questionRevealed;
  const endLabel = round.mode === 'mafia' ? 'End game' : 'End round';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>In Round</Text>

        <View style={styles.modeSection}>
          {round.mode === 'classic' && (
            <>
              <Text style={styles.modeLabel}>Starts the round</Text>
              <Text style={styles.modeValue}>{players[0]?.name}</Text>
            </>
          )}

          {round.mode === 'question' &&
            (questionRevealed ? (
              <>
                <Text style={styles.modeLabel}>The real question</Text>
                <Text style={styles.modeValue}>{round.selectedItem.real}</Text>
              </>
            ) : (
              <Pressable
                onPress={() => setQuestionRevealed(true)}
                style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
              >
                <Text style={styles.primaryButtonLabel}>Reveal question</Text>
              </Pressable>
            ))}

          {round.mode === 'mafia' && (
            <Text style={styles.modeLabel}>Discuss, then vote out the Mafia.</Text>
          )}
        </View>

        {showEndButton && (
          <Pressable
            onPress={handleEnd}
            style={({ pressed }) => [styles.endButton, pressed && styles.endButtonPressed]}
          >
            <Text style={styles.endButtonLabel}>{endLabel}</Text>
          </Pressable>
        )}
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
    gap: 24,
  },
  heading: {
    fontFamily: theme.fontFamily.serifBold,
    fontSize: theme.fontSize.xxl,
    color: theme.colors.ink,
    marginBottom: 8,
  },
  modeSection: {
    alignItems: 'center',
    gap: 8,
  },
  modeLabel: {
    fontFamily: theme.fontFamily.sansMedium,
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
    textAlign: 'center',
  },
  modeValue: {
    fontFamily: theme.fontFamily.serifBold,
    fontSize: theme.fontSize.xl,
    color: theme.colors.ink,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.terracotta,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  primaryButtonPressed: {
    backgroundColor: theme.colors.terracottaPressed,
  },
  primaryButtonLabel: {
    fontFamily: theme.fontFamily.sansSemiBold,
    fontSize: theme.fontSize.lg,
    color: theme.colors.card,
  },
  endButton: {
    backgroundColor: theme.colors.ink,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  endButtonPressed: {
    opacity: 0.85,
  },
  endButtonLabel: {
    fontFamily: theme.fontFamily.sansSemiBold,
    fontSize: theme.fontSize.lg,
    color: theme.colors.card,
  },
});
