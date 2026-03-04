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
  const [isRegistering, setIsRegistering] = useState(false); // New toggle state

 
    const handleAuth = async () => {
  // 1. Basic check
  if (!username || !password) {
    Alert.alert("Error", "Please fill in all fields");
    return;
  }

  // 2. Email Validation (Regex)
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(username)) {
    Alert.alert("Invalid Email", "Please enter a valid email address (e.g. name@email.com)");
    return;
  }

  setLoading(true);
    // Choose the right endpoint based on the toggle
    const endpoint = isRegistering ? '/api/register' : '/api/login';
    
    try {
      // USE YOUR IP HERE: 192.168.1.45
      const response = await fetch(`http://192.168.1.45:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegistering) {
          Alert.alert("Success", "Account created! Now please login.");
          setIsRegistering(false); // Switch back to login mode
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
            <TextInput 
            placeholder="Email Address" // Changed from Username
            placeholderTextColor="#ddd"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            keyboardType="email-address" // Shows the '@' symbol on the mobile keyboard
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

          {/* Toggle Button */}
          <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)} style={{marginTop: 20}}>
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
  toggleText: { color: Colors.white, textAlign: 'center', fontSize: 14, textDecorationLine: 'underline' }
});