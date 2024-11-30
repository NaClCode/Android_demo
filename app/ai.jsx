import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { baseurl } from '@/hooks/url';
import * as SecureStore from 'expo-secure-store';
import { saveMessage, getChatHistory } from '@/hooks/sql'; 

export default function ChatWithModel() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const styles = getStyles(isDarkMode);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    
    const loadChatHistory = async () => {
      const history = await getChatHistory();
      setChatHistory(history);
    };
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatHistory]);

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

  const handleSend = async () => {
    const token = await getToken();

    if (!token) return;

    const userMessage = { sender: 'user', text: inputText };
    setChatHistory((prev) => [...prev, userMessage]);
    
    setIsLoading(true);
    
    try {
      const response = await fetch(baseurl + 'ai/talk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ input: inputText }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
     
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid response format: expected an array.');

      let fullMessage = '';
      for (const chunk of data) {
        if (chunk.data === 'END') break;
        fullMessage += chunk.data;
      }

      if (fullMessage) {
        const modelMessage = { sender: 'model', text: fullMessage };
        setChatHistory((prev) => [...prev, modelMessage]);
        await saveMessage('user', inputText); 
        await saveMessage('model', fullMessage);
      }
    } catch (error) {
      console.error('Error during request:', error);
      const errorMessage = { sender: 'model', text: '抱歉，发生了错误。' };
      setChatHistory((prev) => [...prev, errorMessage]);
      await saveMessage('model', '抱歉，发生了错误。'); 
    } finally {
      setIsLoading(false);
    }

    setInputText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI 智能咨询比赛</Text>
      <ScrollView style={styles.chatContainer} ref={scrollViewRef}>
        {chatHistory.map((message, index) => (
          <View
            key={index}
            style={[
              styles.message,
              message.sender === 'user' ? styles.userMessage : styles.modelMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={isDarkMode ? '#fff' : '#000'} />
            <Text style={[styles.loadingText, { color: isDarkMode ? '#fff' : '#000' }]}>
              正在加载...
            </Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="您的问题..."
          placeholderTextColor={isDarkMode ? '#888' : '#ccc'}
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title="发送" onPress={handleSend} />
      </View>
    </View>
  );
}

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDarkMode ? '#121212' : '#ffffff',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 10,
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    chatContainer: {
      flex: 1,
      marginBottom: 10,
    },
    message: {
      padding: 10,
      marginVertical: 5,
      borderRadius: 8,
      maxWidth: Dimensions.get('window').width * 0.8,
    },
    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: isDarkMode ? '#444' : '#e6f7ff',
    },
    modelMessage: {
      alignSelf: 'flex-start',
      backgroundColor: isDarkMode ? '#333' : '#f2f2f2',
    },
    messageText: {
      color: isDarkMode ? '#fff' : '#000',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: isDarkMode ? '#888' : '#ccc',
      borderRadius: 8,
      padding: 10,
      marginRight: 10,
      color: isDarkMode ? '#fff' : '#000',
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
    },
    loadingText: {
      marginLeft: 10,
      fontSize: 14,
    },
  });
