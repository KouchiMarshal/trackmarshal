import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default function OrganizerScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, upcoming: 0 });

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: evts } = await supabase
      .from("events")
      .select("*, applications(count)")
      .eq("organizer_id", user.id)
      .order("event_date", { ascending: false });

    const { count: pendingCount } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .in("event_id", (evts ?? []).map((e: any) => e.id))
      .eq("status", "pending");

    const upcomingCount = (evts ?? []).filter((e: any) => new Date(e.event_date) >= new Date()).length;

    setEvents(evts ?? []);
    setStats({ total: (evts ?? []).length, pending: pendingCount ?? 0, upcoming: upcomingCount });
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={s.header}>
        <Text style={s.title}>Espace organisateur</Text>
        <TouchableOpacity style={s.createBtn} onPress={() => router.push("/(app)/organizer/create")}>
          <Ionicons name="add" size={20} color={Colors.white} />
          <Text style={s.createBtnText}>Créer</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        {[
          { label: "Événements", value: stats.total },
          { label: "À venir", value: stats.upcoming, color: Colors.green },
          { label: "En attente", value: stats.pending, color: Colors.primary },
        ].map((st) => (
          <View key={st.label} style={s.statCard}>
            <Text style={[s.statVal, { color: st.color ?? Colors.dark }]}>{st.value}</Text>
            <Text style={s.statLabel}>{st.label}</Text>
          </View>
        ))}
      </View>

      {loading
        ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator color={Colors.primary} /></View>
        : <FlatList
            data={events}
            keyExtractor={(e) => e.id}
            contentContainerStyle={s.list}
            renderItem={({ item }) => {
              const appCount = item.applications?.[0]?.count ?? 0;
              const isPast = new Date(item.event_date) < new Date();
              return (
                <TouchableOpacity style={s.card} onPress={() => router.push(`/(app)/organizer/events/${item.id}`)}>
                  <View style={s.cardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.cardTitle} numberOfLines={2}>{item.title}</Text>
                      <Text style={s.cardMeta}>{fmtDate(item.event_date)}</Text>
                      {item.location && <Text style={s.cardMeta}>📍 {item.location}</Text>}
                    </View>
                    <View style={s.cardRight}>
                      <Text style={[s.cardStatus, { color: isPast ? Colors.gray : Colors.green }]}>
                        {isPast ? "Passé" : "À venir"}
                      </Text>
                      <Text style={s.cardApps}>{appCount} candidature{appCount !== 1 ? "s" : ""}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={s.empty}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>🏁</Text>
                <Text style={s.emptyTitle}>Aucun événement créé</Text>
                <Text style={s.emptyText}>Crée ton premier événement pour commencer à recruter des commissaires.</Text>
                <TouchableOpacity style={s.emptyBtn} onPress={() => router.push("/(app)/organizer/create")}>
                  <Text style={s.emptyBtnText}>Créer un événement</Text>
                </TouchableOpacity>
              </View>
            }
          />
      }
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: "900", color: Colors.dark },
  createBtn: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9 },
  createBtnText: { color: Colors.white, fontSize: 14, fontWeight: "800" },
  statsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 8 },
  statCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: Colors.border, alignItems: "center" },
  statVal: { fontSize: 22, fontWeight: "900" },
  statLabel: { fontSize: 10, color: Colors.gray, fontWeight: "700", marginTop: 2, textTransform: "uppercase" },
  list: { padding: 20, paddingTop: 8, paddingBottom: 40 },
  card: { backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  cardTop: { flexDirection: "row", gap: 12 },
  cardTitle: { fontSize: 15, fontWeight: "800", color: Colors.dark, lineHeight: 20 },
  cardMeta: { fontSize: 12, color: Colors.gray, marginTop: 2 },
  cardRight: { alignItems: "flex-end", gap: 4 },
  cardStatus: { fontSize: 11, fontWeight: "700" },
  cardApps: { fontSize: 11, color: Colors.gray, fontWeight: "600" },
  empty: { padding: 40, alignItems: "center" },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: Colors.dark, marginBottom: 8 },
  emptyText: { fontSize: 14, color: Colors.gray, textAlign: "center", lineHeight: 20, marginBottom: 20 },
  emptyBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12 },
  emptyBtnText: { color: Colors.white, fontWeight: "800", fontSize: 15 },
});
