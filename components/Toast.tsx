import { BaseToast, ErrorToast, BaseToastProps } from "react-native-toast-message";

export const getToastConfig = (isDarkMode: boolean) => ({
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: isDarkMode ? "#4caf50" : "#28a745",
        backgroundColor: isDarkMode ? "#1e1e1e" : "#f0f0f0",
      }}
      text1Style={{
        color: isDarkMode ? "#fff" : "#333",
      }}
      text2Style={{
        color: isDarkMode ? "#aaa" : "#666",
      }}
    />
  ),
  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: isDarkMode ? "#f44336" : "#dc3545",
        backgroundColor: isDarkMode ? "#1e1e1e" : "#f0f0f0",
      }}
      text1Style={{
        color: isDarkMode ? "#fff" : "#333",
      }}
      text2Style={{
        color: isDarkMode ? "#aaa" : "#666",
      }}
    />
  ),
});
