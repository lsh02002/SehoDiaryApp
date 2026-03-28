import Toast from "react-native-root-toast";

export type ToastType = "success" | "error" | "info" | "warning";

let activeToast: any = null;
let activeMessage = "";

const getToastStyle = (type: ToastType) => {
  switch (type) {
    case "success":
      return {
        backgroundColor: "#198754",
        textColor: "#ffffff",
      };
    case "error":
      return {
        backgroundColor: "#dc3545",
        textColor: "#ffffff",
      };
    case "warning":
      return {
        backgroundColor: "#ffc107",
        textColor: "#212529",
      };
    case "info":
      return {
        backgroundColor: "#0dcaf0",
        textColor: "#ffffff",
      };
    default:
      return {
        backgroundColor: "#333333",
        textColor: "#ffffff",
      };
  }
};

export const showToast = (
  message: string,
  type: ToastType = "error"
) => {
  if (activeMessage === message) return;

  if (activeToast) {
    Toast.hide(activeToast);
    activeToast = null;
    activeMessage = "";
  }

  const { backgroundColor, textColor } = getToastStyle(type);

  activeMessage = message;

  activeToast = Toast.show(message, {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    shadow: false,
    animation: true,
    hideOnPress: true,
    delay: 0,
    backgroundColor,
    textColor,
    containerStyle: {
      width: "90%",
      minHeight: 56,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      justifyContent: "center",
    },
    textStyle: {
      fontSize: 16,
      fontWeight: "500",
    },
    onHidden: () => {
      activeToast = null;
      activeMessage = "";
    },
  });
};

export const hideToast = () => {
  if (activeToast) {
    Toast.hide(activeToast);
    activeToast = null;
    activeMessage = "";
  }
};