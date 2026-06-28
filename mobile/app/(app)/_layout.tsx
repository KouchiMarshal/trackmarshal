import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/hooks/useAuth";

export default function AppLayout() {
  const { profile } = useAuth();
  const isOrganizer = profile?.is_organizer || profile?.role === "admin";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          height: 84,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="events/index"
        options={{
          title: "Événements",
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="applications"
        options={{
          title: "Candidatures",
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} />,
        }}
      />
      {isOrganizer && (
        <Tabs.Screen
          name="organizer/index"
          options={{
            title: "Organiser",
            tabBarIcon: ({ color, size }) => <Ionicons name="flag-outline" size={size} color={color} />,
          }}
        />
      )}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
      {/* Hidden screens (no tab) */}
      <Tabs.Screen name="events/[id]" options={{ href: null }} />
      <Tabs.Screen name="organizer/events/[id]" options={{ href: null }} />
      <Tabs.Screen name="organizer/create" options={{ href: null }} />
      <Tabs.Screen name="checkin" options={{ href: null }} />
    </Tabs>
  );
}
