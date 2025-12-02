import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

// --- Design Constants (Defined here for local use) ---
const PRIMARY_COLOR = '#4C8A8C'; // Calming Teal/Green
const ACCENT_COLOR = '#FFC107'; // Yellow accent
const BACKGROUND_COLOR = '#F5F5F5';
const TILE_WIDTH = width / 3 - 20;
const INITIAL_COUNTDOWN_SECONDS = 10;
const MARCONI_UNION_LINK = 'https://www.youtube.com/watch?v=eQ6--TNre9k&list=PLtneXHSzis5GjlpcsTs8IuD3ktIz5u8bQ';


// --- Component: Countdown Timer Tool ---
const CountdownTimer = ({ onStop }: { onStop: () => void }) => {
    const [timeLeft, setTimeLeft] = useState(INITIAL_COUNTDOWN_SECONDS);
    const [isRunning, setIsRunning] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);
    const intervalRef = useRef<number | null>(null);
    // Timing logic (runs every second)
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime === 1) {
                        clearInterval(intervalRef.current!);
                        if (isRepeating) {
                            // Reset and restart if repeating is enabled
                            setTimeLeft(INITIAL_COUNTDOWN_SECONDS);
                            return INITIAL_COUNTDOWN_SECONDS;
                        } else {
                            setIsRunning(false);
                            // Show a brief completion message
                            setTimeout(() => {
                                Alert.alert('Timer Done', '10 seconds complete! Tap "Back to Tools" when ready.');
                            }, 100);
                            return 0;
                        }
                    }
                    return prevTime - 1;
                });
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Cleanup function for when the component unmounts
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, isRepeating]);

    const toggleRun = () => {
        if (timeLeft === 0) {
            // If timer finished, reset and start
            setTimeLeft(INITIAL_COUNTDOWN_SECONDS);
            setIsRunning(true);
        } else {
            // Toggle running state
            setIsRunning(!isRunning);
        }
    };

    const resetTimer = () => {
        clearInterval(intervalRef.current!);
        setIsRunning(false);
        setIsRepeating(false);
        setTimeLeft(INITIAL_COUNTDOWN_SECONDS);
    };

    const progress = timeLeft / INITIAL_COUNTDOWN_SECONDS;

    return (
        <View style={timerStyles.container}>
            <Text style={timerStyles.header}>Focus Countdown</Text>
            
            {/* Large Visual Timer Display */}
            <View style={[timerStyles.timerDisplay, { borderColor: isRunning ? PRIMARY_COLOR : '#ccc' }]}>
                <Text style={timerStyles.timerText}>{timeLeft}</Text>
                <View style={[timerStyles.progressBar, { width: `${progress * 100}%` }]} />
            </View>

            {/* Controls */}
            <View style={timerStyles.controlsContainer}>
                <TouchableOpacity 
                    style={timerStyles.controlButton} 
                    onPress={toggleRun}
                    disabled={timeLeft === 0 && !isRepeating} // Disable if finished and not repeating
                >
                    <Ionicons name={isRunning ? "pause-outline" : "play-outline"} size={30} color="#FFF" />
                    <Text style={timerStyles.controlButtonText}>{isRunning ? 'Pause' : 'Start'}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={timerStyles.controlButton} 
                    onPress={resetTimer}
                >
                    <Ionicons name="refresh-outline" size={30} color="#FFF" />
                    <Text style={timerStyles.controlButtonText}>Reset</Text>
                </TouchableOpacity>
            </View>

            {/* Repeat Toggle */}
            <View style={timerStyles.repeatToggle}>
                <Text style={timerStyles.repeatLabel}>Repeat Automatically?</Text>
                <TouchableOpacity onPress={() => setIsRepeating(!isRepeating)}>
                    <Ionicons 
                        name={isRepeating ? "checkbox-outline" : "square-outline"} 
                        size={24} 
                        color={isRepeating ? PRIMARY_COLOR : '#999'} 
                    />
                </TouchableOpacity>
            </View>

            {/* Back Button */}
            <TouchableOpacity onPress={onStop} style={timerStyles.backButton}>
                <Text style={timerStyles.backButtonText}>← Back to Tools</Text>
            </TouchableOpacity>
        </View>
    );
};
// --- END CountdownTimer Component ---


// --- Component: External Link Display (YouTube Only) ---
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
// --- END ExternalMusicLink Component ---


// --- Main Calm Down Page ---
const CalmDownPage = () => {
  const [showExternalMusicLink, setShowExternalMusicLink] = useState(false);
  const [showTimer, setShowTimer] = useState(false); // New state for Timer visibility

  const tools: Tool[] = [
    { name: 'Deep Breathing', icon: 'leaf-outline', color: '#6FCF97', actionType: 'internal' },
    { name: 'Visual Calming', icon: 'eye-outline', color: '#56CCF2', actionType: 'internal' },
    { name: 'Stretch / Move', icon: 'walk-outline', color: '#F2C94C', actionType: 'internal' },
    { name: 'Listen To Music', icon: 'musical-notes-outline', color: '#8A2BE2', actionType: 'link' }, 
    { name: 'Fidget / Squeeze', icon: 'hand-left-outline', color: '#F2994A', actionType: 'internal' },
    // Update this tool to launch the new Timer component
    { name: 'Countdown / Timer', icon: 'time-outline', color: '#2D9CDB', actionType: 'timer' },
  ];

  const handleToolPress = (tool: Tool) => {
    if (tool.actionType === 'link') {
      setShowExternalMusicLink(true);
    } else if (tool.actionType === 'timer') {
      setShowTimer(true); // Show the Timer component
    } else {
      // Logic for internal tools (Breathing, Visual Calming, etc.)
      console.log(`Launching internal tool: ${tool.name}`);
      Alert.alert('Tool Selected', `Launching internal ${tool.name} tool.`, [{ text: 'OK' }]);
    }
  };
  
  // Conditional rendering: If timer is active, show ONLY the timer.
  if (showTimer) {
    return <CountdownTimer onStop={() => setShowTimer(false)} />;
  }

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

// --- Styling ---

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
    flexDirection: 'row',
    justifyContent: 'center', 
    gap: 10,
  },
  linkButton: {
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

const timerStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        padding: 30,
        alignItems: 'center',
        backgroundColor: BACKGROUND_COLOR,
    },
    header: {
        fontSize: 24,
        fontWeight: '800',
        color: PRIMARY_COLOR,
        marginBottom: 30,
    },
    timerDisplay: {
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 10,
        // borderColor is set dynamically in the component
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', // Required for the progress bar animation
        marginBottom: 40,
    },
    timerText: {
        fontSize: 100,
        fontWeight: '200',
        color: PRIMARY_COLOR,
        zIndex: 2,
    },
    progressBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '100%',
        backgroundColor: '#D6EAF8', // Light blue progress fill
        opacity: 0.8,
        // width is set dynamically in the component
    },
    controlsContainer: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 20,
    },
    controlButton: {
        backgroundColor: PRIMARY_COLOR,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 80,
    },
    controlButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 5,
    },
    repeatToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#E6F0F0',
        borderRadius: 8,
    },
    repeatLabel: {
        fontSize: 16,
        color: PRIMARY_COLOR,
        marginRight: 10,
    },
    backButton: {
        marginTop: 40,
        padding: 10,
    },
    backButtonText: {
        color: '#666',
        fontSize: 16,
        textDecorationLine: 'underline',
    }
});