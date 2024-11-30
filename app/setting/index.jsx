import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Switch} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import {useColorScheme, setThemePreference} from '@/hooks/useColorScheme'

export default function Settings() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const [cacheCleared, setCacheCleared] = useState(false);


  const handleTheme = (theme) => {
    setThemePreference(theme);
    router.replace('/')
  }
  const clearSecureStore = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userEmail');
      await SecureStore.deleteItemAsync('userPreferences');
      console.log('SecureStore 数据已清除');
    } catch (error) {
      console.error('清除 SecureStore 数据时出错:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      '退出账号',
      '确定要退出账号吗？此操作将清除缓存',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            setTimeout(() => {
              clearSecureStore();
              router.replace('/user');
            }, 1000);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleClearCache = () => {
    setCacheCleared(false);
    setTimeout(() => {
      setCacheCleared(true);
      Alert.alert('提示', '缓存已清除');
    }, 1000);
  };

  const handleUpdateCheck = () => {
    Alert.alert('提示', '已经是最新版本！');
  };

  const isDarkMode = systemColorScheme === 'dark';
  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>设置选项</Text>

      <TouchableOpacity style={styles.item} onPress={handleLogout}>
        <Text style={styles.itemText}>退出账号</Text>
      </TouchableOpacity>

      <View style={styles.item}>
        <Text style={styles.itemText}>颜色模式</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.modeButton, systemColorScheme === 'dark' && styles.activeButton]}
            onPress={() => {handleTheme('dark')}}
          >
            <Text style={[styles.buttonText, systemColorScheme === 'dark' && styles.activeButtonText]}>
              黑色
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, systemColorScheme === 'light' && styles.activeButton]}
            onPress={() => handleTheme('light')}
          >
            <Text style={[styles.buttonText, systemColorScheme === 'light' && styles.activeButtonText]}>
              白色
            </Text>
          </TouchableOpacity>
          
        </View>
      </View>

      <TouchableOpacity style={styles.item} onPress={handleUpdateCheck}>
        <Text style={styles.itemText}>检测更新</Text>
      </TouchableOpacity>

      <View style={styles.item}>
        <Text style={styles.itemText}>清除缓存</Text>
        <Switch
          value={cacheCleared}
          onValueChange={handleClearCache}
          trackColor={{ false: '#ccc', true: '#007aff' }}
        />
      </View>
    </View>
  );
}

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    header: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: isDarkMode ? '#f5f5f5' : '#333',
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#444' : '#ddd',
    },
    itemText: {
      fontSize: 16,
      color: isDarkMode ? '#f5f5f5' : '#333',
    },
    buttonGroup: {
      flexDirection: 'row',
    },
    modeButton: {
      padding: 8,
      borderWidth: 1,
      borderColor: isDarkMode ? '#555' : '#ddd',
      borderRadius: 4,
      marginHorizontal: 4,
    },
    activeButton: {
      backgroundColor: '#007aff',
      borderColor: '#007aff',
    },
    buttonText: {
      fontSize: 14,
      color: isDarkMode ? '#aaa' : '#333',
    },
    activeButtonText: {
      color: '#fff',
    },
  });
