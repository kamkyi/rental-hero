import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { palette, shadows } from "@/constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.samsungBlue,
        tabBarInactiveTintColor: "#91A2BB",
        tabBarStyle: {
          height: 74,
          paddingTop: 10,
          paddingBottom: 12,
          backgroundColor: palette.white,
          borderTopWidth: 0,
          ...shadows.card,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="cars"
        options={{
          title: "Car",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "car-sport" : "car-sport-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bike"
        options={{
          title: "Bike",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "bicycle" : "bicycle-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
