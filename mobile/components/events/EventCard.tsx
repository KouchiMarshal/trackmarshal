import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/Colors";
import Badge from "@/components/ui/Badge";

type Event = {
  id: string;
  title: string;
  event_date: string;
  event_end_date?: string | null;
  location?: string | null;
  discipline?: string | null;
  spots_available?: number | null;
  spots_total?: number | null;
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default function EventCard({ event, onPress }: { event: Event; onPress: () => void }) {
  const spotsLeft = event.spots_available ?? null;
  const isFull = spotsLeft !== null && spotsLeft <= 0;

  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.8}>
      <View style={s.top}>
        <View style={s.disc}>
          <Text style={s.discText}>{event.discipline?.[0] ?? "?"}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.title} numberOfLines={2}>{event.title}</Text>
          <Text style={s.meta}>
            {fmtDate(event.event_date)}
            {event.event_end_date && event.event_end_date !== event.event_date
              ? ` → ${fmtDate(event.event_end_date)}`
              : ""}
          </Text>
          {event.location && <Text style={s.meta}>📍 {event.location}</Text>}
        </View>
      </View>
      <View style={s.footer}>
        {event.discipline && <Badge label={event.discipline} variant="orange" />}
        {spotsLeft !== null && (
          <Text style={[s.spots, isFull && { color: Colors.red }]}>
            {isFull ? "Complet" : `${spotsLeft} place${spotsLeft > 1 ? "s" : ""}`}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
  },
  top:  { flexDirection: "row", gap: 12, marginBottom: 12 },
  disc: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: "center", justifyContent: "center",
  },
  discText: { fontSize: 20 },
  title: { fontSize: 15, fontWeight: "800", color: Colors.dark, lineHeight: 20 },
  meta:  { fontSize: 12, color: Colors.gray, marginTop: 2 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  spots: { fontSize: 12, fontWeight: "700", color: Colors.green },
});
