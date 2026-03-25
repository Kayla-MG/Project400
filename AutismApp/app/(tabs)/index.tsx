import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Link } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons'; 
import { Colors } from '@/constants/Colors';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- 1. Schedule Data Structure ---
interface Activity {
    activity: string;
    time: string;
    location: string;
}

const SCHEDULE_DATA: { [key: string]: Activity } = {
    "Monday": { activity: "Soccer Training", time: "8:00 PM - 9:00 PM", location: "ATU Astro" },
    "Tuesday": { activity: "Gaelic Training", time: "4:00 PM - 5:00 PM", location: "Mercy College Sligo" },
    "Wednesday": { activity: "No Planned Activity", time: "Relax Time", location: "Home" },
    "Thursday": { activity: "Sean-Nos Dancing", time: "5:00 PM - 7:00 PM", location: "Teach Cheoil, Riverstown" },
    "Friday": { activity: "Family Movie Night", time: "7:00 PM", location: "Living Room" },
    "Saturday": { activity: "Swimming Lessons", time: "10:00 AM - 11:00 AM", location: "Sligo Complex Pool" },
    "Sunday": { activity: "Soccer Match vs. Merville F.C", time: "2:00 PM", location: "Calry Bohs Grass Pitch" },
};

const WEEK_DAYS = Object.keys(SCHEDULE_DATA);

