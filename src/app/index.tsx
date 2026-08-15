// Throwaway theme QA screen — not a real app screen. Shows every colour
// token and both loaded font families so the palette/type can be eyeballed
// before any real screens are built. Delete once real screens exist.
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/theme';
import type { ColorToken } from '@/theme';

const SWATCH_NOTES: Partial<Record<ColorToken, string>> = {
  oxblood: 'impostor-reveal only',
};

const swatchOrder: ColorToken[] = [
  'canvas',
  'card',
  'sunken',
  'ink',
  'muted',
  'hairline',
  'terracotta',
  'terracottaPressed',
  'terracottaTint',
  'moss',
  'ochre',
  'oxblood',
];

export default function ThemeDemoScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Theme demo</Text>
        <Text style={styles.subheading}>Colour tokens</Text>
        {swatchOrder.map((token) => (
          <View key={token} style={styles.swatchRow}>
            <View
              style={[
                styles.swatchBlock,
                { backgroundColor: theme.colors[token] },
              ]}
            />
            <View style={styles.swatchLabel}>
              <Text style={styles.swatchName}>{token}</Text>
              <Text style={styles.swatchHex}>{theme.colors[token]}</Text>
              {SWATCH_NOTES[token] && (
                <Text style={styles.swatchNote}>{SWATCH_NOTES[token]}</Text>
              )}
            </View>
          </View>
        ))}

        <Text style={styles.subheading}>Typography — serif (Fraunces)</Text>
        <Text
          style={[
            styles.sample,
            {
              fontFamily: theme.fontFamily.serifBold,
              fontSize: theme.fontSize.xxl,
            },
          ]}
        >
          Who is the impostor?
        </Text>
        <Text
          style={[
            styles.sample,
            {
              fontFamily: theme.fontFamily.serif,
              fontSize: theme.fontSize.lg,
            },
          ]}
        >
          A round of deduction and doubt.
        </Text>

        <Text style={styles.subheading}>Typography — sans (Inter)</Text>
        <Text
          style={[
            styles.sample,
            {
              fontFamily: theme.fontFamily.sansMedium,
              fontSize: theme.fontSize.base,
            },
          ]}
        >
          Pass the device to the next player.
        </Text>
        <Text
          style={[
            styles.sample,
            {
              fontFamily: theme.fontFamily.sans,
              fontSize: theme.fontSize.sm,
            },
          ]}
        >
          Tap to reveal your role, then pass discreetly.
        </Text>
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
    gap: 8,
  },
  heading: {
    fontFamily: theme.fontFamily.serifBold,
    fontSize: theme.fontSize.xxl,
    color: theme.colors.ink,
    marginBottom: 8,
  },
  subheading: {
    fontFamily: theme.fontFamily.sansSemiBold,
    fontSize: theme.fontSize.lg,
    color: theme.colors.ink,
    marginTop: 20,
    marginBottom: 8,
  },
  swatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.hairline,
  },
  swatchBlock: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.hairline,
  },
  swatchLabel: {
    flex: 1,
  },
  swatchName: {
    fontFamily: theme.fontFamily.sansMedium,
    fontSize: theme.fontSize.base,
    color: theme.colors.ink,
  },
  swatchHex: {
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
  },
  swatchNote: {
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.xs,
    color: theme.colors.oxblood,
  },
  sample: {
    color: theme.colors.ink,
    marginBottom: 4,
  },
});
