import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Link, router } from "expo-router";
import Toast from "react-native-toast-message";
import { getToastConfig } from "@/components/Toast";
import { useColorScheme } from '@/hooks/useColorScheme';
import {baseurl} from "@/hooks/url";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);  
  const [username, setUsername] = useState(""); 

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const styles = createStyles(isDarkMode);

  const saveToSecureStore = async (key, value) => {
    try {
      await SecureStore.setItemAsync(key, value);
      console.log(`Saved ${key} to SecureStore.`);
    } catch (error) {
      console.error("Failed to save data to SecureStore:", error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "错误",
        text2: "请输入有效的邮箱和密码。",
      });
      return;
    }

    const requestBody = {
      email,
      password,
    };

    try {
      const response = await fetch(baseurl + 'user/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (response.ok) {
        const data = await response.json();
        const { token, userID, username, email, avatar} = data;
        await saveToSecureStore("userToken", token);
        await saveToSecureStore("userID", String(userID));
        await saveToSecureStore("username", username);
        await saveToSecureStore("userEmail", email);
        await saveToSecureStore("userAvatar", avatar);
        setUsername(username);
        setAvatar(avatar);

        Toast.show({
          type: "success",
          text1: "登录成功",
          text2: `欢迎，${username}!`,
        });

        router.replace("/user");
      } else {
        const errorData = await response.json();
        Toast.show({
          type: "error",
          text1: "登录失败",
          text2: errorData.message || "发生错误，请重试。",
        });
      }
    } catch (error) {
      console.error('登录请求失败:', error);
      Toast.show({
        type: "error",
        text1: "错误",
        text2: "登录失败，请重试。",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
  
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        }}
        style={styles.logo}
      />

      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>登录你的账户</Text>

      {avatar && username && (
        <View style={styles.userInfoContainer}>
          <Image
            source={{ uri: avatar }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{username}</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>登录</Text>
      </TouchableOpacity>
      
      <View style={styles.bottomSection}>
        <Text style={styles.bottomText}>
          没有账户? <Link href='/register' style={styles.linkText}>注册</Link>
        </Text>
      </View>

      <Toast config={getToastConfig(isDarkMode)} />
    </KeyboardAvoidingView>
  );
}

const createStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#121212" : "#f7f7f7",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 20,
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
      shadowColor: isDarkMode ? "#3498db" : "#3498db",
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
    userInfoContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    username: {
      fontSize: 18,
      color: isDarkMode ? "#fff" : "#333",
      fontWeight: "bold",
    },
  });
