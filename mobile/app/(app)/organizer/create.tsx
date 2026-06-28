import { useState } from "react";
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";
import Button from "@/components/ui/Button";

const DISCIPLINES = ["Rallye", "Circuit", "Karting", "Rallycross", "Endurance", "Drift", "Slalom", "Moto - Road", "Moto - Cross", "Moto - Enduro"];

const blank = { title: "", location: "", event_date: "", event_end_date: "", discipline: "", description: "", spots_total: "" };

export default function CreateEventScreen() {
  const router = useRouter();
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  function set(key: keyof typeof blank, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    if (!form.title || !form.event_date) {
      Alert.alert("Champs manquants", "Le titre et la date de début sont obligatoires.");
      return;
    }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }
    const { error } = await supabase.from("events").insert({
      title: form.title,
      location: form.location || null,
      event_date: form.event_date,
      event_end_date: form.event_end_date || null,
      discipline: form.discipline || null,
      description: form.description || null,
      spots_total: form.spots_total ? parseInt(form.spots_total) : null,
      spots_available: form.spots_total ? parseInt(form.spots_total) : null,
      organizer_id: user.id,
    });
    setSaving(false);
    if (error) { Alert.alert("Erreur", error.message); return; }
    Alert.alert("Publié !", "Ton événement est en ligne.", [{ text: "OK", onPress: () => router.back() }]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.dark} />
          </TouchableOpacity>
          <Text style={s.title}>Créer un événement</Text>

          <View style={s.card}>
            {[
              { label: "Titre *", key: "title", placeholder: "Rallye du Var 2026" },
              { label: "Lieu", key: "location", placeholder: "Brignoles, Var" },
              { label: "Date de début *", key: "event_date", placeholder: "2026-09-14" },
              { label: "Date de fin", key: "event_end_date", placeholder: "2026-09-15" },
              { label: "Nombre de places", key: "spots_total", placeholder: "12", keyboard: "numeric" },
            ].map((f) => (
              <View key={f.key}>
                <Text style={s.label}>{f.label}</Text>
                <TextInput
                  style={s.input}
                  value={form[f.key as keyof typeof blank]}
                  onChangeText={(v) => set(f.key as keyof typeof blank, v)}
                  placeholder={f.placeholder}
                  placeholderTextColor={Colors.muted}
                  keyboardType={(f as any).keyboard ?? "default"}
                />
              </View>
            ))}

            {/* Discipline picker */}
            <Text style={s.label}>Discipline</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {DISCIPLINES.map((d) => (
                  <TouchableOpacity key={d} onPress={() => set("discipline", form.discipline === d ? "" : d)} style={[s.discChip, form.discipline === d && s.discChipActive]}>
                    <Text style={[s.discChipText, form.discipline === d && s.discChipTextActive]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Text style={s.label}>Description</Text>
            <TextInput
              style={[s.input, { height: 90, textAlignVertical: "top", paddingTop: 10 }]}
              value={form.description}
              onChangeText={(v) => set("description", v)}
              placeholder="Informations pour les commissaires..."
              placeholderTextColor={Colors.muted}
              multiline
            />
          </View>

          <Button label="Publier l'événement" onPress={submit} loading={saving} size="lg" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: "900", color: Colors.dark, marginBottom: 20 },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, gap: 4, borderWidth: 1, borderColor: Colors.border, marginBottom: 20 },
  label: { fontSize: 12, fontWeight: "700", color: Colors.dark, marginBottom: 4, marginTop: 10 },
  input: { height: 46, backgroundColor: Colors.background, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, fontSize: 14, color: Colors.dark },
  discChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border },
  discChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  discChipText: { fontSize: 12, fontWeight: "700", color: Colors.gray },
  discChipTextActive: { color: Colors.white },
});
