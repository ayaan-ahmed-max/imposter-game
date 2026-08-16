import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/theme';
import type { GameMode } from '@/engine';
import { getPacksByMode } from '@/data/loadPacks';
import { Stepper } from '@/components/Stepper';

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const MODES: GameMode[] = ['classic', 'question', 'mafia'];
const MODE_LABELS: Record<GameMode, string> = {
  classic: 'Classic',
  question: 'Question',
  mafia: 'Mafia',
};

export default function SetupScreen() {
  const [playerCount, setPlayerCount] = useState(4);
  const [mode, setMode] = useState<GameMode>('classic');
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [impostorCount, setImpostorCount] = useState(1);
  const [mafiaCount, setMafiaCount] = useState(1);
  const [doctorCount, setDoctorCount] = useState(0);

  // Live guardrail validation: bounds move with playerCount, so clamp
  // whenever it shrinks below the current selection rather than only at
  // submit time. mafiaCount is clamped first, then doctorCount against
  // whatever mafiaCount now is — clamping them independently could leave
  // mafiaCount + doctorCount over the limit even though each looks valid
  // on its own.
  useEffect(() => {
    setImpostorCount((prev) => clamp(prev, 1, playerCount - 1));
    setMafiaCount((prevMafia) => {
      const nextMafia = clamp(prevMafia, 1, playerCount - 1);
      setDoctorCount((prevDoctor) => clamp(prevDoctor, 0, playerCount - 1 - nextMafia));
      return nextMafia;
    });
  }, [playerCount]);

  const mafiaMax = Math.max(1, playerCount - 1 - doctorCount);
  const doctorMax = Math.max(0, playerCount - 1 - mafiaCount);

  const packs = useMemo(
    () => (mode === 'mafia' ? [] : getPacksByMode(mode)),
    [mode]
  );

  useEffect(() => {
    if (mode === 'mafia') {
      setSelectedPackId(null);
      return;
    }
    if (!packs.some((p) => p.id === selectedPackId)) {
      setSelectedPackId(packs[0]?.id ?? null);
    }
  }, [mode, packs, selectedPackId]);

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

        {mode !== 'mafia' && (
          <View style={styles.packList}>
            <Text style={styles.sectionLabel}>Pack</Text>
            {packs.map((pack) => (
              <Pressable
                key={pack.id}
                onPress={() => setSelectedPackId(pack.id)}
                style={[
                  styles.packRow,
                  pack.id === selectedPackId && styles.packRowActive,
                ]}
              >
                <Text
                  style={[
                    styles.packName,
                    pack.id === selectedPackId && styles.packNameActive,
                  ]}
                >
                  {pack.name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {mode === 'mafia' ? (
          <View>
            <Text style={styles.sectionLabel}>Counts</Text>
            <Stepper
              label="Mafia"
              value={mafiaCount}
              min={1}
              max={mafiaMax}
              onChange={setMafiaCount}
            />
            <Stepper
              label="Doctors"
              value={doctorCount}
              min={0}
              max={doctorMax}
              onChange={setDoctorCount}
            />
          </View>
        ) : (
          <View>
            <Text style={styles.sectionLabel}>Counts</Text>
            <Stepper
              label="Impostors"
              value={impostorCount}
              min={1}
              max={Math.max(1, playerCount - 1)}
              onChange={setImpostorCount}
            />
          </View>
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
  sectionLabel: {
    fontFamily: theme.fontFamily.sansMedium,
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
    marginTop: 8,
  },
  packList: {
    gap: 8,
  },
  packRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.hairline,
    backgroundColor: theme.colors.card,
  },
  packRowActive: {
    borderColor: theme.colors.terracotta,
    backgroundColor: theme.colors.terracottaTint,
  },
  packName: {
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.base,
    color: theme.colors.ink,
  },
  packNameActive: {
    fontFamily: theme.fontFamily.sansSemiBold,
    color: theme.colors.terracottaPressed,
  },
});
