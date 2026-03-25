import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import { Colors } from '@/constants/Colors'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSensoryTheme } from '@/constants/useSensoryTheme'; // Called your custom hook

const { width } = Dimensions.get("window");
const TILE_WIDTH = width / 2 - 30; 
const GRID_PADDING = 15;

// === API Configuration ===
const API_BASE_URL = 'http://192.168.1.45:3000'; 

const MOOD_DATA = [
  { name: "Happy", icon: "happy-outline", color: Colors.green, value: 5, isCrisis: false },
  { name: "Calm", icon: "leaf-outline", color: Colors.blue, value: 4, isCrisis: false },
  { name: "Neutral", icon: "remove-circle-outline", color: Colors.neutral, value: 3, isCrisis: false },
  { name: "Tired", icon: "moon-outline", color: Colors.purple, value: 2, isCrisis: true },
  { name: "Anxious", icon: "help-circle-outline", color: Colors.peach, value: 2, isCrisis: true },
  { name: "Sad", icon: "sad-outline", color: Colors.blue, value: 2, isCrisis: true },
  { name: "Angry", icon: "flame-outline", color: Colors.red, value: 1, isCrisis: true },
  { name: "Overwhelmed", icon: "alert-circle-outline", color: Colors.orange, value: 1, isCrisis: true },
];

const MELTDOWN_DATA = { 
    name: "Crisis", 
    icon: "thunderstorm-outline", 
    color: Colors.red, 
    value: 1, 
    isCrisis: true 
};

const Page = () => {
  const router = useRouter(); 
  const theme = useSensoryTheme(); // CALL: Hook for Soft Mode
  const { top: safeTop } = useSafeAreaInsets();
  
  const [selectedMood, setSelectedMood] = useState<typeof MOOD_DATA[0] | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Load actual User ID from login session
  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setCurrentUserId(id);
    };
    getUserId();
  }, []);

  const sendLogToApi = async (mood: typeof MOOD_DATA[0] | typeof MELTDOWN_DATA, navigated: boolean) => {
    if (!currentUserId) {
        Alert.alert("Error", "User session not found. Please log in again.");
        return;
    }

    setIsLogging(true);
    const isMeltdownForDb = (mood.isCrisis || mood.name === "Crisis") ? 1 : 0;
    
    const logDetails = {
        userId: currentUserId, // Using real ID from AsyncStorage
        feelingName: mood.name,
        severity: mood.value,
        isMeltdown: isMeltdownForDb,
        diaryNotes: "",
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/log/mood`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logDetails),
        });

        if (response.ok) {
            if (!navigated) {
                 Alert.alert('Logged', `Successfully recorded your ${mood.name} feeling.`, [{ text: 'OK' }]);
            }
        } else {
            Alert.alert('Error', 'Server could not save this entry.');
        }
    } catch (error) {
        Alert.alert('Network Error', 'Connection to server failed.');
    } finally {
        setIsLogging(false);
    }
  };

  const checkCrisisAndNavigate = (mood: typeof MOOD_DATA[0] | typeof MELTDOWN_DATA) => {
    if (mood.isCrisis) {
      Alert.alert(
        "Immediate Support?",
        `You feel '${mood.name}'. Need the Calm Now tools?`,
        [
          { text: "Just Log It", onPress: () => sendLogToApi(mood, false) },
          { text: "Yes, Calm Now", onPress: () => {
              sendLogToApi(mood, true); 
              router.push('/calm');
            }, style: 'destructive'
          },
        ]
      );
    } else {
      sendLogToApi(mood, false); 
    }
  };

  // --- Dynamic Styles for Soft Mode ---
  const dynamicBg = theme.background;
  const dynamicTitle = theme.isSoftMode ? '#555' : Colors.blue;
  const dynamicText = theme.text;

  return (
    <View style={[styles.container, { backgroundColor: dynamicBg }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: safeTop + 20 }]}> 
        <Text style={[styles.title, { color: dynamicTitle }]}>Daily Check-In Log</Text>

        {/* 1. CRISIS BUTTON */}
        <View style={styles.crisisContainer}>
          <TouchableOpacity 
            style={[styles.meltdownButton, theme.isSoftMode && { backgroundColor: '#D9534F', elevation: 0 }]}
            onPress={() => checkCrisisAndNavigate(MELTDOWN_DATA)}
            disabled={isLogging}
          >
            {isLogging ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Ionicons name={MELTDOWN_DATA.icon as any} size={40} color={Colors.white} />
            )}
            <Text style={styles.meltdownButtonText}>{MELTDOWN_DATA.name.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionHeader, { color: dynamicText }]}>Log Other Feelings:</Text>

        <View style={styles.grid}>
          {MOOD_DATA.map((m) => {
            const isSelected = selectedMood?.name === m.name;
            const tileBackground = isSelected ? m.color : theme.card;
            const labelColor = isSelected ? Colors.white : (m.isCrisis ? Colors.red : dynamicText);

            return (
              <View key={m.name} style={{width: TILE_WIDTH, marginBottom: 10}}>
                <TouchableOpacity 
                  style={[
                    styles.tile,
                    { 
                      backgroundColor: tileBackground, 
                      borderColor: isSelected ? m.color : (theme.isSoftMode ? '#DDD' : '#EEE'),
                      borderWidth: isSelected ? 3 : 1,
                      elevation: theme.isSoftMode ? 0 : 3
                    }
                  ]} 
                  onPress={() => { setSelectedMood(m); checkCrisisAndNavigate(m); }}
                  disabled={isLogging}
                >
                  <Ionicons name={m.icon as any} size={40} color={isSelected ? Colors.white : m.color} />
                  <Text style={[styles.label, { color: labelColor }]}>{m.name}</Text> 
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 100, alignItems: "center", paddingHorizontal: GRID_PADDING },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 20, textAlign: 'center' },
  sectionHeader: { fontSize: 18, fontWeight: '700', marginBottom: 15, alignSelf: 'flex-start', width: '100%' },
  crisisContainer: { width: '100%', marginBottom: 30, alignItems: 'center' },
  meltdownButton: { width: '95%', backgroundColor: Colors.red, padding: 25, borderRadius: 15, alignItems: 'center', justifyContent: 'center', elevation: 6, flexDirection: 'row', gap: 15 },
  meltdownButtonText: { color: Colors.white, fontSize: 22, fontWeight: '900' },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", width: '100%' },
  tile: { width: TILE_WIDTH, aspectRatio: 1, justifyContent: "center", alignItems: "center", borderRadius: 15 },
  label: { marginTop: 5, fontSize: 14, fontWeight: "600", textAlign: "center" },
});