import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router'; 
import { Colors } from '@/constants/Colors'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 

const { width } = Dimensions.get("window");

const TILE_WIDTH = width / 2 - 30; 
const GRID_PADDING = 15;

// === API Configuration ===
// IMPORTANT: Use your confirmed local IP address 192.168.1.45
const API_BASE_URL = 'http://192.168.1.45:3000'; 
const USER_ID_PLACEHOLDER = "USER_00233714"; 

// Data Definition (Fixed list of moods/icons)
const MOOD_DATA = [
  { name: "Happy", icon: "happy-outline", color: Colors.green, value: 5, isCrisis: false },
  { name: "Calm", icon: "leaf-outline", color: Colors.blue, value: 4, isCrisis: false },
  { name: "Neutral", icon: "remove-circle-outline", color: Colors.neutral, value: 3, isCrisis: false },
  { name: "Tired", icon: "moon-outline", color: Colors.purple, value: 2, isCrisis: false },
  { name: "Anxious", icon: "help-circle-outline", color: Colors.peach, value: 2, isCrisis: true },
  { name: "Sad", icon: "sad-outline", color: Colors.blue, value: 2, isCrisis: true },
  { name: "Angry", icon: "flame-outline", color: Colors.red, value: 1, isCrisis: true },
  { name: "Overwhelmed", icon: "alert-circle-outline", color: Colors.orange, value: 1, isCrisis: true },
];

// Data for the separate, single Meltdown button
const MELTDOWN_DATA = { 
    name: "Crisis", //changed to crisis instead of meltdown
    icon: "thunderstorm-outline", 
    color: Colors.red, 
    value: 1, 
    isCrisis: true 
};


const Page = () => {
  const router = useRouter(); 
  const { top: safeTop } = useSafeAreaInsets();
  const [selectedMood, setSelectedMood] = useState<typeof MOOD_DATA[0] | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  
  
  const sendLogToApi = async (mood: typeof MOOD_DATA[0] | typeof MELTDOWN_DATA, navigated: boolean) => {
    setIsLogging(true);
    
    // FIX: Convert isCrisis boolean to 1 (true) or 0 (false) for MySQL BIT/BOOLEAN column
    const isMeltdownForDb = (mood.isCrisis || mood.name === "Meltdown") ? 1 : 0;
    
    const logDetails = {
        userId: USER_ID_PLACEHOLDER, 
        feelingName: mood.name,
        severity: mood.value,
        isMeltdown: isMeltdownForDb, // Sending 1 or 0
        diaryNotes: "",
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/log/mood`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logDetails),
        });

        if (response.ok) {
            console.log(`LOGGED MOOD: ${mood.name} to SQL DB.`);
            if (!navigated) {
                 Alert.alert('Success!', `Mood logged: ${mood.name} to API`, [{ text: 'OK' }]);
            }
        } else {
            // Handle HTTP errors
            const errorData = await response.json();
            const message = errorData.error || `Unknown API error (Status: ${response.status})`;
            Alert.alert('Error Saving', `Could not save log: ${message}. Check API console for details.`, [{ text: 'OK' }]);
        }

    } catch (error) {
        console.error("API Fetch Error:", error);
        Alert.alert('Network Error', 'Could not connect to the API server. Ensure it is running on the correct IP/Port.', [{ text: 'OK' }]);
    } finally {
        setIsLogging(false);
    }
  };


  const checkCrisisAndNavigate = (mood: typeof MOOD_DATA[0] | typeof MELTDOWN_DATA) => {
    if (mood.isCrisis) {
      Alert.alert(
        "Immediate Support Needed?",
        `You selected '${mood.name}'. Do you want to go to the CALM NOW toolkit for immediate relief?`,
        [
          { 
            text: "Log Anyway", 
            style: 'cancel',
            onPress: () => sendLogToApi(mood, false) 
          },
          { 
            text: "Yes, Calm Now", 
            onPress: () => {
              sendLogToApi(mood, true); 
              router.push('/calm');
            },
            style: 'destructive'
          },
        ]
      );
    } else {
      sendLogToApi(mood, false); 
    }
  };

  const handleMoodTilePress = (mood: typeof MOOD_DATA[0]) => {
      setSelectedMood(mood);
      checkCrisisAndNavigate(mood);
  };

  const handleMeltdownPress = () => {
    checkCrisisAndNavigate(MELTDOWN_DATA);
  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: safeTop + 20 }]}> 
        <Text style={styles.title}>Daily Check-In Log</Text>

        {/* 1. MELTDOWN/CRISIS BUTTON (LARGE AND PROMINENT) */}
        <View style={styles.crisisContainer}>
          <TouchableOpacity 
            style={styles.meltdownButton}
            onPress={handleMeltdownPress}
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


        {/* 2. Standard Mood Selection Grid */}
        <Text style={styles.sectionHeader}>Log Other Feelings:</Text>

        <View style={styles.grid}>
          {MOOD_DATA.map((m) => {
            const isSelected = selectedMood?.name === m.name;
            const isCrisisTile = m.isCrisis;
            
            const tileStyle = isCrisisTile 
              ? styles.crisisTile 
              : styles.tile;

            const iconColor = isSelected ? Colors.white : m.color;
            const labelColor = isSelected ? Colors.white : (isCrisisTile ? Colors.red : Colors.text); 
            const tileBackground = isSelected ? m.color : Colors.cardBackground;

            return (
              <View key={m.name} style={{width: TILE_WIDTH, marginBottom: 10}}>
                <TouchableOpacity 
                  style={[
                    tileStyle,
                    { 
                      backgroundColor: tileBackground, 
                      borderColor: m.color,
                      borderWidth: isSelected ? 3 : 1,
                    }
                  ]} 
                  onPress={() => handleMoodTilePress(m)}
                  disabled={isLogging}
                >
                  <Ionicons name={m.icon as any} size={40} color={iconColor} />
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
  container: {
    flex: 1,
    backgroundColor: Colors.background || '#F5F5F5',
  },
  scroll: {
    paddingBottom: 100,
    alignItems: "center",
    paddingHorizontal: GRID_PADDING,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.blue || '#4A90E2',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text || '#333',
    marginBottom: 15,
    alignSelf: 'flex-start',
    width: '100%',
  },
  // --- Crisis Button Styles ---
  crisisContainer: {
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
  },
  meltdownButton: {
    width: '95%',
    backgroundColor: Colors.red || '#DC3545', // Primary RED for crisis
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    flexDirection: 'row',
    gap: 15,
  },
  meltdownButtonText: {
    color: Colors.white || '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  // --- Grid and Tile Styles ---
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: '100%',
  },
  tile: {
    width: TILE_WIDTH,
    aspectRatio: 1, 
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    backgroundColor: Colors.cardBackground || '#FFFFFF',
    borderRadius: 15,
    elevation: 3,
    borderColor: Colors.neutral || '#E0E0E0',
    borderWidth: 1,
  },
  crisisTile: {
    width: TILE_WIDTH,
    aspectRatio: 1, 
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    backgroundColor: Colors.cardBackground || '#FFFFFF', 
    borderRadius: 15,
    elevation: 5,
  },
  label: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: Colors.text || '#333',
  },
});