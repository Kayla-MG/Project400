import { Ionicons } from "@expo/vector-icons";
import React from "react";

// Type definition for the icon function
interface IconProps {
  color: string;
  focused: boolean;
}

// NOTE: Using stats-chart for Home to represent a dashboard/summary.
export const icon = {
  index: ({ color, focused }: IconProps) =>
    focused ? (
      <Ionicons name="stats-chart" size={24} color={color} />
    ) : (
      <Ionicons name="stats-chart-outline" size={24} color={color} />
    ),
  log: ({ color, focused }: IconProps) =>
    focused ? (
      <Ionicons name="book" size={25} color={color} />
    ) : (
      <Ionicons name="book-outline" size={25} color={color} />
    ),
  calm: ({ color, focused }: IconProps) =>
    focused ? (
      <Ionicons name="moon" size={22} color={color} />
    ) : (
      <Ionicons name="moon-outline" size={22} color={color} />
    ),
  settings: ({ color, focused }: IconProps) =>
    focused ? (
      <Ionicons name="settings" size={24} color={color} />
    ) : (
      <Ionicons name="settings-outline" size={24} color={color} />
    ),
};