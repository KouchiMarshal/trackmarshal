import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";
import Badge from "@/components/ui/Badge";

type AppStatus = "pending" | "accepted" | "refused";

const statusMap = {
  pending:  { label: "EN ATTENTE", variant: "blue"  as const },
  accepted: { label: "ACCEPTÉ",    variant: "green" as const },
  refused:  { label: "REFUSÉ",     variant: "red"   as const },
};

export default function OrganizerEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | AppStatus>("all");

  useEffect(() => { load(); }, [id]);

  async function load() {
    const [{ data: ev }, { data: applications }] = await Promise.all([
      supabase.from("events").select("*").eq("id", id).single(),
      supabase.from("applications")
        .select("*, profiles(id, full_name, avatar_url, city, disciplines)")
        .eq("event_id", id)
        .order("created_at", { ascending: false }),
    ]);
    setEvent(ev);
    setApps(applications ?? []);
    setLoading(false);
  }

  async function updateStatus(appId: string, status: AppStatus) {
    const { error } = await supabase.from("applications").update({ status }).eq("id", appId);
    if (error) { Alert.alert("Erreur", error.message); return; }
    setApps((prev) => prev.map((a) => a.id === appId ? { ...a, status } : a));
  }

  const filtered = apps.filter((a) => filter === "all" || a.status === filter);
  const counts = { all: apps.length, pending: apps.filter((a) => a.status === "pending").length, accepted: apps.filter((a) => a.status === "accepted").length, refused: apps.filter((a) => a.status === "refused").length };

  if (loading) return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator color={Colors.primary} size="large" /></View>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={s.container}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.dark} />
        </TouchableOpacity>

        <Text style={s.title}>{event?.title}</Text>
        <Text style={s.sub}>{apps.length} candidature{apps.length !== 1 ? "s" : ""} reçue{apps.length !== 1 ? "s" : ""}</Text>

        {/* Filter */}
        <View style={s.filters}>
          {(["all", "pending", "accepted", "refused"] as const).map((f) => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[s.chip, filter === f && s.chipActive]}>
              <Text style={[s.chipText, filter === f && s.chipTextActive]}>
                {f === "all" ? `Toutes (${counts.all})` : f === "pending" ? `Attente (${counts.pending})` : f === "accepted" ? `Acceptées (${counts.accepted})` : `Refusées (${counts.refused})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Applications */}
        {filtered.length === 0
          ? <View style={s.empty}><Text style={s.emptyText}>Aucune candidature dans cette catégorie.</Text></View>
          : filtered.map((app) => {
            const p = app.profiles;
            const st = statusMap[app.status as AppStatus] ?? statusMap.pending;
            return (
              <View key={app.id} style={s.appCard}>
                <View style={s.appTop}>
                  <View style={s.appAvatar}>
                    <Text style={{ color: Colors.white, fontWeight: "800" }}>{p?.full_name?.[0] ?? "?"}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.appName}>{p?.full_name ?? "—"}</Text>
                    {p?.city && <Text style={s.appMeta}>📍 {p.city}</Text>}
                    {p?.disciplines && <Text style={s.appMeta}>{p.disciplines}</Text>}
                  </View>
                  <Badge label={st.label} variant={st.variant} />
                </View>
                {app.status === "pending" && (
                  <View style={s.actions}>
                    <TouchableOpacity style={s.acceptBtn} onPress={() => updateStatus(app.id, "accepted")}>
                      <Ionicons name="checkmark" size={16} color={Colors.white} />
                      <Text style={s.acceptText}>Accepter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.refuseBtn} onPress={() => updateStatus(app.id, "refused")}>
                      <Ionicons name="close" size={16} color={Colors.red} />
                      <Text style={s.refuseText}>Refuser</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "900", color: Colors.dark, lineHeight: 28, marginBottom: 4 },
  sub: { fontSize: 14, color: Colors.gray, marginBottom: 16 },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 11, fontWeight: "700", color: Colors.gray },
  chipTextActive: { color: Colors.white },
  empty: { padding: 40, alignItems: "center" },
  emptyText: { color: Colors.gray, fontSize: 14 },
  appCard: { backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  appTop: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  appAvatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  appName: { fontSize: 15, fontWeight: "800", color: Colors.dark },
  appMeta: { fontSize: 12, color: Colors.gray, marginTop: 1 },
  actions: { flexDirection: "row", gap: 8, marginTop: 12 },
  acceptBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, backgroundColor: Colors.green, borderRadius: 12, paddingVertical: 10 },
  acceptText: { color: Colors.white, fontWeight: "800", fontSize: 13 },
  refuseBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, backgroundColor: Colors.redLight, borderRadius: 12, paddingVertical: 10 },
  refuseText: { color: Colors.red, fontWeight: "800", fontSize: 13 },
});
