import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => { load(); }, [id]);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    const [{ data: ev }, { data: app }] = await Promise.all([
      supabase.from("events").select("*, profiles(full_name, avatar_url)").eq("id", id).single(),
      user
        ? supabase.from("applications").select("*").eq("event_id", id).eq("marshal_id", user.id).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);
    setEvent(ev);
    setApplication(app);
    setLoading(false);
  }

  async function apply() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setApplying(true);
    const { error } = await supabase.from("applications").insert({ event_id: id, marshal_id: user.id, status: "pending" });
    setApplying(false);
    if (error) { Alert.alert("Erreur", error.message); return; }
    await load();
  }

  async function cancelApplication() {
    Alert.alert("Annuler", "Annuler ta candidature ?", [
      { text: "Non", style: "cancel" },
      { text: "Oui", style: "destructive", onPress: async () => {
        await supabase.from("applications").delete().eq("id", application.id);
        await load();
      }},
    ]);
  }

  if (loading) return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator color={Colors.primary} size="large" /></View>;
  if (!event) return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><Text>Événement introuvable.</Text></View>;

  const statusVariant = application?.status === "accepted" ? "green" : application?.status === "refused" ? "red" : "blue";
  const statusLabel = application?.status === "accepted" ? "ACCEPTÉ" : application?.status === "refused" ? "REFUSÉ" : "EN ATTENTE";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={s.container}>
        {/* Nav */}
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.dark} />
        </TouchableOpacity>

        {/* Header card */}
        <View style={s.headerCard}>
          <View style={s.headerBg} />
          <View style={s.headerContent}>
            <Text style={s.eventTitle}>{event.title}</Text>
            {event.discipline && <Badge label={event.discipline} variant="orange" />}
          </View>
        </View>

        {/* Info */}
        <View style={s.infoCard}>
          {[
            { icon: "calendar-outline", text: fmtDate(event.event_date) + (event.event_end_date && event.event_end_date !== event.event_date ? ` → ${fmtDate(event.event_end_date)}` : "") },
            event.location && { icon: "location-outline", text: event.location },
            event.spots_available != null && { icon: "people-outline", text: `${event.spots_available} place${event.spots_available !== 1 ? "s" : ""} disponible${event.spots_available !== 1 ? "s" : ""}` },
          ].filter(Boolean).map((info: any) => (
            <View key={info.icon} style={s.infoRow}>
              <Ionicons name={info.icon as any} size={18} color={Colors.primary} />
              <Text style={s.infoText}>{info.text}</Text>
            </View>
          ))}
        </View>

        {/* Description */}
        {event.description && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Description</Text>
            <Text style={s.description}>{event.description}</Text>
          </View>
        )}

        {/* Roles */}
        {event.roles_needed && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Rôles recherchés</Text>
            <View style={s.rolesWrap}>
              {(Array.isArray(event.roles_needed) ? event.roles_needed : [event.roles_needed]).map((r: string) => (
                <Badge key={r} label={r} variant="gray" />
              ))}
            </View>
          </View>
        )}

        {/* CTA */}
        <View style={s.cta}>
          {!application
            ? <Button label="Postuler à cet événement" onPress={apply} loading={applying} size="lg" />
            : <>
                <View style={s.statusRow}>
                  <Text style={s.statusText}>Statut de ta candidature :</Text>
                  <Badge label={statusLabel} variant={statusVariant} />
                </View>
                {application.status === "pending" && (
                  <Button label="Annuler ma candidature" onPress={cancelApplication} variant="outline" size="md" />
                )}
              </>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  headerCard: { borderRadius: 20, overflow: "hidden", marginBottom: 16 },
  headerBg: { height: 100, backgroundColor: Colors.dark },
  headerContent: { backgroundColor: Colors.white, padding: 16, gap: 8, borderWidth: 1, borderTopWidth: 0, borderColor: Colors.border, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  eventTitle: { fontSize: 20, fontWeight: "900", color: Colors.dark, lineHeight: 26 },
  infoCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, gap: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  infoText: { fontSize: 14, color: Colors.dark, flex: 1 },
  section: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.8, color: Colors.primary, marginBottom: 8 },
  description: { fontSize: 14, color: Colors.gray, lineHeight: 21 },
  rolesWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  cta: { gap: 10 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: Colors.white, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  statusText: { fontSize: 13, fontWeight: "600", color: Colors.gray },
});
