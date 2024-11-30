import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const loadTheme = createAsyncThunk('theme/loadTheme', async () => {
  const storedTheme = await AsyncStorage.getItem('theme'); 
  return storedTheme || 'light'; 
});

export const saveTheme = createAsyncThunk('theme/saveTheme', async (theme) => {
  await AsyncStorage.setItem('theme', theme);
  return theme;
});

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    currentTheme: 'light', 
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadTheme.pending, (state) => {
        state.status = 'loading'; 
      })
      .addCase(loadTheme.fulfilled, (state, action) => {
        state.status = 'succeeded'; 
        state.currentTheme = action.payload; 
      })
      .addCase(loadTheme.rejected, (state) => {
        state.status = 'failed'; 
      })
      .addCase(saveTheme.fulfilled, (state, action) => {
        state.currentTheme = action.payload; 
      });
  },
});

const themeReducer = themeSlice.reducer;

export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});

export const useColorScheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.currentTheme); 

  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  return theme;
};

export const setThemePreference = async (theme) => {
  try {
    await AsyncStorage.setItem('theme', theme);
    console.log('主题设置已保存:', theme);
  } catch (error) {
    console.error('保存主题设置失败:', error);
  }
};
