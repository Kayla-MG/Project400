import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

// --- Design Constants ---
const PRIMARY_COLOR = '#4C8A8C'; // Calming Teal/Green
const ACCENT_COLOR = '#FFC107'; // Yellow accent
const BACKGROUND_COLOR = '#F5F5F5';
const TILE_WIDTH = width / 3 - 20;

// --- External Links ---
// NOTE: Only the YouTube link remains
const MARCONI_UNION_LINK = 'https://www.youtube.com/watch?v=eQ6--TNre9k&list=PLtneXHSzis5GjlpcsTs8IuD3ktIz5u8bQ';

// --- Component: Tool Button Interface ---
interface Tool {
  name: string;
  icon: string;
  color: string;
  actionType: 'internal' | 'link';
}

// --- STYLING BLOCK (Moved to the top for recognition) ---
const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 80,
    backgroundColor: BACKGROUND_COLOR,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 5,
    color: PRIMARY_COLOR,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  toolButton: {
    width: TILE_WIDTH,
    height: TILE_WIDTH,
    marginVertical: 8,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
    padding: 10,
  },
  toolLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    marginTop: 30,
  },
  // --- MUSIC LINK STYLES ---
  linkContainer: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  linkTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY_COLOR,
    marginBottom: 5,
  },
  linkSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  buttonGroup: {
    // Modified to center the single button since Spotify is removed
    flexDirection: 'row',
    justifyContent: 'center', 
    gap: 10,
  },
  linkButton: {
    // Flex 1 is removed to allow centering
    width: '80%', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    backgroundColor: '#FF0000', // YouTube Red
  },
  linkButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    padding: 8,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    textDecorationLine: 'underline',
  }
});

// --- External Link Display ---
const ExternalMusicLink = ({ onClose }: { onClose: () => void }) => {
    const handleLinkPress = async (url: string) => {
        const supported = await Linking.canOpenURL(url);
        
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert('App Not Found', 'Cannot open the link. Please ensure the YouTube app or a browser is available.', [{ text: 'OK' }]);
        }
    };

    return (
        <View style={styles.linkContainer}>
            <Text style={styles.linkTitle}>Marconi Union - Weightless</Text>
            <Text style={styles.linkSubtitle}>Tap below to play on YouTube (Opens externally):</Text>
            
            <View style={styles.buttonGroup}>
                <TouchableOpacity 
                    style={styles.linkButton} 
                    onPress={() => handleLinkPress(MARCONI_UNION_LINK)}
                >
                    <Ionicons name="logo-youtube" size={24} color="white" />
                    <Text style={styles.linkButtonText}>Launch YouTube</Text>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close Options</Text>
            </TouchableOpacity>
        </View>
    );
};



const CalmDownPage = () => {
  const [showExternalMusicLink, setShowExternalMusicLink] = useState(false);

  const tools: Tool[] = [
    { name: 'Deep Breathing', icon: 'leaf-outline', color: '#6FCF97', actionType: 'internal' },
    { name: 'Visual Calming', icon: 'eye-outline', color: '#56CCF2', actionType: 'internal' },
    { name: 'Stretch / Move', icon: 'walk-outline', color: '#F2C94C', actionType: 'internal' },
    // This tool will trigger the link component
    { name: 'Listen To Music', icon: 'musical-notes-outline', color: '#8A2BE2', actionType: 'link' }, 
    { name: 'Fidget / Squeeze', icon: 'hand-left-outline', color: '#F2994A', actionType: 'internal' },
    { name: 'Countdown / Timer', icon: 'time-outline', color: '#2D9CDB', actionType: 'internal' },
  ];

  const handleToolPress = (tool: Tool) => {
    if (tool.actionType === 'link') {
      // Toggle the visibility of the link component
      setShowExternalMusicLink(true);
    } else {
      console.log(`Launching internal tool: ${tool.name}`);
      Alert.alert('Tool Selected', `You selected the internal tool: ${tool.name}`, [{ text: 'OK' }]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>De-escalation Toolkit</Text>
      <Text style={styles.subtitle}>Tap a strategy for immediate relief.</Text>

      {/* RENDER THE EXTERNAL LINK COMPONENT IF 'Listen To Music' WAS CLICKED */}
      {showExternalMusicLink && (
          <ExternalMusicLink onClose={() => setShowExternalMusicLink(false)} />
      )}
      
      {/* Tools Grid */}
      <View style={styles.grid}>
        {tools.map((t) => (
          <TouchableOpacity
            key={t.name}
            style={[styles.toolButton, { backgroundColor: t.color }]}
            onPress={() => handleToolPress(t)}
          >
            <Ionicons name={t.icon as any} size={40} color="white" />
            <Text style={styles.toolLabel}>{t.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.disclaimer}>
        *Music links open outside the app.
      </Text>
    </ScrollView>
  );
};

export default CalmDownPage;