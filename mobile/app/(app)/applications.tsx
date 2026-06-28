import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";
import Badge from "@/components/ui/Badge";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

const statusMap = {
  accepted: { label: "ACCEPTÉ", variant: "green" as const },
  refused:  { label: "REFUSÉ",  variant: "red"   as const },
  pending:  { label: "EN ATTENTE", variant: "blue" as const },
};

export default function ApplicationsScreen() {
  const router = useRouter();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "accepted" | "pending" | "refused">("all");

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("applications")
      .select("*, events(id, title, event_date, event_end_date, location, discipline)")
      .eq("marshal_id", user.id)
      .order("created_at", { ascending: false });
    setApps(data ?? []);
    setLoading(false);
  }

  const filtered = apps.filter((a) => filter === "all" || a.status === filter);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={s.header}>
        <Text style={s.title}>Mes candidatures</Text>
        <View style={s.filters}>
          {(["all", "accepted", "pending", "refused"] as const).map((f) => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[s.chip, filter === f && s.chipActive]}>
              <Text style={[s.chipText, filter === f && s.chipTextActive]}>
                {f === "all" ? "Toutes" : f === "accepted" ? "Acceptées" : f === "pending" ? "En attente" : "Refusées"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading
        ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator color={Colors.primary} /></View>
        : <FlatList
            data={filtered}
            keyExtractor={(a) => a.id}
            contentContainerStyle={s.list}
            renderItem={({ item }) => {
              const ev = item.events;
              const st = statusMap[item.status as keyof typeof statusMap] ?? statusMap.pending;
              return (
                <TouchableOpacity style={s.card} onPress={() => ev && router.push(`/(app)/events/${ev.id}`)}>
                  <View style={s.cardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.cardTitle} numberOfLines={2}>{ev?.title ?? "Événement supprimé"}</Text>
                      {ev?.event_date && <Text style={s.cardMeta}>{fmtDate(ev.event_date)}</Text>}
                      {ev?.location && <Text style={s.cardMeta}>📍 {ev.location}</Text>}
                    </View>
                    <Badge label={st.label} variant={st.variant} />
                  </View>
                  {ev?.discipline && (
                    <View style={{ marginTop: 8 }}>
                      <Badge label={ev.discipline} variant="orange" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={s.empty}><Text style={s.emptyText}>Aucune candidature.</Text></View>
            }
          />
      }
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: { padding: 20, paddingBottom: 0, backgroundColor: Colors.background },
  title: { fontSize: 28, fontWeight: "900", color: Colors.dark, marginBottom: 14 },
  filters: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, fontWeight: "700", color: Colors.gray },
  chipTextActive: { color: Colors.white },
  list: { padding: 20, paddingTop: 12, paddingBottom: 40 },
  card: { backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  cardTop: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  cardTitle: { fontSize: 15, fontWeight: "800", color: Colors.dark, lineHeight: 20 },
  cardMeta: { fontSize: 12, color: Colors.gray, marginTop: 2 },
  empty: { padding: 48, alignItems: "center" },
  emptyText: { color: Colors.gray, fontSize: 15 },
});
