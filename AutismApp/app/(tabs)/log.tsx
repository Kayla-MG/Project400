import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router'; 
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get("window");

const Page = () => {

  const moods = [
    { name: "Happy", icon: "happy-outline", color: Colors.green },
    { name: "Angry", icon: "flame-outline", color: Colors.red, link: "/calm" },
    { name: "Sad", icon: "sad-outline", color: "blue", link: "/calm" },
    { name: "Neutral", icon: "remove-circle-outline", color:Colors.neutral },
    { name: "Overwhelmed", icon: "thunderstorm-outline", color: Colors.orange, link: "/calm" },
    { name: "Tired", icon: "moon-outline", color: Colors.purple},
    { name: "Calm", icon: "leaf-outline", color: Colors.blue },
    { name: "Excited", icon: "flash-outline", color: Colors.pink },
    { name: "Anxious", icon: "help-circle-outline", color: Colors.peach },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>How are you feeling?</Text>

      <View style={styles.grid}>
        {moods.map((m) => {
          const content = (
            <TouchableOpacity style={styles.tile}>
              <Ionicons name={m.icon as any} size={90} color={m.color} />
              <Text style={styles.label}>{m.name}</Text>
            </TouchableOpacity>
          );

          // If mood has a link, wrap in <Link>, otherwise just render TouchableOpacity
          return m.link ? (
            <Link key={m.name} href={m.link} asChild>
              {content}
            </Link>
          ) : (
            <View key={m.name}>{content}</View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 40,
    paddingBottom: 100,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  tile: {
    width: width * 0.4,
    height: width * 0.4,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    backgroundColor: "#f3f3f3",
    borderRadius: 20,
    elevation: 3,
  },
  label: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Page;
