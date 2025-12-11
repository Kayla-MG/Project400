import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Link } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons'; 
// NOTE: Removed unnecessary import 'blue'
import { Colors } from '@/constants/Colors';


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
// --- End Schedule Data ---

type Props = {}

const Page = (props: Props) => {
  const {top:safeTop} = useSafeAreaInsets();
  const userName = "Kayla";

  // State to hold the currently selected day
  const [selectedDay, setSelectedDay] = useState(WEEK_DAYS[0]); // Default to Monday

  const currentPlan = SCHEDULE_DATA[selectedDay];


  // Function to handle the button press and update the schedule
  const handleDayPress = (day: string) => {
    setSelectedDay(day);
  };
  
  // Custom message based on the plan
  const scheduleMessage = currentPlan.activity === "No Planned Activity" 
    ? `Today is a rest day! You have **${currentPlan.activity}** at **${currentPlan.location}**.`
    : `DON'T FORGET: You have **${currentPlan.activity}** from **${currentPlan.time}** at **${currentPlan.location}**.`;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: safeTop + 20 }]}>
        {/* 1. Greeting & User Icon */}
        <View style={styles.greetingContainer}>
          <Ionicons name="happy-outline" size={32} color={Colors.blue} />
          <Text style={styles.headerText}>Hi {userName}!</Text>
        </View>

        {/* 2. Main Action: Log How I Feel */}
        <Link href="/(tabs)/log" asChild style={{ width: '100%' }}>
          <TouchableOpacity style={[styles.actionCard, styles.logButton]}>
            <Ionicons name="book-outline" size={36} color={Colors.blue} />
            <Text style={[styles.btnText, {color:Colors.blue}]}>LOG MY DAY</Text>
            <Text style={[styles.btnSubtitle, { color: Colors.blue }]}>Click LOG MY DAY to record how your feeling.</Text>
          </TouchableOpacity>
        </Link>

        {/* 3. Secondary Action: Calm Down */}
        <Link href="/(tabs)/calm" asChild style={{ width: '100%' }}>
          <TouchableOpacity style={[styles.actionCard, styles.calmButton]}>
            <Ionicons name="moon-outline" size={36} color={Colors.blue} />
            <Text style={[styles.btnText, { color: Colors.blue }]}>CALM NOW</Text>
            <Text style={[styles.btnSubtitle, { color: Colors.blue }]}>Click CALM NOW to access de-escalation tools immediately</Text>
          </TouchableOpacity>
        </Link>

        {/* Placeholder/Tip Area */}
        <View style={styles.tipBox}>
            <Ionicons name="bulb-outline" size={20} color={Colors.blue} style={{marginRight: 10}} />
            <Text style={styles.tipText}>Tip: Consistent logging helps us find patterns!</Text>
        </View>
        
        {/* 5. Daily Schedule Plan Card */}
        <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleTitle}>What's the Plan?</Text>
            <Text>Select what day it is to see what activities you have!
            </Text>
            {/* Day Selection Buttons */}
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

            {/* Current Schedule Content */}
            <View style={styles.scheduleCard}>
                <View style={styles.scheduleHeader}>
                    <Ionicons name="calendar-outline" size={24} color={Colors.blue} />
                    <Text style={styles.scheduleDayHeader}>{selectedDay}'s Activity</Text>
                </View>
                <Text style={styles.scheduleContent}>
                    <Text style={{fontWeight: '700', color: Colors.blue}}>
                        {currentPlan.activity === "No Planned Activity" ? 'RELAX:' : 'DON\'T FORGET:'}
                    </Text> 
                    {scheduleMessage}
                </Text>
            </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.blue,
    marginLeft: 10,
  },
  actionCard: {
    width: '100%',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  logButton: {
    backgroundColor: Colors.background, // Assumes Colors.background is white or light
    minHeight: 150,
  },
  calmButton: {
    backgroundColor: '#FFFFFF',
    minHeight: 120,
    borderWidth: 2,
    borderColor: Colors.blue,
  },
  btnText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.blue,
    marginTop: 10,
  },
  // Ensure Colors.text_sub is defined, otherwise fallback to a dark color
  btnSubtitle: {
    fontSize: 14,
    color: '#030303ff', 
    marginTop: 5,
    textAlign: 'center',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F0FF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
  },
  tipText: {
    fontSize: 14,
  },
  
  // --- Daily Schedule Card Styles ---
  scheduleContainer: {
    width: '100%',
    marginTop: 30,
  },
  scheduleTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.blue,
    marginBottom: 15,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    padding: 5,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 2,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dayButtonSelected: {
    backgroundColor: Colors.blue,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  dayButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  scheduleCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 5,
    borderLeftColor: Colors.yellow,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduleDayHeader: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.blue,
    marginLeft: 10,
  },
  scheduleContent: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  }
});