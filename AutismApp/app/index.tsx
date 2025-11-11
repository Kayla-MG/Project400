import { 
  ImageBackground, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View 
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import Animated, {FadeInDown, FadeInRight} from "react-native-reanimated";
import { AnimatedView } from "react-native-reanimated/lib/typescript/component/View";

const Page = () => {
  const router = useRouter();
  return (

    <View style={styles.container}>
      <ImageBackground
      source={require("@/assets/images/welcome.jpg")}
      style={{flex:1}}
      resizeMode="cover"
>
      <View style={styles.wrapper}>
        <Animated.Text
        style={styles.title}
        entering={FadeInRight.delay(300).duration(500)}
        >
        Welcome!
        </Animated.Text>
        <Animated.Text
        style={styles.description}
        entering={FadeInRight.delay(700).duration(500)}
        >
          This is your safe space.Log how you feel.
        </Animated.Text>
      <AnimatedView>
      <TouchableOpacity
      onPress={() => router.replace("/(tabs)")}
      >
        <Text style={styles.btnText}>Get started</Text>
           </TouchableOpacity>
           </AnimatedView>
        </View>
   </ImageBackground>
  </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});