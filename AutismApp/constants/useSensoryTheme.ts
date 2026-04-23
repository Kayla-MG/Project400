import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

// Default colour for each tool tile
export const DEFAULT_TOOL_COLOURS: { [key: string]: string } = {
  'Visual Calming':    '#56CCF2',
  'Stretch / Move':    '#FFC107',
  'Listen To Music':   '#8A2BE2',
  'Fidget / Squeeze':  '#F9A10A',
  'Countdown / Timer': '#DB2DCD',
};

// Single source of truth for all tools
export const ALL_TOOLS = [
  { name: 'Visual Calming',    icon: 'eye-outline',           actionType: 'visual'  },
  { name: 'Stretch / Move',    icon: 'walk-outline',          actionType: 'stretch' },
  { name: 'Listen To Music',   icon: 'musical-notes-outline', actionType: 'link'    },
  { name: 'Fidget / Squeeze',  icon: 'hand-left-outline',     actionType: 'fidget'  },
  { name: 'Countdown / Timer', icon: 'time-outline',          actionType: 'timer'   },
];

// AsyncStorage keys in one place
export const STORAGE_KEYS = {
  TOOL_COLOURS:  'toolColours',
  ENABLED_TOOLS: 'enabledTools',
};

export const useSensoryTheme = () => {
  const isFocused = useIsFocused();
  const [isSoftMode, setIsSoftMode] = useState(false);
  const [toolColours, setToolColours] = useState<{ [key: string]: string }>(DEFAULT_TOOL_COLOURS);
  const [enabledTools, setEnabledTools] = useState<{ [key: string]: boolean }>(() => {
    const defaults: { [key: string]: boolean } = {};
    ALL_TOOLS.forEach(t => { defaults[t.name] = true; });
    return defaults;
  });

  useEffect(() => {
    const loadTheme = async () => {
      const savedMode    = await AsyncStorage.getItem('softMode');
      const savedColours = await AsyncStorage.getItem(STORAGE_KEYS.TOOL_COLOURS);
      const savedTools   = await AsyncStorage.getItem(STORAGE_KEYS.ENABLED_TOOLS);

      setIsSoftMode(savedMode === 'true');

      if (savedColours) {
        setToolColours({ ...DEFAULT_TOOL_COLOURS, ...JSON.parse(savedColours) });
      }

      if (savedTools) {
        const defaults: { [key: string]: boolean } = {};
        ALL_TOOLS.forEach(t => { defaults[t.name] = true; });
        setEnabledTools({ ...defaults, ...JSON.parse(savedTools) });
      }
    };

    if (isFocused) loadTheme();
  }, [isFocused]);

  return {
    background:  isSoftMode ? '#FDFBF0' : '#FFFFFF',
    text:        isSoftMode ? '#4A4A4A' : '#000000',
    card:        isSoftMode ? '#F9F9F9' : '#FFFFFF',
    isSoftMode,
    toolColours,
    enabledTools,
  };
};