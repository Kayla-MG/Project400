import { Ionicons } from "@expo/vector-icons";

export const icon = {
  home: ({ color, focused }: { color: string; focused: boolean }) =>
    focused ? (
      <Ionicons name="home" size={24} color={color} />
    ) : (
      <Ionicons name="home-outline" size={24} color={color} />
    ),
  log: ({ color, focused }: { color: string; focused: boolean }) =>
    focused ? (
      <Ionicons name="book" size={25} color={color} />
    ) : (
      <Ionicons name="book-outline" size={25} color={color} />
    ),
  calm: ({ color, focused }: { color: string; focused: boolean }) =>
    focused ? (
      <Ionicons name="happy" size={22} color={color} />
    ) : (
      <Ionicons name="happy-outline" size={22} color={color} />
    ),
  settings: ({ color, focused }: { color: string; focused: boolean }) =>
    focused ? (
      <Ionicons name="settings" size={24} color={color} />
    ) : (
      <Ionicons name="settings-outline" size={24} color={color} />
    ),
};