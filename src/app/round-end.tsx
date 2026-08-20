import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { theme } from '@/theme';
import { useRoundStore } from '@/store/roundStore';

export default function RoundEndScreen() {
  const round = useRoundStore((s) => s.round);
  const startRound = useRoundStore((s) => s.startRound);
  const resetRound = useRoundStore((s) => s.resetRound);

  useEffect(() => {
    if (!round) {
      router.replace('/setup' as any);
    }
  }, [round]);

  if (!round) {
    return null;
  }

  const players = [...round.players].sort((a, b) => a.seat - b.seat);
  const impostors = players.filter((p) => round.hiddenCards[p.id].role === 'impostor');
  const impostorLabel = impostors.length > 1 ? 'The impostors were' : 'The impostor was';

  function handleNextRound() {
    if (!round) {
      return;
    }
    if (round.mode === 'classic') {
      startRound({ mode: 'classic', players: round.players, pack: round.selectedPack, config: round.config });
    } else if (round.mode === 'question') {
      startRound({ mode: 'question', players: round.players, pack: round.selectedPack, config: round.config });
    } else {
      startRound({ mode: 'mafia', players: round.players, config: round.config });
    }
    router.replace('/reveal' as any);
  }

  function handleBackToSetup() {
    resetRound();
    router.replace('/setup' as any);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Round Over</Text>

        {round.mode === 'mafia' ? (
          <View style={styles.roleList}>
            {players.map((p) => (
              <View key={p.id} style={styles.roleRow}>
                <Text style={styles.roleName}>{p.name}</Text>
                <Text style={styles.roleValue}>{round.hiddenCards[p.id].display}</Text>
              </View>
            ))}
          </View>
        ) : (
          <>
            <View style={styles.revealCard}>
              <Text style={styles.sectionLabel}>{impostorLabel}</Text>
              <Text style={styles.revealValue}>{impostors.map((p) => p.name).join(', ')}</Text>
            </View>
            <View style={styles.revealCard}>
              <Text style={styles.sectionLabel}>
                {round.mode === 'classic' ? 'The word was' : 'The real question was'}
              </Text>
              <Text style={styles.revealValue}>
                {round.mode === 'classic' ? round.selectedItem : round.selectedItem.real}
              </Text>
            </View>
          </>
        )}

        <View style={styles.actions}>
          <Pressable
            onPress={handleNextRound}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          >
            <Text style={styles.primaryButtonLabel}>Next round</Text>
          </Pressable>
          <Pressable
            onPress={handleBackToSetup}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
          >
            <Text style={styles.secondaryButtonLabel}>Back to setup</Text>
          </Pressable>
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
  sectionLabel: {
    fontFamily: theme.fontFamily.sansMedium,
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
  },
  revealCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.hairline,
    padding: 16,
    gap: 6,
  },
  revealValue: {
    fontFamily: theme.fontFamily.serifBold,
    fontSize: theme.fontSize.xl,
    color: theme.colors.ink,
  },
  roleList: {
    gap: 8,
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.hairline,
    backgroundColor: theme.colors.card,
  },
  roleName: {
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.base,
    color: theme.colors.ink,
  },
  roleValue: {
    fontFamily: theme.fontFamily.sansSemiBold,
    fontSize: theme.fontSize.base,
    color: theme.colors.terracottaPressed,
  },
  actions: {
    gap: 12,
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: theme.colors.terracotta,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonPressed: {
    backgroundColor: theme.colors.terracottaPressed,
  },
  primaryButtonLabel: {
    fontFamily: theme.fontFamily.sansSemiBold,
    fontSize: theme.fontSize.lg,
    color: theme.colors.card,
  },
  secondaryButton: {
    backgroundColor: theme.colors.sunken,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonPressed: {
    backgroundColor: theme.colors.hairline,
  },
  secondaryButtonLabel: {
    fontFamily: theme.fontFamily.sansSemiBold,
    fontSize: theme.fontSize.lg,
    color: theme.colors.ink,
  },
});
