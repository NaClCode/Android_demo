import React, { useState,} from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import {StyleSheet} from 'react-native';
import CompetitionIntro from '../intro'
import ChartExample from '../chart';
import ChatWithModel from '../ai';
import Signup from '../signup'

export default function CompetitionPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);

  const renderContent = () => {
    switch (activeIndex) {
      case 0:
        return (
          <CompetitionIntro/>
        );
      case 1:
        return (
          <Signup/>
        );
      case 2:
        return (
          <ChartExample/>
        );
      case 3:
        return (
          <ChatWithModel/>
        )
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.tabsContainer}>
        {['介绍', '报名', '分析', 'AI'].map((title, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tab,
              activeIndex === index && styles.activeTab,
            ]}
            onPress={() => setActiveIndex(index)}
          >
            <Text style={activeIndex === index ? styles.activeTabText : styles.tabText}>
              {title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>
    </View>
  );
}

const getStyles = (isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#000' : '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDarkMode ? '#333' : '#f9f9f9',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: isDarkMode ? '#fff' : '#007bff',
  },
  tabText: {
    fontSize: 16,
    color: isDarkMode ? '#aaa' : '#555',
  },
  activeTabText: {
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#007bff',
  },
  content: {
    padding: 0,
    flex: 1
  },
  card: {
    padding: 0,
    marginVertical: 0,
    backgroundColor: isDarkMode ? '#222' : '#f9f9f9',
    borderRadius: 8,
    shadowColor: isDarkMode ? '#000' : '#ccc',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDarkMode ? '#fff' : '#000',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: isDarkMode ? '#aaa' : '#333',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: isDarkMode ? '#007bff' : '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
