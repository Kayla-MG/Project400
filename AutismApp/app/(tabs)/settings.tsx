import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Switch, TouchableOpacity, Alert, ScrollView, Modal} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useSensoryTheme, ALL_TOOLS, DEFAULT_TOOL_COLOURS, STORAGE_KEYS } from '@/constants/useSensoryTheme';

const COLOUR_OPTIONS = [
  { label: 'Light Blue',  value: '#56CCF2' },
  { label: 'Purple',      value: '#8A2BE2' },
  { label: 'Orange',      value: '#F9A10A' },
  { label: 'Pinkey',      value: '#DB2DCD' },
  { label: 'Dark Blue',   value: '#0423ee' },
  { label: 'Green',       value: '#27AE60' },
  { label: 'Pink',        value: '#E83E8C' },
  { label: 'Grey',        value: '#6c7b74' },
  { label: 'Yellow',      value: '#fcd32c' },
  { label: 'Red',         value: '#ef1818' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useSensoryTheme(); // CALL: Hook for Soft Mode
  
  const [name, setName] = useState("");
  const [supportNumber, setSupportNumber] = useState("");
  const [isSoftMode, setIsSoftMode] = useState(false);

  const [toolColours, setToolColours] = useState<{ [key: string]: string }>(DEFAULT_TOOL_COLOURS);
  const [enabledTools, setEnabledTools] = useState<{ [key: string]: boolean }>(() => {
    const d: { [key: string]: boolean } = {};
    ALL_TOOLS.forEach(t => { d[t.name] = true; });
    return d;
});
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTargetTool, setPickerTargetTool] = useState<string | null>(null);

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

  //save all settings
  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('userDisplayName', name);
      await AsyncStorage.setItem('supportNumber', supportNumber);
      await AsyncStorage.setItem('softMode', JSON.stringify(isSoftMode));
      await AsyncStorage.setItem(STORAGE_KEYS.TOOL_COLOURS, JSON.stringify(toolColours));
      await AsyncStorage.setItem(STORAGE_KEYS.ENABLED_TOOLS, JSON.stringify(enabledTools));
      Alert.alert("Preferences Saved", "Your sensory and privacy settings have been updated.");
    } catch (e) {
      Alert.alert("Error", "Failed to save settings.");
    }
  };
