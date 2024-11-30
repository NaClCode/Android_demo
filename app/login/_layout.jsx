import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import Settings from './index';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { BackHandler} from 'react-native';

export default function LoginLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);
  const router = useRouter();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.replace('/user');
      return true;
    });

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.replace('/')}>
          <IconSymbol size={25} name="arrow-back-ios" color={isDarkMode ? '#f5f5f5' : '#121212'} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>登录</Text>
        <View style={styles.navRight}></View>
      </View>

      <View style={styles.content}>
        <Settings />
      </View>
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
      height: 60,
      marginTop: 25,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#ddd',
      paddingHorizontal: 16,
    },
    navButton: {
      padding: 10,
    },
    navButtonText: {
      fontSize: 20,
      color: isDarkMode ? '#f5f5f5' : '#121212',
    },
    navTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#f5f5f5' : '#121212',
    },
    navRight: {
      width: 30, 
    },
    content: {
      flex: 1,
      padding: 16,
    },
  });
