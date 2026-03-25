import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export const useSensoryTheme = () => {
  const isFocused = useIsFocused();
  const [isSoftMode, setIsSoftMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const savedMode = await AsyncStorage.getItem('softMode');
      setIsSoftMode(savedMode === 'true');
    };
    if (isFocused) loadTheme();
  }, [isFocused]);

  // Define your theme colors here in one central place
  const theme = {
    background: isSoftMode ? '#FDFBF0' : '#FFFFFF',
    text: isSoftMode ? '#4A4A4A' : '#000000',
    card: isSoftMode ? '#F9F9F9' : '#FFFFFF',
    isSoftMode // Export the boolean too just in case
  };

  return theme;
};