//LOGOUT
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive", 
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userId');
          await AsyncStorage.removeItem('userName');
          router.replace('/' as any);
        }
      }
    ]);
  };
  const openPicker = (toolName: string) => {
    setPickerTargetTool(toolName);
    setPickerVisible(true);
};

  const selectColour = (colour: string) => {
    if (!pickerTargetTool) return;
    setToolColours(prev => ({ ...prev, [pickerTargetTool]: colour }));
    setPickerVisible(false);
};

  const toggleTool = (toolName: string) => {
    setEnabledTools(prev => ({ ...prev, [toolName]: !prev[toolName] }));
};

  // Wipe all local data
  const clearLocalData = async () => {
    Alert.alert('Clear Data', 'This will wipe your name and preferences from this device. Continue?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Wipe Data',
        onPress: async () => {
          await AsyncStorage.clear();
          setName('');
          setSupportNumber('');
          setIsSoftMode(false);
          setToolColours(DEFAULT_TOOL_COLOURS);
          const d: { [key: string]: boolean } = {};
          ALL_TOOLS.forEach(t => { d[t.name] = true; });
          setEnabledTools(d);
          router.replace('/');
        }
      }
    ]);
  };


  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.isSoftMode ? '#555' : Colors.blue }]}>Settings</Text>

      {/*  Identity Section */}
      <View style={[styles.section, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Identity (Local Only)</Text>
        <TextInput 
          style={[styles.input, { color: theme.text, borderBottomColor: theme.isSoftMode ? '#DDD' : '#EEE' }]} 
          placeholder="Preferred Name" 
          value={name} 
          onChangeText={setName} 
        />
        <TextInput
        style={[styles.input, { color: theme.text, borderBottomColor: theme.isSoftMode ? '#DDD' : '#EEE' }]}
        placeholder="Support Contact Number"
        value={supportNumber}
        onChangeText={setSupportNumber}
        keyboardType="phone-pad"
        />
        <Text style={styles.infoText}>This is never sent to our servers.</Text>
      </View>
      {/*  Customise Tool Colours */}
<View style={[styles.section, { backgroundColor: theme.card }]}>
    <Text style={[styles.sectionTitle, { color: theme.text }]}>🎨 Customise Tool Colours</Text>
    <Text style={styles.infoText}>Tap a colour circle to change it.</Text>
    {ALL_TOOLS.map(tool => (
        <View key={tool.name} style={styles.toolRow}>
            <Ionicons name={tool.icon as any} size={22} color={toolColours[tool.name]} style={{ marginRight: 10 }} />
            <Text style={[styles.toolName, { color: theme.text }]}>{tool.name}</Text>
            <TouchableOpacity
                style={[styles.colourSwatch, { backgroundColor: toolColours[tool.name] }]}
                onPress={() => openPicker(tool.name)}
            />
        </View>
    ))}
</View>

{/*  Manage Tools */}
<View style={[styles.section, { backgroundColor: theme.card }]}>
    <Text style={[styles.sectionTitle, { color: theme.text }]}>🛠️ My Calm Now Tools</Text>
    <Text style={styles.infoText}>Toggle tools on or off.</Text>
    {ALL_TOOLS.map(tool => (
        <View key={tool.name} style={styles.toolRow}>
            <Ionicons name={tool.icon as any} size={22} color={enabledTools[tool.name] ? toolColours[tool.name] : '#CCC'} style={{ marginRight: 10 }} />
            <Text style={[styles.toolName, { color: enabledTools[tool.name] ? theme.text : '#BBB' }]}>{tool.name}</Text>
            <Switch
                value={enabledTools[tool.name] ?? true}
                onValueChange={() => toggleTool(tool.name)}
                trackColor={{ false: '#767577', true: toolColours[tool.name] }}
            />
        </View>
    ))}
</View>

      {/* Sensory Section */}
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

      {/* Action Buttons */}
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
      <Modal visible={pickerVisible} transparent animationType="slide" onRequestClose={() => setPickerVisible(false)}>
    <View style={modalStyles.overlay}>
        <View style={[modalStyles.sheet, { backgroundColor: theme.background }]}>
            <Text style={[modalStyles.title, { color: theme.text }]}>
                Choose a colour for {pickerTargetTool}
            </Text>
            <View style={modalStyles.grid}>
                {COLOUR_OPTIONS.map(opt => (
                    <TouchableOpacity
                        key={opt.value}
                        style={[
                            modalStyles.circle,
                            { backgroundColor: opt.value },
                            pickerTargetTool && toolColours[pickerTargetTool] === opt.value && modalStyles.selected,
                        ]}
                        onPress={() => selectColour(opt.value)}
                    >
                        {pickerTargetTool && toolColours[pickerTargetTool] === opt.value && (
                            <Ionicons name="checkmark" size={20} color="white" />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={modalStyles.cancelBtn} onPress={() => setPickerVisible(false)}>
                <Text style={modalStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    </View>
</Modal>
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
  secondaryBtnText: { color: '#666', fontWeight: '600' },
  toolRow:{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  toolName: { flex: 1, fontSize: 15, fontWeight: '500' },
  colourSwatch:{ width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#E0E0E0' },
});
const modalStyles = StyleSheet.create({
  overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet:      { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  title:      { fontSize: 18, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  grid:       { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 20 },
  circle:     { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  selected:   { borderWidth: 3, borderColor: '#333' },
  cancelBtn:  { backgroundColor: '#E0E0E0', padding: 14, borderRadius: 12, alignItems: 'center' },
  cancelText: { color: '#333', fontWeight: '600', fontSize: 16 },
});