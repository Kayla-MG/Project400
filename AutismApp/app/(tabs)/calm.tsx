import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const CalmDownPage = () => {
  const tools = [
    { name: 'Deep Breathing', icon: 'airplane-outline', color: '#6FCF97' },
    { name: 'Listen to Music', icon: 'musical-notes-outline', color: '#56CCF2' },
    { name: 'Stretch / Move', icon: 'walk-outline', color: '#F2C94C' },
    { name: 'Visual Calm', icon: 'flower-outline', color: '#BB6BD9' },
    { name: 'Fidget / Squeeze', icon: 'hand-left-outline', color: '#F2994A' },
    { name: 'Countdown / Timer', icon: 'time-outline', color: '#2D9CDB' },
  ];

  const handleToolPress = (tool: string) => {
    Alert.alert('Tool Selected', `You selected: ${tool}`);
    // Here you could add navigation or animation for each tool
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Calm Down</Text>
      <View style={styles.grid}>
        {tools.map((t) => (
          <TouchableOpacity
            key={t.name}
            style={[styles.toolButton, { backgroundColor: t.color }]}
            onPress={() => handleToolPress(t.name)}
          >
            <Ionicons name={t.icon as any} size={70} color="white" />
            <Text style={styles.toolLabel}>{t.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  toolButton: {
    width: width * 0.45,
    height: width * 0.45,
    margin: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  toolLabel: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CalmDownPage;
