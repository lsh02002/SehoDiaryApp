import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

export const TwoDiv = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => <View style={[styles.row, style]}>{children}</View>;

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
});
