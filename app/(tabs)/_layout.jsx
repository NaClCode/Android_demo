import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, Alert, Linking } from 'react-native';
import { Tabs, router } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { baseurl } from '@/hooks/url';
import * as SecureStore from 'expo-secure-store';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [searchValue, setSearchValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const loadCompetitions = async (query) => {
    const token = await getToken();
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(baseurl + 'competition/intro', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        Alert.alert('未登录', '请先登录以进行修改');
        router.push('/login');
        return;
      }

      const data = await response.json();

      // Apply fuzzy search logic
      const filteredResults = query
        ? data.data.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
          )
        : [];

      setSearchResults(filteredResults);
      setLoading(false);
    } catch (error) {
      console.error('加载竞赛数据失败:', error);
      setError('加载竞赛数据失败');
      setLoading(false);
      Alert.alert('错误', '加载竞赛数据失败，请稍后再试');
    }
  };

  const handleSearch = (query) => {
    setSearchValue(query);
    if (query.length > 0) {
      loadCompetitions(query);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <TouchableOpacity
            style={styles.customInput}
            onPress={() => setIsModalVisible(true)}
          >
            <IconSymbol size={25} name="search" color={isDarkMode ? '#f5f5f5' : '#121212'} />
            <Text style={[styles.inputField, { color: isDarkMode ? '#aaa' : '#888' }]}>
              搜索...
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.navButton} onPress={() => router.replace('/setting')}>
            <IconSymbol size={30} name="settings" color={isDarkMode ? '#f5f5f5' : '#121212'} />
          </TouchableOpacity>
        </View>
      </View>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors['dark'].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="comment"
          options={{
            title: '讨论',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="comment" color={color} />,
          }}
        />
        <Tabs.Screen
          name="user"
          options={{
            title: '用户',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,
          }}
        />
      </Tabs>
      {/* Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={[styles.container, { paddingTop: 0 }]}>
          <View style={styles.modalHeader}>
            <IconSymbol
              size={25}
              name="arrow-back"
              color={isDarkMode ? '#f5f5f5' : '#121212'}
              onPress={() => setIsModalVisible(false)}
            />
            <TextInput
              style={styles.inputField}
              value={searchValue}
              onChangeText={handleSearch}
              placeholder="搜索..."
              placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
              autoFocus
            />
          </View>
          {loading ? (
            <Text style={{ textAlign: 'center', marginTop: 20, color: isDarkMode ? '#aaa' : '#000' }}>
              加载中...
            </Text>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.resultItem}>
                  <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>{item.name}</Text>
                  <Text style={{ color: isDarkMode ? '#88f' : '#000' }} onPress={() => Linking.openURL(item.url)}>{item.url}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={{ color: isDarkMode ? '#aaa' : '#888', textAlign: 'center', marginTop: 20 }}>
                  No results found
                </Text>
              }
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#ffffff',
    },
    navBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
      paddingHorizontal: 16,
      paddingVertical: 10,
      marginTop: 25,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#444' : '#ddd',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDarkMode ? '#444' : '#ddd',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: isDarkMode ? '#fff' : '#000',
      fontWeight: 'bold',
    },
    searchBox: {
      flex: 1,
      marginHorizontal: 10,
      
    },
    customInput: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#121212' : '#f9f9f9',
      borderRadius: 20,
      borderWidth: 1,
      marginLeft: 20,
      borderColor: isDarkMode ? '#444' : '#ddd',
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    inputField: {
      flex: 1,
      marginLeft: 8,
      color: isDarkMode ? '#fff' : '#000',
      fontSize: 16,
    },
    navButtons: {
      flexDirection: 'row',
    },
    navButton: {
      marginLeft: 10,
      padding: 0,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#444' : '#ddd',
    },
    resultItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#444' : '#ddd',
    },
  });
