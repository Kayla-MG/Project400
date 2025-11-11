import { 
  StyleSheet, 
  Text, 
  View,
TouchableOpacity,
ScrollView } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Link } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons'; 
import { blue } from 'react-native-reanimated/lib/typescript/Colors';
import { Colors } from '@/constants/Colors';


type Props = {}

const Page = (props: Props) => {
  const {top:safeTop} = useSafeAreaInsets();
  const userName = "User";
  const dailyPlan = {
    day: "Tuesday",
    activity: "Football Training",
    time: "4 to 5 PM",
    location: "Mercy College Sligo"
  };
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
            <Text style={[styles.btnText, {color:Colors.blue}]}>Log My Day</Text>
            <Text style={[styles.btnSubtitle, { color: '#0a0101ff' }]}>Record feelings, triggers, and events.</Text>
          </TouchableOpacity>
        </Link>

        {/* 3. Secondary Action: Calm Down */}
        <Link href="/(tabs)/calm" asChild style={{ width: '100%' }}>
          <TouchableOpacity style={[styles.actionCard, styles.calmButton]}>
            <Ionicons name="moon-outline" size={36} color={Colors.blue} />
            <Text style={[styles.btnText, { color: Colors.blue }]}>CALM NOW</Text>
            <Text style={[styles.btnSubtitle, { color: '#0a0101ff' }]}>Access de-escalation tools immediately.</Text>
          </TouchableOpacity>
        </Link>
{/* Placeholder/Tip Area */}
        <View style={styles.tipBox}>
            <Ionicons name="bulb-outline" size={20} color={Colors.blue} style={{marginRight: 10}} />
            <Text style={styles.tipText}>Tip: Consistent logging helps us find patterns!</Text>
        </View>
{/* 5. Daily Schedule Plan */}
        <View style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <Ionicons name="calendar-outline" size={24} color={Colors.blue} />
            <Text style={styles.scheduleTitle}>Today's Plan ({dailyPlan.day})</Text>
          </View>
          <Text style={styles.scheduleContent}>
            <Text style={{fontWeight: '700', color: Colors.blue}}>DON'T FORGET:</Text> You have **{dailyPlan.activity}** from **{dailyPlan.time}** at **{dailyPlan.location}**.
          </Text>
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
    backgroundColor: Colors.background,
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
    color: '#FFFFFF',
    marginTop: 10,
  },
  btnSubtitle: {
    fontSize: 14,
    color: '#E0E0E0',
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
  // Daily Schedule Card
  scheduleCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
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
  scheduleTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.blue,
    marginLeft: 10,
  },
  scheduleContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  }
});