const Page = () => {
  const {top:safeTop} = useSafeAreaInsets();
  const isFocused = useIsFocused(); // Tracks when user navigates back to this tab

  // --- Dynamic Personalization State ---
  const [displayName, setDisplayName] = useState("User");
  const [isSoftMode, setIsSoftMode] = useState(false);
  const [selectedDay, setSelectedDay] = useState(WEEK_DAYS[0]);

  // Load Preferences whenever the screen comes into focus
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedName = await AsyncStorage.getItem('userDisplayName');
        const savedSoftMode = await AsyncStorage.getItem('softMode');
        
        if (savedName) setDisplayName(savedName);
        if (savedSoftMode !== null) setIsSoftMode(JSON.parse(savedSoftMode));
      } catch (error) {
        console.error("Error loading home preferences", error);
      }
    };

    if (isFocused) {
      loadPreferences();
    }
  }, [isFocused]);

  const currentPlan = SCHEDULE_DATA[selectedDay];

  const handleDayPress = (day: string) => {
    setSelectedDay(day);
  };
  
  const scheduleMessage = currentPlan.activity === "No Planned Activity" 
    ? `Today is a rest day! You have ${currentPlan.activity} at ${currentPlan.location}.`
    : `You have ${currentPlan.activity} from ${currentPlan.time} at ${currentPlan.location}.`;

  // --- Sensory Design Variables ---
  // If Soft Mode is ON, we use low-contrast/warm colors to reduce sensory load
  const dynamicBg = isSoftMode ? '#FDFBF0' : Colors.background; // Soft Cream vs Stark White
  const dynamicHeader = isSoftMode ? '#555' : Colors.blue; // Soft Charcoal vs Bright Blue

  return (
    <View style={[styles.container, { backgroundColor: dynamicBg }]}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: safeTop + 20 }]}>
        
        {/* 1. Greeting - Uses dynamic name from Settings */}
        <View style={styles.greetingContainer}>
          <Ionicons name="happy-outline" size={32} color={dynamicHeader} />
          <Text style={[styles.headerText, { color: dynamicHeader }]}>Hi {displayName}!</Text>
        </View>

        {/* 2. Main Action */}
        <Link href="/(tabs)/log" asChild style={{ width: '100%' }}>
          <TouchableOpacity style={[styles.actionCard, styles.logButton, isSoftMode && styles.softCard]}>
            <Ionicons name="book-outline" size={36} color={Colors.blue} />
            <Text style={[styles.btnText, {color:Colors.blue}]}>LOG MY DAY</Text>
            <Text style={styles.btnSubtitle}>Record how you're feeling.</Text>
          </TouchableOpacity>
        </Link>

        {/* 3. Secondary Action */}
        <Link href="/(tabs)/calm" asChild style={{ width: '100%' }}>
          <TouchableOpacity style={[styles.actionCard, styles.calmButton, isSoftMode && styles.softCard]}>
            <Ionicons name="moon-outline" size={36} color={Colors.blue} />
            <Text style={[styles.btnText, { color: Colors.blue }]}>CALM NOW</Text>
            <Text style={styles.btnSubtitle}>Access de-escalation tools immediately.</Text>
          </TouchableOpacity>
        </Link>

        <View style={[styles.tipBox, isSoftMode && { backgroundColor: '#F0EAD6' }]}>
            <Ionicons name="bulb-outline" size={20} color={Colors.blue} style={{marginRight: 10}} />
            <Text style={styles.tipText}>Tip: Patterns appear when you log daily!</Text>
        </View>
        
        {/* 5. Daily Schedule Plan */}
        <View style={styles.scheduleContainer}>
            <Text style={[styles.scheduleTitle, { color: dynamicHeader }]}>What's the Plan?</Text>
            
            <View style={styles.daySelector}>
                {WEEK_DAYS.map((day) => (
                    <TouchableOpacity
                        key={day}
                        style={[
                            styles.dayButton,
                            selectedDay === day && styles.dayButtonSelected,
                        ]}
                        onPress={() => handleDayPress(day)}
                    >
                        <Text style={[
                            styles.dayButtonText,
                            selectedDay === day && styles.dayButtonTextSelected,
                        ]}>
                            {day.substring(0, 3)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={[styles.scheduleCard, isSoftMode && styles.softCard]}>
                <View style={styles.scheduleHeader}>
                    <Ionicons name="calendar-outline" size={24} color={Colors.blue} />
                    <Text style={[styles.scheduleDayHeader, { color: dynamicHeader }]}>{selectedDay}'s Activity</Text>
                </View>
                <Text style={styles.scheduleContent}>
                    <Text style={{fontWeight: '700', color: Colors.blue}}>
                        {currentPlan.activity === "No Planned Activity" ? 'RELAX:' : 'REMINDER:'}
                    </Text> 
                    {" "}{scheduleMessage}
                </Text>
            </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default Page

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 40 },
  greetingContainer: { flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', marginBottom: 30, marginTop: 10 },
  headerText: { fontSize: 28, fontWeight: '700', marginLeft: 10 },
  actionCard: { width: '100%', borderRadius: 15, padding: 25, alignItems: 'center', marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  softCard: { backgroundColor: '#F9F9F9', borderColor: '#DDD', borderWidth: 1, elevation: 0 },
  logButton: { backgroundColor: '#FFFFFF', minHeight: 140 },
  calmButton: { backgroundColor: '#FFFFFF', minHeight: 120, borderWidth: 2, borderColor: Colors.blue },
  btnText: { fontSize: 24, fontWeight: '800', marginTop: 10 },
  btnSubtitle: { fontSize: 14, color: '#444', marginTop: 5, textAlign: 'center' },
  tipBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6F0FF', padding: 15, borderRadius: 10, marginTop: 20, width: '100%' },
  tipText: { fontSize: 14, color: '#333' },
  scheduleContainer: { width: '100%', marginTop: 30 },
  scheduleTitle: { fontSize: 22, fontWeight: '800', marginBottom: 15 },
  daySelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, backgroundColor: '#EEE', borderRadius: 10, padding: 5 },
  dayButton: { flex: 1, paddingVertical: 8, marginHorizontal: 2, borderRadius: 8, alignItems: 'center' },
  dayButtonSelected: { backgroundColor: Colors.blue },
  dayButtonText: { fontSize: 14, fontWeight: '600', color: '#666' },
  dayButtonTextSelected: { color: '#FFFFFF', fontWeight: '800' },
  scheduleCard: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 15, padding: 20, borderLeftWidth: 5, borderLeftColor: Colors.yellow, elevation: 3 },
  scheduleHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  scheduleDayHeader: { fontSize: 20, fontWeight: '800', marginLeft: 10 },
  scheduleContent: { fontSize: 16, color: '#444', lineHeight: 24 }
});