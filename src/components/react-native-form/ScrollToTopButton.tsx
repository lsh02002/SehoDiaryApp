import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../themes/theme';

type Props = {
  disabled?: boolean;
  onPress: () => void;
};

const ScrollToTopButton = ({ disabled, onPress }: Props) => {
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
      <Text style={styles.text}>↑</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 30,
    bottom: 100, // 🔥 AddDiaryButton(30)보다 크게!
    zIndex: 200,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.info,
    elevation: 4,
  },
  text: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  disabled: { opacity: 0.5 },
  pressed: { transform: [{ scale: 0.97 }] },
});

export default ScrollToTopButton;