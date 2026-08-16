import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/theme';

interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}

export function Stepper({ label, value, min, max, onChange }: StepperProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.controls}>
        <Pressable
          disabled={!canDecrement}
          onPress={() => onChange(value - 1)}
          style={[styles.button, !canDecrement && styles.buttonDisabled]}
        >
          <Text style={styles.buttonLabel}>−</Text>
        </Pressable>
        <Text style={styles.value}>{value}</Text>
        <Pressable
          disabled={!canIncrement}
          onPress={() => onChange(value + 1)}
          style={[styles.button, !canIncrement && styles.buttonDisabled]}
        >
          <Text style={styles.buttonLabel}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  label: {
    fontFamily: theme.fontFamily.sansMedium,
    fontSize: theme.fontSize.base,
    color: theme.colors.ink,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: theme.colors.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonLabel: {
    fontFamily: theme.fontFamily.sansSemiBold,
    fontSize: theme.fontSize.lg,
    color: theme.colors.ink,
  },
  value: {
    fontFamily: theme.fontFamily.sansSemiBold,
    fontSize: theme.fontSize.base,
    color: theme.colors.ink,
    minWidth: 20,
    textAlign: 'center',
  },
});
