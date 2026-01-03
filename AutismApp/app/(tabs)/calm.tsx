import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Linking, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    Easing,
    useAnimatedProps,
} from 'react-native-reanimated';
import {  withTiming } from 'react-native-reanimated'

// Since we are using Animated styles on the Circle/SVG, we need to register the component
// This is necessary for Reanimated to work correctly on non-native components like View/Circle
const AnimatedCircle = Animated.createAnimatedComponent(View);

const { width } = Dimensions.get("window");

// --- Design Constants ---
const PRIMARY_COLOR = '#4C8A8C'; // Calming Teal/Green
const ACCENT_COLOR = '#FFC107'; // Yellow accent
const BACKGROUND_COLOR = '#F5F5F5';
const TILE_WIDTH = width / 2 - 20;
const MARCONI_UNION_LINK = 'https://youtu.be/qYnA9wWFHLI?si=6jrCVbojyGa0qxVK';


// --- Component: Visual Calming Tool (Tool 2) ---
const VisualCalmGuide = ({ onStop }: { onStop: () => void }) => {
    const calmingVideos = [
        { name: 'Northern Lights', icon: 'sparkles-outline', url: 'https://www.youtube.com/watch?v=I8XAzVNSA84', color: '#56CCF2' },
        { name: 'Ocean Waves', icon: 'water-outline', url: 'https://www.youtube.com/watch?v=r_VQpsG7EIY', color: '#2D9CDB' },
        { name: 'Soothing Bubbles', icon: 'balloon-outline', url: 'https://youtu.be/2pXFIYjMXKk?si=ZWeh-DdZuaz7yaVZ', color: '#BB6BD9' },
    ];

    const handleLinkPress = async (url: string) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert('Link Error', 'Cannot open link. Ensure YouTube is available.', [{ text: 'OK' }]);
        }
    };

    return (
        <View style={visualStyles.container}>
            <Text style={visualStyles.header}>Visual Calming Focus</Text>
            <Text style={visualStyles.subtitle}>Focus on predictable, low-stimulus motion to regain control.</Text>
            
            <View style={visualStyles.grid}>
                {calmingVideos.map(video => (
                    <TouchableOpacity
                        key={video.name}
                        style={[visualStyles.videoButton, { backgroundColor: video.color }]}
                        onPress={() => handleLinkPress(video.url)}
                    >
                        <Ionicons name={video.icon as any} size={40} color="white" />
                        <Text style={visualStyles.videoButtonText}>{video.name}</Text>
                        <Text style={visualStyles.videoButtonSubtext}>(Opens YouTube)</Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            <TouchableOpacity onPress={onStop} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>← Back to Tools</Text>
            </TouchableOpacity>
        </View>
    );
};
// --- END VisualCalmGuide Component ---


// --- Component: Stretch/Move Guide (Tool 3) ---
const StretchMoveGuide = ({ onStop }: { onStop: () => void }) => {
    return (
        <View style={stretchStyles.container}>
            <Text style={stretchStyles.header}>Move to Regulate</Text>
            <Text style={stretchStyles.subtitle}>Movement helps shift focus and release tension.</Text>

            <View style={stretchStyles.card}>
                <Ionicons name="walk-outline" size={36} color={PRIMARY_COLOR} />
                <Text style={stretchStyles.cardTitle}>Option 1: Go for a Short Walk</Text>
                <Text style={stretchStyles.cardContent}>
                    Step away from the current environment. Take 5 minutes to walk slowly in a quiet area. Focus on the feeling of your feet hitting the ground.
                </Text>
            </View>

            <View style={stretchStyles.card}>
                <Ionicons name="body-outline" size={36} color={PRIMARY_COLOR} />
                <Text style={stretchStyles.cardTitle}>Option 2: Simple Stretches</Text>
                <Text style={stretchStyles.cardContent}>
                    1. Raise both arms high and stretch your back.
                    2. Slowly turn your head side-to-side (5 times).
                    3. Gently roll your shoulders back (5 times).
                </Text>
            </View>
            
            <TouchableOpacity onPress={onStop} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>← Back to Tools</Text>
            </TouchableOpacity>
        </View>
    );
};
// --- END StretchMoveGuide Component ---


// --- Component: External Link Display (Tool 4: Listen to Music) ---
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


// --- Component: Fidget / Squeeze Guide (Tool 5) ---
const FidgetSqueezeGuide = ({ onStop }: { onStop: () => void }) => {
    return (
        <View style={fidgetStyles.container}>
            <Text style={fidgetStyles.header}>Fidget & Squeeze</Text>
            <Text style={fidgetStyles.subtitle}>Tactile input helps ground you and redirect energy.</Text>
            
            <View style={fidgetStyles.card}>
                <Ionicons name="bulb-outline" size={30} color={PRIMARY_COLOR} />
                <Text style={fidgetStyles.cardTitle}>Find Your Tool</Text>
                <Text style={fidgetStyles.cardContent}>
                    Engage with a favorite sensory object (stress ball, soft fabric, fidget spinner, or tangle toy). If you have a weighted blanket or vest, using it now may help.
                </Text>
            </View>
            
            <View style={fidgetStyles.card}>
                <Ionicons name="swap-horizontal-outline" size={30} color={PRIMARY_COLOR} />
                <Text style={fidgetStyles.cardTitle}>The Squeeze & Release</Text>
                <Text style={fidgetStyles.cardContent}>
                    Squeeze your hands/fists tightly for 5 seconds, focusing on the tension. Then, release completely. Repeat 3 times to release physical tension.
                </Text>
            </View>
            
            <TouchableOpacity onPress={onStop} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>← Back to Tools</Text>
            </TouchableOpacity>
        </View>
    );
};
// --- END FidgetSqueezeGuide Component ---


// --- Component: Countdown Timer Tool (Tool 6) ---
const CountdownTimer = ({ onStop }: { onStop: () => void }) => {
    const INITIAL_COUNTDOWN_SECONDS = 10;
    const [timeLeft, setTimeLeft] = useState(INITIAL_COUNTDOWN_SECONDS);
    const [isRunning, setIsRunning] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);
    const intervalRef = useRef<number | null>(null); 

    useEffect(() => {
        if (isRunning) {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
            
            intervalRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime === 1) {
                        clearInterval(intervalRef.current!);
                        if (isRepeating) {
                            setTimeLeft(INITIAL_COUNTDOWN_SECONDS);
                            return INITIAL_COUNTDOWN_SECONDS;
                        } else {
                            setIsRunning(false);
                            setTimeout(() => {
                                Alert.alert('Timer Done', '10 seconds complete! Tap "Back to Tools" when ready.');
                            }, 100);
                            return 0;
                        }
                    }
                    return prevTime - 1;
                });
            }, 1000) as unknown as number; 
        } else if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning, isRepeating]);

    const toggleRun = () => {
        if (timeLeft === 0) {
            setTimeLeft(INITIAL_COUNTDOWN_SECONDS);
            setIsRunning(true);
        } else {
            setIsRunning(!isRunning);
        }
    };

    const resetTimer = () => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsRunning(false);
        setIsRepeating(false);
        setTimeLeft(INITIAL_COUNTDOWN_SECONDS);
    };

    return (
        <View style={timerStyles.container}>
            <Text style={timerStyles.header}>
                - Focus Countdown - 
                Take a deep breath to the timer if you need</Text>
            
            {/* Large Visual Timer Display */}
            <View style={[timerStyles.timerDisplay, { borderColor: isRunning ? PRIMARY_COLOR : '#ccc' }]}>
                <Text style={timerStyles.timerText}>{timeLeft}</Text>
            </View>

            {/* Controls */}
            <View style={timerStyles.controlsContainer}>
                <TouchableOpacity 
                    style={timerStyles.controlButton} 
                    onPress={toggleRun}
                    disabled={timeLeft === 0 && !isRepeating}
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


// --- Main Calm Down Page ---
interface Tool { 
    name: string;
    icon: string;
    color: string;
    actionType: 'internal' | 'link' | 'timer'| 'stretch' | 'visual' | 'fidget';
}

const CalmDownPage = () => {
  const [showExternalMusicLink, setShowExternalMusicLink] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showStretchMove, setShowStretchMove] = useState(false);
  const [showVisualCalm, setShowVisualCalm] = useState(false); 
  const [showFidget, setShowFidget] = useState(false); 

  const tools: Tool[] = [
    { name: 'Visual Calming', icon: 'eye-outline', color: '#56CCF2', actionType: 'visual' }, 
    { name: 'Stretch / Move', icon: 'walk-outline', color: '#fceb2aff', actionType: 'stretch' },
    { name: 'Listen To Music', icon: 'musical-notes-outline', color: '#8A2BE2', actionType: 'link' }, 
    { name: 'Fidget / Squeeze', icon: 'hand-left-outline', color: '#f9a10aff', actionType: 'fidget' }, 
    { name: 'Countdown / Timer', icon: 'time-outline', color: '#db2dcdff', actionType: 'timer' },
  ];

  const handleToolPress = (tool: Tool) => {
    // Reset all views before opening the selected one
    setShowExternalMusicLink(false);
    setShowTimer(false);
    setShowStretchMove(false);
    setShowVisualCalm(false);
    setShowFidget(false);

    if (tool.actionType === 'link') {
      setShowExternalMusicLink(true);
    } else if (tool.actionType === 'timer') {
      setShowTimer(true);
    } else if (tool.actionType === 'stretch') { 
      setShowStretchMove(true);
    } else if (tool.actionType === 'visual') { 
      setShowVisualCalm(true); 
    } else if (tool.actionType === 'fidget') { 
      setShowFidget(true); 
    } else {
      console.log(`Launching internal tool: ${tool.name}`);
      Alert.alert('Tool Selected', `Launching internal ${tool.name} tool.`, [{ text: 'OK' }]);
    }
  };
  
  // CONDITIONAL RENDERING CHAIN (Only one component renders at a time)
  if (showTimer) {
    return <CountdownTimer onStop={() => setShowTimer(false)} />;
  }
  if (showStretchMove) {
    return <StretchMoveGuide onStop={() => setShowStretchMove(false)} />;
  }
  if (showVisualCalm) {
    return <VisualCalmGuide onStop={() => setShowVisualCalm(false)} />;
  }
  if (showFidget) {
    return <FidgetSqueezeGuide onStop={() => setShowFidget(false)} />;
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
  // --- Close Button Styling (Reused) ---
  closeButton: {
    marginTop: 40,
    padding: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  // --- MUSIC LINK STYLES (ExternalMusicLink) ---
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
});

// --- STYLES FOR COUNTDOWN TIMER ---
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
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    timerText: {
        fontSize: 100,
        fontWeight: '200',
        color: PRIMARY_COLOR,
        zIndex: 2,
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
});

// --- STYLES FOR STRETCH / MOVE GUIDE ---
const stretchStyles = StyleSheet.create({
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
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: PRIMARY_COLOR,
        marginTop: 10,
        marginBottom: 5,
    },
    cardContent: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
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

// --- STYLES FOR VISUAL CALM GUIDE ---
const visualStyles = StyleSheet.create({
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
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    grid: {
        flexDirection: 'column',
        gap: 15,
        width: '100%',
    },
    videoButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    videoButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
        marginLeft: 15,
    },
    videoButtonSubtext: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.8)',
        marginLeft: 'auto',
        alignSelf: 'flex-end',
    }
});

// --- STYLES FOR FIDGET GUIDE ---
const fidgetStyles = StyleSheet.create({
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
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: ACCENT_COLOR,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: PRIMARY_COLOR,
        marginTop: 10,
        marginBottom: 5,
    },
    cardContent: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
    },
});