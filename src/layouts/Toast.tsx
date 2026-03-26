import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Toast, {
  BaseToastProps,
  ToastConfig,
} from "react-native-toast-message";

const ToastItem = ({
  text1,  
  backgroundColor,
  textColor,
}: {
  text1?: string;  
  backgroundColor: string;
  textColor: string;
}) => {
  return (
    <View style={[styles.toastContainer, { backgroundColor }]}>
      <Text style={[styles.message, { color: textColor }]} numberOfLines={2}>
        {text1}
      </Text>

      <Pressable onPress={()=>Toast.hide()} hitSlop={8} style={styles.closeButton}>
        <Text style={[styles.closeText, { color: textColor }]}>×</Text>
      </Pressable>
    </View>
  );
};

export const toastConfig: ToastConfig = {
  success: (props: BaseToastProps) => (
    <ToastItem
      text1={props.text1}      
      backgroundColor="#198754"
      textColor="#ffffff"
    />
  ),
  error: (props: BaseToastProps) => (
    <ToastItem
      text1={props.text1}      
      backgroundColor="#dc3545"
      textColor="#ffffff"
    />
  ),
  warning: (props: BaseToastProps) => (
    <ToastItem
      text1={props.text1}      
      backgroundColor="#ffc107"
      textColor="#212529"
    />
  ),
  info: (props: BaseToastProps) => (
    <ToastItem
      text1={props.text1}      
      backgroundColor="#0dcaf0"
      textColor="#ffffff"
    />
  ),
};

export const ReactNativeToast = () => {
  return (
    <Toast
      config={toastConfig}
      position="bottom"
      bottomOffset={100}
    />
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    minHeight: 56,
    width: "90%",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 40,
    justifyContent: "center",
    alignSelf: "center",
    position: "relative",
  },
  message: {
    fontSize: 16,
    fontWeight: "500",
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 20,
  },
});