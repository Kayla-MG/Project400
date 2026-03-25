import { 
  ImageBackground, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  TextInput,
  ActivityIndicator,
  Alert
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import Animated, {FadeInDown, FadeInRight} from "react-native-reanimated";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Page = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async () => {
    // DEBUG: This will show in your terminal exactly which mode the app is in
    console.log("Current Mode:", isRegistering ? "REGISTRATION" : "LOGIN");
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(username)) {
      Alert.alert("Invalid Email", "Please enter a valid email address (e.g. name@email.com)");
      return;
    }

    setLoading(true);
    const endpoint = isRegistering ? '/api/register' : '/api/login';
    
    try {
      // Ensure this matches your laptop's current IPv4 address
      const response = await fetch(`http://192.168.1.45:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegistering) {
          Alert.alert("Success", "Account created! Now please login.");
          setIsRegistering(false);
        } else {
          await AsyncStorage.setItem('userToken', data.token);
          await AsyncStorage.setItem('userName', data.username);
          await AsyncStorage.setItem('userId', data.userId.toString());
          router.replace("/(tabs)");
        }
      } else {
        Alert.alert("Auth Failed", data.error || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Ensure server is running and IP is correct");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require("@/assets/images/jigsaw.jpg")} style={{flex:1}} resizeMode="cover">
        <View style={styles.wrapper}>
          <Animated.Text style={styles.title} entering={FadeInRight.delay(300)}>
            {isRegistering ? "Create Account" : "Autism App"}
          </Animated.Text>
          
          <Animated.Text style={styles.description} entering={FadeInRight.delay(500)}>
            {isRegistering ? "Join our safe space today." : "Welcome back to your safe space."}
          </Animated.Text>

          <View style={styles.form}>
            {/* PRIVACY TIP: Only shows when Registering */}
            {isRegistering && (
              <Animated.View entering={FadeInDown.delay(200)} style={styles.privacyPrompt}>
                <Text style={styles.privacyText}>
                  🔒 Privacy Tip: Use an email address that doesn't 
                  contain any PERSONAL DETAILS.
                </Text>
              </Animated.View>
            )}

            <TextInput 
              placeholder="Email Address" 
              placeholderTextColor="#ddd"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
            
            <TextInput 
              placeholder="Password" 
              placeholderTextColor="#ddd"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleAuth} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>
              {isRegistering ? "Sign Up" : "Login"}
            </Text>}
          </TouchableOpacity>

          <TouchableOpacity 
          onPress={() => {
            setIsRegistering(!isRegistering);
            setUsername(""); // Clear email field on switch
            setPassword(""); //Clear password field on switch
          }}
           style={{marginTop: 20}}>
            <Text style={styles.toggleText}>
              {isRegistering ? "Already have an account? Login" : "First time? Create an account"}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.blue },
  wrapper: { flex: 1, justifyContent: 'center', paddingHorizontal: 30, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  title: { color: Colors.white, fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 10 },
  description: { color: Colors.white, fontSize: 16, textAlign: 'center', marginBottom: 30 },
  form: { gap: 15, marginBottom: 20 },
  input: { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 10, padding: 15, color: '#fff', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' },
  btn: { backgroundColor: Colors.orange, paddingVertical: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  toggleText: { color: Colors.white, textAlign: 'center', fontSize: 14, textDecorationLine: 'underline' },
  // New Styles for Privacy Tip
  privacyPrompt: {
    backgroundColor: 'rgba(255, 165, 0, 0.2)', 
    padding: 12,
    borderRadius: 8,
    marginBottom: 5,
    borderLeftWidth: 4,
    borderLeftColor: Colors.orange,
  },
  privacyText: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});