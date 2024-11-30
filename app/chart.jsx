import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ChartExample() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const screenWidth = Dimensions.get('window').width;
  const styles = getStyles(isDarkMode);

  const barData = {
    labels: ['全国数模', '美国数模', '计设', '市调分析'],
    datasets: [
      {
        data: [46, 57, 81, 23],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const barData1 = {
    labels: ['ACM', '挑战杯', '软件杯', '智能汽车'],
    datasets: [
      {
        data: [2, 10, 15, 27],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: styles.chart.backgroundColor,
    backgroundGradientFrom: styles.chart.backgroundGradientFrom,
    backgroundGradientTo: styles.chart.backgroundGradientTo,
    decimalPlaces: 2, 
    color: (opacity = 1) => styles.chart.textColor(opacity),
    labelColor: (opacity = 1) => styles.chart.labelColor(opacity),
    style: {
      borderRadius: 16,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>比赛人数</Text>
      <BarChart
        data={barData}
        width={screenWidth - 40} 
        height={220}
        chartConfig={chartConfig}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

      <BarChart
        data={barData1}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

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
    chart: {
      backgroundColor: isDarkMode ? '#333333' : '#ffffff',
      backgroundGradientFrom: isDarkMode ? '#222222' : '#f5f5f5',
      backgroundGradientTo: isDarkMode ? '#333333' : '#ffffff',
      textColor: (opacity = 1) =>
        `rgba(${isDarkMode ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
      labelColor: (opacity = 1) =>
        `rgba(${isDarkMode ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    },
  });
