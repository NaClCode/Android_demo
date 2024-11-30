import { DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
        <Provider store={store}>
          <ThemeProvider value={ DarkTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ 
                headerShown: false,
              }} /> 
              <Stack.Screen name="setting" options={{
                headerShown: false,
              }}/>
              <Stack.Screen name="login" options={{
                headerShown: false,
              }}/>
              <Stack.Screen name="register" options={{
                headerShown: false,
              }}/>
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
      </Provider>
  );
}