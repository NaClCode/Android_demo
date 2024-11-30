import { IconSymbol } from "@/components/ui/IconSymbol";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { getToastConfig } from "@/components/Toast";
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from "react-native";
import Toast from "react-native-toast-message";
import {baseurl} from "@/hooks/url";

export default function Register() {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const styles = createStyles(isDarkMode);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("错误", "请填写所有字段");
      return;
    }

    const requestBody = {
      username,
      email,
      password
    };

    try {
      const response = await fetch(baseurl + 'user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log(response)

      if (response.ok) {
        Alert.alert("注册成功", `欢迎，${username}！`);
        router.replace('/login');
      } else {
        const errorData = await response.json();
        Alert.alert("注册失败", errorData.message || "发生错误，请稍后重试。");
      }
    } catch (error) {
      console.error('注册请求失败:', error);
      Alert.alert("网络错误", "请检查网络连接，稍后重试。");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <IconSymbol size={150} name="person" color={isDarkMode ? '#f5f5f5' : '#121212'} />
        <Text style={styles.title}>创建账户</Text>
        <Text style={styles.subtitle}>开始您的旅程</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="姓名"
            placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
            value={username}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="邮箱"
            placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="密码"
            placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>注册</Text>
        </TouchableOpacity>

        <View style={styles.bottomSection}>
          <Text style={styles.bottomText}>
            已有账户?{" "}
            <Link href='/login' style={styles.linkText}>登录</Link>
          </Text>
        </View>
      </ScrollView>
      <Toast config={getToastConfig(isDarkMode)} />
    </KeyboardAvoidingView>
  );
}

const createStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#121212" : "#f7f7f7",
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#333",
    },
    subtitle: {
      fontSize: 16,
      color: isDarkMode ? "#aaa" : "#666",
      marginVertical: 10,
    },
    inputContainer: {
      width: "100%",
      marginTop: 20,
    },
    input: {
      backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
      color: isDarkMode ? "#fff" : "#333",
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      fontSize: 16,
      borderWidth: 1,
      borderColor: isDarkMode ? "#333" : "#ddd",
      shadowColor: isDarkMode ? "#000" : "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 3,
    },
    button: {
      backgroundColor: isDarkMode ? "#3498db" : "#3498db",
      padding: 15,
      borderRadius: 10,
      width: "100%",
      alignItems: "center",
      marginVertical: 20,
      shadowColor: isDarkMode ? "#4caf50" : "#3498db",
      shadowOpacity: 0.4,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      elevation: 5,
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    bottomSection: {
      marginTop: 20,
      alignItems: "center",
    },
    bottomText: {
      fontSize: 14,
      color: isDarkMode ? "#aaa" : "#666",
    },
    linkText: {
      color: isDarkMode ? "#4f9efd" : "#3498db",
      fontWeight: "bold",
    },
  });
