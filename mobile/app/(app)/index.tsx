import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/constants/Colors";
import Badge from "@/components/ui/Badge";

type Stat = { label: string; value: string | number; color?: string };

export default function DashboardScreen() {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stat[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);

  useEffect(() => { if (profile) load(); }, [profile]);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [{ count: pending }, { count: accepted }, { data: apps }] = await Promise.all([
      supabase.from("applications").select("*", { count: "exact", head: true }).eq("marshal_id", user.id).eq("status", "pending"),
      supabase.from("applications").select("*", { count: "exact", head: true }).eq("marshal_id", user.id).eq("status", "accepted"),
      supabase.from("applications").select("*, events(id, title, event_date, location)").eq("marshal_id", user.id).eq("status", "accepted").order("created_at", { ascending: false }).limit(3),
    ]);

    setStats([
      { label: "En attente", value: pending ?? 0, color: Colors.blue },
      { label: "Acceptées", value: accepted ?? 0, color: Colors.green },
    ]);
    setUpcoming(apps?.map((a: any) => a.events).filter(Boolean) ?? []);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={s.container}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.hello}>Bonjour 👋</Text>
            <Text style={s.name}>{profile?.full_name ?? "Commissaire"}</Text>
          </View>
          {profile?.avatar_url
            ? <Image source={{ uri: profile.avatar_url }} style={s.avatar} />
            : <View style={[s.avatar, s.avatarFallback]}><Text style={{ color: Colors.white, fontWeight: "800", fontSize: 18 }}>{profile?.full_name?.[0] ?? "?"}</Text></View>
          }
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {stats.map((st) => (
            <View key={st.label} style={s.statCard}>
              <Text style={[s.statVal, { color: st.color ?? Colors.dark }]}>{st.value}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>

        {/* Upcoming */}
        <Text style={s.sectionTitle}>Prochains événements</Text>
        {upcoming.length === 0
          ? <View style={s.empty}><Text style={s.emptyText}>Aucun événement à venir.</Text></View>
          : upcoming.map((ev) => (
            <TouchableOpacity key={ev.id} style={s.upcomingCard} onPress={() => router.push(`/(app)/events/${ev.id}`)}>
              <View style={s.upcomingDot} />
              <View style={{ flex: 1 }}>
                <Text style={s.upcomingTitle}>{ev.title}</Text>
                <Text style={s.upcomingMeta}>{new Date(ev.event_date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</Text>
                {ev.location && <Text style={s.upcomingMeta}>📍 {ev.location}</Text>}
              </View>
              <Badge label="ACCEPTÉ" variant="green" />
            </TouchableOpacity>
          ))
        }

        {/* Quick actions */}
        <Text style={s.sectionTitle}>Actions rapides</Text>
        <View style={s.actionsGrid}>
          {[
            { icon: "📅", label: "Parcourir les événements", onPress: () => router.push("/(app)/events/index") },
            { icon: "📋", label: "Mes candidatures", onPress: () => router.push("/(app)/applications") },
            { icon: "📷", label: "Scanner un QR", onPress: () => router.push("/(app)/checkin") },
            { icon: "👤", label: "Mon profil", onPress: () => router.push("/(app)/profile") },
          ].map((a) => (
            <TouchableOpacity key={a.label} style={s.actionCard} onPress={a.onPress}>
              <Text style={s.actionIcon}>{a.icon}</Text>
              <Text style={s.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  hello: { fontSize: 14, color: Colors.gray, fontWeight: "600" },
  name: { fontSize: 24, fontWeight: "900", color: Colors.dark },
  avatar: { width: 48, height: 48, borderRadius: 14 },
  avatarFallback: { backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 28 },
  statCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, alignItems: "center" },
  statVal: { fontSize: 28, fontWeight: "900" },
  statLabel: { fontSize: 11, color: Colors.gray, fontWeight: "700", marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: Colors.dark, marginBottom: 12, marginTop: 8 },
  empty: { backgroundColor: Colors.white, borderRadius: 16, padding: 24, alignItems: "center", borderWidth: 1, borderColor: Colors.border, marginBottom: 20 },
  emptyText: { color: Colors.gray, fontSize: 14 },
  upcomingCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.border, flexDirection: "row", alignItems: "center", gap: 12 },
  upcomingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.green, flexShrink: 0 },
  upcomingTitle: { fontSize: 14, fontWeight: "700", color: Colors.dark },
  upcomingMeta: { fontSize: 12, color: Colors.gray, marginTop: 1 },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  actionCard: { width: "47%", backgroundColor: Colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border, alignItems: "center", gap: 8 },
  actionIcon: { fontSize: 28 },
  actionLabel: { fontSize: 12, fontWeight: "700", color: Colors.dark, textAlign: "center" },
});
