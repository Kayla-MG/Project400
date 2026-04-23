import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Linking, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSensoryTheme, ALL_TOOLS } from '@/constants/useSensoryTheme';

const { width } = Dimensions.get("window");

// --- Design Constants ---
const PRIMARY_COLOR = '#4C8A8C'; 
const ACCENT_COLOR = '#FFC107'; 
const TILE_WIDTH = width / 2 - 20;
const MARCONI_UNION_LINK = 'https://youtu.be/qYnA9wWFHLI?si=6jrCVbojyGa0qxVK';

// --- Component: Visual Calming Tool ---
const VisualCalmGuide = ({ onStop }: { onStop: () => void }) => {
    const theme = useSensoryTheme();
    const calmingVideos = [
        { name: 'Northern Lights', icon: 'sparkles-outline', url: 'https://www.youtube.com/watch?v=I8XAzVNSA84', color: '#56CCF2' },
        { name: 'Ocean Waves', icon: 'water-outline', url: 'https://www.youtube.com/watch?v=r_VQpsG7EIY', color: '#2D9CDB' },
        { name: 'Soothing Bubbles', icon: 'balloon-outline', url: 'https://youtu.be/2pXFIYjMXKk?si=ZWeh-DdZuaz7yaVZ', color: '#BB6BD9' },
    ];

    const handleLinkPress = async (url: string) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) { await Linking.openURL(url); } 
        else { Alert.alert('Link Error', 'Cannot open link.'); }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={[visualStyles.container, { backgroundColor: theme.background }]}>
                <Text style={[visualStyles.header, { color: theme.isSoftMode ? '#555' : PRIMARY_COLOR }]}>Visual Calming Focus</Text>
                <Text style={[visualStyles.subtitle, { color: theme.text }]}>Focus on predictable, low-stimulus motion.</Text>
                
                <View style={visualStyles.grid}>
                    {calmingVideos.map(video => (
                        <TouchableOpacity
                            key={video.name}
                            style={[visualStyles.videoButton, { backgroundColor: video.color }]}
                            onPress={() => handleLinkPress(video.url)}
                        >
                            <Ionicons name={video.icon as any} size={40} color="white" />
                            <Text style={visualStyles.videoButtonText}>{video.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                
                <TouchableOpacity onPress={onStop} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>← Back to Tools</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

// --- Component: Stretch/Move Guide ---
const StretchMoveGuide = ({ onStop }: { onStop: () => void }) => {
    const theme = useSensoryTheme();
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={[stretchStyles.container, { backgroundColor: theme.background }]}>
                <Text style={[stretchStyles.header, { color: theme.isSoftMode ? '#555' : PRIMARY_COLOR }]}>Move to Regulate</Text>
                <Text style={[stretchStyles.subtitle, { color: theme.text }]}>Movement helps shift focus and release tension.</Text>

                <View style={[stretchStyles.card, { backgroundColor: theme.card }]}>
                    <Ionicons name="walk-outline" size={36} color={PRIMARY_COLOR} />
                    <Text style={[stretchStyles.cardTitle, { color: theme.isSoftMode ? '#555' : PRIMARY_COLOR }]}>Option 1: Short Walk</Text>
                    <Text style={[stretchStyles.cardContent, { color: theme.text }]}>Step away from the current environment. Take 5 minutes to walk slowly.</Text>
                </View>

                <View style={[stretchStyles.card, { backgroundColor: theme.card }]}>
                    <Ionicons name="body-outline" size={36} color={PRIMARY_COLOR} />
                    <Text style={[stretchStyles.cardTitle, { color: theme.isSoftMode ? '#555' : PRIMARY_COLOR }]}>Option 2: Simple Stretches</Text>
                    <Text style={[stretchStyles.cardContent, { color: theme.text }]}>1. Raise arms high. 2. Turn head side-to-side. 3. Roll shoulders.</Text>
                </View>
                
                <TouchableOpacity onPress={onStop} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>← Back to Tools</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

// --- Component: Fidget / Squeeze Guide ---
const FidgetSqueezeGuide = ({ onStop }: { onStop: () => void }) => {
    const theme = useSensoryTheme();
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={[fidgetStyles.container, { backgroundColor: theme.background }]}>
                <Text style={[fidgetStyles.header, { color: theme.isSoftMode ? '#555' : PRIMARY_COLOR }]}>Fidget & Squeeze</Text>
                <Text style={[fidgetStyles.subtitle, { color: theme.text }]}>Tactile input helps ground you.</Text>
                
                <View style={[fidgetStyles.card, { backgroundColor: theme.card }]}>
                    <Ionicons name="bulb-outline" size={30} color={PRIMARY_COLOR} />
                    <Text style={[fidgetStyles.cardTitle, { color: theme.isSoftMode ? '#555' : PRIMARY_COLOR }]}>Find Your Tool</Text>
                    <Text style={[fidgetStyles.cardContent, { color: theme.text }]}>Engage with a favorite sensory object (stress ball, fabric, tangle toy).</Text>
                </View>
                
                <TouchableOpacity onPress={onStop} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>← Back to Tools</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

// --- Component: Countdown Timer Tool ---
const CountdownTimer = ({ onStop }: { onStop: () => void }) => {
    const theme = useSensoryTheme();
    const INITIAL_COUNTDOWN_SECONDS = 10;
    const [timeLeft, setTimeLeft] = useState(INITIAL_COUNTDOWN_SECONDS);
    const [isRunning, setIsRunning] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);
    const intervalRef = useRef<number | null>(null); 

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev === 1) {
                        if (!isRepeating) setIsRunning(false);
                        return isRepeating ? INITIAL_COUNTDOWN_SECONDS : 0;
                    }
                    return prev - 1;
                });
            }, 1000) as unknown as number; 
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isRunning, isRepeating]);

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <View style={[timerStyles.container, { backgroundColor: theme.background }]}>
                <Text style={[timerStyles.header, { color: theme.isSoftMode ? '#555' : PRIMARY_COLOR }]}>- Focus Countdown -</Text>
                <Text style={[timerStyles.subtitle, { color: theme.text }]}>Take a deep breath to the timer</Text> 
                
                <View style={[timerStyles.timerDisplay, { borderColor: isRunning ? PRIMARY_COLOR : '#ccc', backgroundColor: theme.card }]}>
                    <Text style={[timerStyles.timerText, { color: theme.isSoftMode ? '#555' : PRIMARY_COLOR }]}>{timeLeft}</Text>
                </View>

                <View style={timerStyles.controlsContainer}>
                    <TouchableOpacity style={timerStyles.controlButton} onPress={() => setIsRunning(!isRunning)}>
                        <Text style={timerStyles.controlButtonText}>{isRunning ? 'Pause' : 'Start'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={timerStyles.controlButton} onPress={() => {setIsRunning(false); setTimeLeft(INITIAL_COUNTDOWN_SECONDS);}}>
                        <Text style={timerStyles.controlButtonText}>Reset</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={onStop} style={timerStyles.backButton}>
                    <Text style={[timerStyles.backButtonText, { color: theme.text }]}>← Back to Tools</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// --- Main Calm Down Page ---
interface Tool { 
    name: string; icon: string; color: string; 
    actionType: 'link' | 'timer'| 'stretch' | 'visual' | 'fidget';
}

const CalmDownPage = () => {
    const theme = useSensoryTheme();
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const visibleTools = ALL_TOOLS
        .filter(t => theme.enabledTools[t.name] !== false)
        .map(t => ({ ...t, color: theme.toolColours[t.name] || '#888' }));

    if (activeTool === 'timer') return <CountdownTimer onStop={() => setActiveTool(null)} />;
    if (activeTool === 'stretch') return <StretchMoveGuide onStop={() => setActiveTool(null)} />;
    if (activeTool === 'visual') return <VisualCalmGuide onStop={() => setActiveTool(null)} />;
    if (activeTool === 'fidget') return <FidgetSqueezeGuide onStop={() => setActiveTool(null)} />;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.title, { color: theme.isSoftMode ? '#555' : '#4A90E2' }]}>De-escalation Toolkit</Text>
                <Text style={[styles.subtitle, { color: theme.text }]}>Tap a strategy for immediate relief.</Text>

                <View style={styles.grid}>
                    {visibleTools.map((t) => (
                        <TouchableOpacity
                            key={t.name}
                            style={[styles.toolButton, { backgroundColor: theme.isSoftMode ? theme.card : t.color, borderWidth: theme.isSoftMode ? 1 : 0, borderColor: '#DDD' }]}
                            onPress={() => t.actionType === 'link' ? Linking.openURL(MARCONI_UNION_LINK) : setActiveTool(t.actionType)}
                        >
                            <Ionicons name={t.icon as any} size={40} color={theme.isSoftMode ? t.color : "white"} />
                            <Text style={[styles.toolLabel, { color: theme.isSoftMode ? '#444' : 'white' }]}>{t.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CalmDownPage;

// --- Combined Styles ---
const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    scrollContent: { alignItems: 'center', paddingHorizontal: 15, paddingBottom: 80 },
    title: { fontSize: 26, fontWeight: "800", marginBottom: 10, marginTop: 20, textAlign: 'center' },
    subtitle: { fontSize: 16, marginBottom: 25, textAlign: 'center' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },
    toolButton: { width: TILE_WIDTH, height: TILE_WIDTH, marginVertical: 8, borderRadius: 15, alignItems: 'center', justifyContent: 'center', elevation: 4, padding: 10 },
    toolLabel: { fontSize: 14, fontWeight: '600', marginTop: 8, textAlign: 'center' },
    closeButton: { marginTop: 40, padding: 15, backgroundColor: '#E0E0E0', borderRadius: 8, alignSelf: 'center' },
    closeButtonText: { color: '#333', fontSize: 16, fontWeight: '600' },
});

const timerStyles = StyleSheet.create({
    container: { flex: 1, width: '100%', padding: 30, alignItems: 'center' },
    header: { fontSize: 24, fontWeight: '800', marginBottom: 5 },
    subtitle: { fontSize: 16, marginBottom: 30, textAlign: 'center' },
    timerDisplay: { width: 220, height: 220, borderRadius: 110, borderWidth: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
    timerText: { fontSize: 80, fontWeight: '200' },
    controlsContainer: { flexDirection: 'row', gap: 20, marginBottom: 20 },
    controlButton: { backgroundColor: PRIMARY_COLOR, padding: 15, borderRadius: 10, width: 100, alignItems: 'center' },
    controlButtonText: { color: '#FFF', fontWeight: '600' },
    backButton: { marginTop: 40 },
    backButtonText: { fontSize: 16, textDecorationLine: 'underline' }
});

const stretchStyles = StyleSheet.create({
    container: { padding: 30, alignItems: 'center' },
    header: { fontSize: 24, fontWeight: '800', marginBottom: 10 },
    subtitle: { fontSize: 16, marginBottom: 30, textAlign: 'center' },
    card: { width: '100%', borderRadius: 15, padding: 20, marginBottom: 20, elevation: 3 },
    cardTitle: { fontSize: 18, fontWeight: '700', marginTop: 10, marginBottom: 5 },
    cardContent: { fontSize: 15, lineHeight: 22 },
});

const visualStyles = StyleSheet.create({
    container: { padding: 30, alignItems: 'center' },
    header: { fontSize: 24, fontWeight: '800', marginBottom: 10 },
    subtitle: { fontSize: 16, marginBottom: 30, textAlign: 'center' },
    grid: { flexDirection: 'column', gap: 15, width: '100%' },
    videoButton: { width: '100%', flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 10, elevation: 4 },
    videoButtonText: { fontSize: 18, fontWeight: '700', color: 'white', marginLeft: 15 },
});

const fidgetStyles = StyleSheet.create({
    container: { padding: 30, alignItems: 'center' },
    header: { fontSize: 24, fontWeight: '800', marginBottom: 10 },
    subtitle: { fontSize: 16, marginBottom: 30, textAlign: 'center' },
    card: { width: '100%', borderRadius: 15, padding: 20, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: ACCENT_COLOR, elevation: 3 },
    cardTitle: { fontSize: 18, fontWeight: '700', marginTop: 10, marginBottom: 5 },
    cardContent: { fontSize: 15, lineHeight: 22 },
});