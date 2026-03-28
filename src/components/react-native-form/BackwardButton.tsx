import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../themes/theme';
import { useNavigation } from '@react-navigation/native';

export function BackwardButton() {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => {
        if (navigation.canGoBack()) navigation.goBack();
      }}
      accessibilityLabel="뒤로가기"
      style={styles.button}
    >
      <Text style={styles.icon}>←</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    padding: 12,
  },
  icon: {
    fontSize: 32,
    color: colors.text,
  },
});
