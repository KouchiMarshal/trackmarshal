import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";
import EventCard from "@/components/events/EventCard";

const DISCIPLINES = ["Tous", "Rallye", "Circuit", "Karting", "Moto", "Rallycross", "Endurance"];

export default function EventsScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [disc, setDisc] = useState("Tous");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date", { ascending: true })
      .limit(50);
    setEvents(data ?? []);
    setLoading(false);
  }

  const filtered = events.filter((e) => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || (e.location ?? "").toLowerCase().includes(search.toLowerCase());
    const matchDisc = disc === "Tous" || (e.discipline ?? "").toLowerCase().includes(disc.toLowerCase());
    return matchSearch && matchDisc;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={s.header}>
        <Text style={s.title}>Événements</Text>
        <TextInput
          style={s.search}
          placeholder="Rechercher..."
          placeholderTextColor={Colors.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        horizontal
        data={DISCIPLINES}
        keyExtractor={(d) => d}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filterRow}
        renderItem={({ item }) => (
          <Text
            onPress={() => setDisc(item)}
            style={[s.filterChip, disc === item && s.filterChipActive]}
          >
            {item}
          </Text>
        )}
      />

      {loading
        ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator color={Colors.primary} /></View>
        : <FlatList
            data={filtered}
            keyExtractor={(e) => e.id}
            contentContainerStyle={s.list}
            renderItem={({ item }) => (
              <EventCard event={item} onPress={() => router.push(`/(app)/events/${item.id}`)} />
            )}
            ListEmptyComponent={
              <View style={s.empty}><Text style={s.emptyText}>Aucun événement trouvé.</Text></View>
            }
          />
      }
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: { padding: 20, paddingBottom: 12, backgroundColor: Colors.background },
  title: { fontSize: 28, fontWeight: "900", color: Colors.dark, marginBottom: 12 },
  search: {
    height: 46, backgroundColor: Colors.white, borderRadius: 14, borderWidth: 1,
    borderColor: Colors.border, paddingHorizontal: 16, fontSize: 15, color: Colors.dark,
  },
  filterRow: { paddingHorizontal: 20, paddingVertical: 10, gap: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
    fontSize: 13, fontWeight: "700", color: Colors.gray,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary, color: Colors.white },
  list: { padding: 20, paddingTop: 8, paddingBottom: 40 },
  empty: { padding: 40, alignItems: "center" },
  emptyText: { color: Colors.gray, fontSize: 15 },
});
