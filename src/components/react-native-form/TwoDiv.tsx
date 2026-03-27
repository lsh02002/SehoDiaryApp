import React from 'react';
import { View, StyleSheet } from 'react-native';

type TwoDivProps = {
  children: React.ReactNode;
};

export const TwoDiv = ({ children }: TwoDivProps) => {
  const childArray = React.Children.toArray(children);

  return (
    <View style={styles.row}>
      <View style={styles.col}>{childArray[0] ?? null}</View>
      <View style={styles.col}>{childArray[1] ?? null}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 12,
    columnGap: 12,
  },
  col: {
    flex: 1,
    minWidth: 0,
  },
});