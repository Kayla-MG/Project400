import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors'; // Assuming Colors is imported correctly

const { width } = Dimensions.get("window");

const TILE_WIDTH = width / 2 - 35; 
const GRID_PADDING = 20;

// Data Definition (Fixed list of moods/icons)
const MOOD_DATA = [
  // These are the non-crisis moods, using the original colors you specified
  { name: "Happy", icon: "happy-outline", color: Colors.green, value: 5, isCrisis: false },
  { name: "Calm", icon: "leaf-outline", color: Colors.peach, value: 4, isCrisis: false },
  { name: "Neutral", icon: "remove-circle-outline", color: Colors.neutral, value: 3, isCrisis: false },
  { name: "Tired", icon: "moon-outline", color: Colors.purple, value: 2, isCrisis: false },
  // These are the crisis moods remaining in the grid (now separate from the big button)
  { name: "Anxious", icon: "help-circle-outline", color: Colors.yellow, value: 2, isCrisis: true },
  { name: "Sad", icon: "sad-outline", color: Colors.blue, value: 2, isCrisis: true },
  { name: "Angry", icon: "flame-outline", color: Colors.orange, value: 1, isCrisis: true },
  { name: "Overwhelmed", icon: "alert-circle-outline", color: Colors.pink, value: 1, isCrisis: true },
];

// Data for the separate, single Meltdown button
const MELTDOWN_DATA = { 
    name: "Meltdown/Shutdown", 
    icon: "thunderstorm-outline", 
    color: Colors.red, 
    value: 1, 
    isCrisis: true 
};


const Page = () => {
  const router = useRouter(); 
  const [selectedMood, setSelectedMood] = useState<typeof MOOD_DATA[0] | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  
  // Helper function to check for crisis and handle navigation decision
  const checkCrisisAndNavigate = (mood: typeof MOOD_DATA[0] | typeof MELTDOWN_DATA) => {
    // Note: We assume any log from this screen *could* need intervention
    if (mood.isCrisis || mood.name.includes("Meltdown")) {
      Alert.alert(
        "Immediate Support Needed?",
        `You logged a high-stress event. Do you want to go to the CALM NOW toolkit for immediate relief?`,
        [
          { 
            text: "Log Anyway", 
            style: 'cancel',
            onPress: () => handleLogMood(mood, false) 
          },
          { 
            text: "Yes, Calm Now", 
            onPress: () => {
              handleLogMood(mood, true); 
              router.push('/calm'); // Navigate to the Calm page
            },
            style: 'destructive'
          },
        ]
      );
    } else {
      handleLogMood(mood, false);
    }
  };

  const handleLogMood = (mood: typeof MOOD_DATA[0] | typeof MELTDOWN_DATA, navigated: boolean) => {
    setIsLogging(true);
    // --- TEMPORARY LOGGING --- (Your API call will replace this later)
    console.log(`LOGGED MOOD: ${mood.name} | Crisis Event: ${navigated ? 'YES (Navigated)' : 'No'}`);
    
    setTimeout(() => {
        setIsLogging(false);
        if (!navigated) {
            Alert.alert('Mood Logged', `Successfully logged: ${mood.name}`, [{ text: 'OK' }]);
        }
    }, 500);
  };
  
  const handleMoodTilePress = (mood: typeof MOOD_DATA[0]) => {
      setSelectedMood(mood); // Set selection state
      checkCrisisAndNavigate(mood); // Check if navigation is needed
  };


  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Daily Check-In Log</Text>

      {/* 1. MELTDOWN/CRISIS BUTTON (LARGE AND PROMINENT) */}
      <View style={styles.crisisContainer}>
        <TouchableOpacity 
          style={styles.meltdownButton}
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


      {/* 2. Standard Mood Selection Grid */}
      <Text style={styles.sectionHeader}>Log Other Feelings:</Text>

      <View style={styles.grid}>
        {MOOD_DATA.map((m) => {
          const isSelected = selectedMood?.name === m.name;
          const isCrisisTile = m.isCrisis;
          
          const tileStyle = isCrisisTile 
            ? styles.crisisTile 
            : styles.tile;

          // Icon/Text colors based on selection and crisis status
          const iconColor = isSelected ? Colors.white : m.color;
          const labelColor = isSelected ? Colors.white : Colors.text;
          const tileBackground = isSelected ? m.color : Colors.cardBackground;

          return (
            <View key={m.name} style={{width: TILE_WIDTH, marginBottom: 10}}>
              <TouchableOpacity 
                style={[
                  tileStyle,
                  { 
                    backgroundColor: tileBackground, 
                    // Use a subtle border if it's not a crisis tile
                    borderColor: isCrisisTile ? Colors.red : Colors.neutral,
                    borderWidth: isSelected ? 2 : 1,
                  }
                ]} 
                onPress={() => handleMoodTilePress(m)}
                disabled={isLogging}
              >
                <Ionicons name={m.icon as any} size={80} color={iconColor} />
                {/* Adjust text color for non-selected crisis tiles (making them stand out) */}
                <Text style={[styles.label, { color: isSelected ? Colors.white : (isCrisisTile ? Colors.red : Colors.text) }]}>
                    {m.name}
                </Text> 
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 40,
    paddingBottom: 100,
    alignItems: "center",
    paddingHorizontal: GRID_PADDING,
    backgroundColor: Colors.background || '#F5F5F5',
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
  // Standard Tile Style (Base for Happy, Calm, Neutral, Tired)
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
  // Crisis Tile Style (Base for Anxious, Sad, Angry, Overwhelmed)
  crisisTile: {
    width: TILE_WIDTH,
    aspectRatio: 1, 
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    backgroundColor: Colors.cardBackground || '#FFFFFF', 
    borderRadius: 15,
    elevation: 5,
    // Note: Border color is handled inline using m.color for specific colors
  },
  label: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: Colors.text || '#333',
  },

});