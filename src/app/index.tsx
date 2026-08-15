import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';

import { theme } from '@/theme';

// /setup, /settings, /about don't exist yet (future stages) — Expo Router's
// typedRoutes would reject these strings at compile time, so they're cast
// until those routes land. Tapping through currently hits +not-found.
const SETUP_HREF = '/setup' as any;
const SETTINGS_HREF = '/settings' as any;
const ABOUT_HREF = '/about' as any;

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Imposter</Text>

        <Pressable
          style={({ pressed }) => [
            styles.playButton,
            pressed && styles.playButtonPressed,
          ]}
          onPress={() => router.push(SETUP_HREF)}
        >
          <Text style={styles.playButtonLabel}>Play</Text>
        </Pressable>

        <View style={styles.secondaryLinks}>
          <Link href={SETTINGS_HREF} style={styles.secondaryLink}>
            Settings
          </Link>
          <Link href={ABOUT_HREF} style={styles.secondaryLink}>
            About
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.canvas,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: theme.fontFamily.serifBold,
    fontSize: theme.fontSize.xxl,
    color: theme.colors.ink,
  },
  playButton: {
    backgroundColor: theme.colors.terracotta,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  playButtonPressed: {
    backgroundColor: theme.colors.terracottaPressed,
  },
  playButtonLabel: {
    fontFamily: theme.fontFamily.sansSemiBold,
    fontSize: theme.fontSize.lg,
    color: theme.colors.card,
  },
  secondaryLinks: {
    flexDirection: 'row',
    gap: 24,
  },
  secondaryLink: {
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
  },
});
