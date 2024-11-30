import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Alert, Button, Linking } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { baseurl } from "@/hooks/url";
import * as SecureStore from 'expo-secure-store';

export default function CompetitionIntro() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);

  const getToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        Alert.alert('未登录', '请先登录以进行修改');
        router.push('/login');
        return;
      }
      return token;
    } catch (error) {
      console.error('获取Token失败:', error);
      return null;
    }
  };

  const loadCompetitions = async () => {
    const token = await getToken();
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(baseurl + 'competition/intro', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    if (response.status === 401) {
      Alert.alert('未登录', '请先登录以进行修改');
      router.push('/login'); 
      return;
    }else{
      const data = await response.json();
      setCompetitions(data.data);
      setLoading(false);
    }
   
    } catch (error) {
      console.error('加载竞赛数据失败:', error);
      setError('加载竞赛数据失败');
      setLoading(false);
      Alert.alert('错误', '加载竞赛数据失败，请稍后再试');
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadCompetitions();
    setRefreshing(false);
  };

  useEffect(() => {
    loadCompetitions();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>正在加载竞赛数据...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>加载失败，请稍后再试</Text>
      </View>
    );
  }

  if (competitions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>没有竞赛数据</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={competitions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Image 
              source={{ uri: `${baseurl}source/${item.img}` }}
              style={styles.image} 
            />
            <View style={styles.details}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.own}>主办方: {item.own}</Text>
              <Text style={styles.url} onPress={() => Linking.openURL(item.url)}>点击访问官网</Text>
            </View>
          </View>
        )}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        onRefresh={refreshData}
        refreshing={refreshing}
      />
    </View>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#f9f9f9',
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginVertical: 5,
      marginHorizontal: 10,
      backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
      borderColor: isDarkMode ? '#2a2a2a' : '#ddd',
      borderWidth: 1,
      borderRadius: 8,
      shadowColor: isDarkMode ? '#000' : '#ccc',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: isDarkMode ? '#333' : '#ddd',
    },
    details: {
      flex: 1,
      marginLeft: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#f5f5f5' : '#333',
    },
    own: {
      fontSize: 14,
      marginTop: 4,
      color: isDarkMode ? '#aaaaaa' : '#777',
    },
    url: {
      fontSize: 14,
      color: '#1e90ff',
      marginTop: 8,
      textDecorationLine: 'underline',
    },
    loadingText: {
      fontSize: 18,
      color: '#888',
      textAlign: 'center',
      marginTop: 20,
    },
    errorText: {
      fontSize: 18,
      color: 'red',
      textAlign: 'center',
      marginTop: 20,
    }
  });