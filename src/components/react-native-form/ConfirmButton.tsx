import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../themes/theme';

type Props = {
  disabled?: boolean;
  title: string;
  onPress: () => void;
};

const ConfirmButton = ({ disabled, title, onPress }: Props) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginTop: 16,
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  text: { color: 'white', fontSize: 16, fontWeight: '700' },
  disabled: { opacity: 0.5 },
  pressed: { transform: [{ scale: 0.99 }] },
});

export default ConfirmButton;
