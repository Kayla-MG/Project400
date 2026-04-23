import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView, Alert, ActivityIndicator, TextInput, Modal, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 
import { Colors } from '@/constants/Colors'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSensoryTheme } from '@/constants/useSensoryTheme';

const { width } = Dimensions.get("window");
const TILE_WIDTH = width / 2 - 30; 
const GRID_PADDING = 15;

const API_BASE_URL = 'https://project400-api.onrender.com';

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
  const theme = useSensoryTheme();
  const { top: safeTop } = useSafeAreaInsets();
  
  const [selectedMood, setSelectedMood] = useState<any>(null);
  const [isLogging, setIsLogging] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // New states for Trigger Notes and Buddy logic
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [triggerNote, setTriggerNote] = useState("");
  const [pendingMood, setPendingMood] = useState<any>(null);

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setCurrentUserId(id);
    };
    getUserId();
  }, []);

const checkWellbeingStreak = async () => {
    if (!currentUserId) return;
    try {
        const response = await fetch(`${API_BASE_URL}/api/check-wellbeing/${currentUserId}`);
        const data = await response.json();
        const supportNumber = await AsyncStorage.getItem('supportNumber');

       if (data.status === 'crisis') {
            const buttons: any[] = [
                { text: "I'm okay", style: "cancel" },
                { text: "Calm Now", onPress: () => router.push('/calm') }
            ];

            if (supportNumber) {
                buttons.push({
                    text: "📞 Call Support",
                    onPress: () => Linking.openURL(`tel:${supportNumber}`)
                });
            }

            Alert.alert(
                "💙 Buddy Check-In",
                "Hey! I see you've been having some harder days lately. Is there anything I can do to help? Should we reach out for extra support?",
                buttons
            );
        } else if (data.status === 'positive') {
            Alert.alert(
                "💚 High Five!",
                "Hey! We see you've been having some positive days lately. Take note of what you are doing right now — maybe you can add it to your toolbox!",
                [{ text: "Awesome!", style: "default" }]
            );
        }
    } catch (e) {
        console.log("Buddy check failed:", e);
    }
};

  const sendLogToApi = async (mood: any, navigated: boolean, note: string = "") => {
    if (!currentUserId) {
        Alert.alert("Error", "User session not found.");
        return;
    }

    setIsLogging(true);
    const isMeltdownForDb = (mood.isCrisis || mood.name === "Crisis") ? 1 : 0;
    
    const logDetails = {
        userId: currentUserId,
        feelingName: mood.name,
        severity: mood.value,
        isMeltdown: isMeltdownForDb,
        diaryNotes: note, 
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/log/mood`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logDetails),
        });

        if (response.ok) {
            // Run the Buddy Check immediately after a successful log
            await checkWellbeingStreak();
            
            if (!navigated) {
                 Alert.alert('Logged', `Successfully recorded your ${mood.name} feeling.`);
            }
        } else {
            Alert.alert('Error', 'Server could not save this entry.');
        }
    } catch (error) {
        Alert.alert('Network Error', 'Connection to server failed.');
    } finally {
        setIsLogging(false);
        setTriggerNote(""); // Reset note
    }
  };

  const handleMoodPress = (mood: any) => {
    if (mood.isCrisis) {
      setPendingMood(mood);
      setShowNoteModal(true);
    } else {
      sendLogToApi(mood, false);
    }
  };

  const submitCrisisWithNote = (navigated: boolean) => {
    setShowNoteModal(false);
    sendLogToApi(pendingMood, navigated, triggerNote);
    if (navigated) {
        router.push('/calm');
    }
  };

  const dynamicBg = theme.background;
  const dynamicTitle = theme.isSoftMode ? '#555' : Colors.blue;
  const dynamicText = theme.text;

  return (
    <View style={[styles.container, { backgroundColor: dynamicBg }]}>
      
      {/* TRIGGER NOTE MODAL */}
      <Modal visible={showNoteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                <Text style={[styles.modalTitle, { color: dynamicText }]}>What triggered this?</Text>
                <TextInput
                    style={[styles.noteInput, { color: dynamicText, borderColor: theme.isSoftMode ? '#DDD' : '#EEE' }]}
                    placeholder="e.g. Busy shopping mall, loud noise..."
                    placeholderTextColor="#999"
                    multiline
                    value={triggerNote}
                    onChangeText={setTriggerNote}
                />
                <View style={styles.modalButtons}>
                    <TouchableOpacity style={[styles.modalBtn, { backgroundColor: Colors.blue }]} onPress={() => submitCrisisWithNote(false)}>
                        <Text style={styles.btnText}>Just Log</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalBtn, { backgroundColor: Colors.red }]} onPress={() => submitCrisisWithNote(true)}>
                        <Text style={styles.btnText}>Log & Calm Now</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => setShowNoteModal(false)} style={styles.cancelLink}>
                    <Text style={{color: '#888'}}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: safeTop + 20 }]}> 
        <Text style={[styles.title, { color: dynamicTitle }]}>Daily Check-In Log</Text>

        <View style={styles.crisisContainer}>
          <TouchableOpacity 
            style={[styles.meltdownButton, theme.isSoftMode && { backgroundColor: '#D9534F', elevation: 0 }]}
            onPress={() => handleMoodPress(MELTDOWN_DATA)}
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
                  onPress={() => handleMoodPress(m)}
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
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', padding: 25, borderRadius: 20, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  noteInput: { width: '100%', borderBottomWidth: 1, minHeight: 60, padding: 10, textAlignVertical: 'top', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', gap: 10, width: '100%' },
  modalBtn: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
  cancelLink: { marginTop: 20 }
});