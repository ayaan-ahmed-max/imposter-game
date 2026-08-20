import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { theme } from '@/theme';
import { useRoundStore } from '@/store/roundStore';
import { Stepper } from '@/components/Stepper';

// /round-end doesn't exist yet (next stage) — same href-cast workaround
// Reveal used for /in-round before this screen existed.
const ROUND_END_HREF = '/round-end' as any;

const DEFAULT_MINUTES = 3;

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function InRoundScreen() {
  const round = useRoundStore((s) => s.round);

  const [questionRevealed, setQuestionRevealed] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(DEFAULT_MINUTES);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_MINUTES * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!round) {
      router.replace('/setup' as any);
    }
  }, [round]);

  useEffect(() => {
    if (!timerRunning) {
      return;
    }
    const id = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  useEffect(() => {
    if (timerRunning && secondsLeft === 0) {
      setTimerRunning(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    }
  }, [secondsLeft, timerRunning]);

  if (!round) {
    return null;
  }

  const players = [...round.players].sort((a, b) => a.seat - b.seat);

  function handleToggleTimer(next: boolean) {
    setTimerEnabled(next);
    setTimerRunning(false);
    setTimerMinutes(DEFAULT_MINUTES);
    setSecondsLeft(DEFAULT_MINUTES * 60);
  }

  function handleChangeMinutes(next: number) {
    if (timerRunning) {
      return;
    }
    setTimerMinutes(next);
    setSecondsLeft(next * 60);
  }

  function handleToggleRunning() {
    if (!timerRunning && secondsLeft === 0) {
      setSecondsLeft(timerMinutes * 60);
    }
    setTimerRunning((r) => !r);
  }

  function handleResetTimer() {
    setTimerRunning(false);
    setSecondsLeft(timerMinutes * 60);
  }

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

        <View style={styles.timerSection}>
          <View style={styles.timerRow}>
            <Text style={styles.sectionLabel}>Discussion timer</Text>
            <Switch
              value={timerEnabled}
              onValueChange={handleToggleTimer}
              trackColor={{ false: theme.colors.sunken, true: theme.colors.terracottaTint }}
              thumbColor={timerEnabled ? theme.colors.terracotta : theme.colors.card}
            />
          </View>

          {timerEnabled && (
            <View style={styles.timerControls}>
              <Stepper
                label="Minutes"
                value={timerMinutes}
                min={1}
                max={15}
                onChange={handleChangeMinutes}
              />
              <Text style={styles.timerDisplay}>{formatTime(secondsLeft)}</Text>
              <View style={styles.timerButtons}>
                <Pressable onPress={handleToggleRunning} style={styles.timerButton}>
                  <Text style={styles.timerButtonLabel}>{timerRunning ? 'Pause' : 'Start'}</Text>
                </Pressable>
                <Pressable
                  onPress={handleResetTimer}
                  style={[styles.timerButton, styles.timerButtonSecondary]}
                >
                  <Text style={[styles.timerButtonLabel, styles.timerButtonLabelSecondary]}>
                    Reset
                  </Text>
                </Pressable>
              </View>
            </View>
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
  sectionLabel: {
    fontFamily: theme.fontFamily.sansMedium,
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
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
  timerSection: {
    gap: 12,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timerControls: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.hairline,
    padding: 16,
    gap: 12,
  },
  timerDisplay: {
    fontFamily: theme.fontFamily.serifBold,
    fontSize: theme.fontSize.xxl,
    color: theme.colors.ink,
    textAlign: 'center',
  },
  timerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  timerButton: {
    flex: 1,
    backgroundColor: theme.colors.terracotta,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  timerButtonSecondary: {
    backgroundColor: theme.colors.sunken,
  },
  timerButtonLabel: {
    fontFamily: theme.fontFamily.sansSemiBold,
    fontSize: theme.fontSize.base,
    color: theme.colors.card,
  },
  timerButtonLabelSecondary: {
    color: theme.colors.ink,
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
