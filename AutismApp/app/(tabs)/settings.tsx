import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useSensoryTheme } from '@/constants/useSensoryTheme';

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useSensoryTheme(); // CALL: Hook for Soft Mode
  
  const [name, setName] = useState("");
  const [supportNumber, setSupportNumber] = useState("");
  const [isSoftMode, setIsSoftMode] = useState(false);

  // Load current settings from phone memory
  useEffect(() => {
    const loadSettings = async () => {
      const savedName = await AsyncStorage.getItem('userDisplayName');
      const savedNum = await AsyncStorage.getItem('supportNumber');
      const softMode = await AsyncStorage.getItem('softMode');
      
      if (savedName) setName(savedName);
      if (savedNum) setSupportNumber(savedNum);
      if (softMode) setIsSoftMode(JSON.parse(softMode));
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('userDisplayName', name);
      await AsyncStorage.setItem('supportNumber', supportNumber);
      await AsyncStorage.setItem('softMode', JSON.stringify(isSoftMode));
      Alert.alert("Preferences Saved", "Your sensory and privacy settings have been updated.");
    } catch (e) {
      Alert.alert("Error", "Failed to save settings.");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive", 
        onPress: async () => {
          await AsyncStorage.removeItem('userToken'); // Kill the session
          router.replace('/'); // Send back to Login screen
        } 
      }
    ]);
  };

  const clearLocalData = async () => {
    Alert.alert("Clear Data", "This will wipe your name and preferences from this device. Continue?", [
      { text: "No", style: "cancel" },
      { 
        text: "Wipe Data", 
        onPress: async () => {
          await AsyncStorage.clear();
          setName("");
          setSupportNumber("");
          setIsSoftMode(false);
          router.replace('/');
        } 
      }
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.isSoftMode ? '#555' : Colors.blue }]}>Settings</Text>

      {/* 1. Identity Section */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Identity (Local Only)</Text>
        <TextInput 
          style={[styles.input, { color: theme.text, borderBottomColor: theme.isSoftMode ? '#DDD' : '#EEE' }]} 
          placeholder="Preferred Name" 
          value={name} 
          onChangeText={setName} 
        />
        <Text style={styles.infoText}>This is never sent to our servers.</Text>
      </View>

      {/* 2. Sensory Section */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <View style={styles.row}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Soft Mode (Calming)</Text>
          <Switch 
            value={isSoftMode} 
            onValueChange={setIsSoftMode} 
            trackColor={{ false: "#767577", true: Colors.orange }}
          />
        </View>
        <Text style={styles.infoText}>Reduces contrast for a gentler visual experience.</Text>
      </View>

      {/* 3. Action Buttons */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Preferences</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.secondaryBtn, { marginTop: 40 }]} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#666" />
        <Text style={styles.secondaryBtnText}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={clearLocalData}>
        <Ionicons name="trash-outline" size={20} color="#D9534F" />
        <Text style={[styles.secondaryBtnText, { color: '#D9534F' }]}>Wipe Local Data</Text>
      </TouchableOpacity>
      
      <View style={{ height: 100 }} /> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 25 },
  section: { padding: 18, borderRadius: 15, marginBottom: 20, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  input: { borderBottomWidth: 1, paddingVertical: 8, fontSize: 16 },
  infoText: { fontSize: 12, color: '#888', marginTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  saveBtn: { backgroundColor: Colors.blue, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, gap: 10 },
  secondaryBtnText: { color: '#666', fontWeight: '600' }
});