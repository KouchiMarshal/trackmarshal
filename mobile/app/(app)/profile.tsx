import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/constants/Colors";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function ProfileScreen() {
  const { profile, signOut, reloadProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", bio: "", city: "", disciplines: "" });
  const [saving, setSaving] = useState(false);
  const [licenses, setLicenses] = useState<any[]>([]);

  useEffect(() => {
    if (profile) {
      setForm({ full_name: profile.full_name ?? "", bio: profile.bio ?? "", city: profile.city ?? "", disciplines: profile.disciplines ?? "" });
    }
  }, [profile]);

  useEffect(() => { loadLicenses(); }, []);

  async function loadLicenses() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("licenses").select("*").eq("user_id", user.id).order("created_at");
    setLicenses(data ?? []);
  }

  async function save() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name,
      bio: form.bio,
      city: form.city,
      disciplines: form.disciplines,
    }).eq("id", user.id);
    setSaving(false);
    if (error) { Alert.alert("Erreur", error.message); return; }
    await reloadProfile?.();
    setEditing(false);
  }

  function confirmSignOut() {
    Alert.alert("Déconnexion", "Se déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Déconnexion", style: "destructive", onPress: signOut },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={s.container}>
        {/* Avatar + name */}
        <View style={s.avatarSection}>
          {profile?.avatar_url
            ? <Image source={{ uri: profile.avatar_url }} style={s.avatar} />
            : <View style={[s.avatar, s.avatarFallback]}>
                <Text style={{ color: Colors.white, fontSize: 32, fontWeight: "900" }}>{profile?.full_name?.[0] ?? "?"}</Text>
              </View>
          }
          <Text style={s.name}>{profile?.full_name ?? "—"}</Text>
          {profile?.city && <Text style={s.location}>📍 {profile.city}</Text>}
        </View>

        {/* Edit / Save */}
        <View style={s.editRow}>
          {!editing
            ? <Button label="Modifier mon profil" onPress={() => setEditing(true)} variant="outline" size="sm" />
            : <>
                <Button label="Annuler" onPress={() => setEditing(false)} variant="ghost" size="sm" />
                <Button label="Enregistrer" onPress={save} loading={saving} size="sm" />
              </>
          }
        </View>

        {editing && (
          <View style={s.formCard}>
            {[
              { label: "Nom complet", key: "full_name", placeholder: "Jean Dupont" },
              { label: "Ville", key: "city", placeholder: "Paris" },
              { label: "Disciplines", key: "disciplines", placeholder: "Rallye, Circuit..." },
              { label: "Biographie", key: "bio", placeholder: "Commissaire depuis...", multiline: true },
            ].map((f) => (
              <View key={f.key}>
                <Text style={s.label}>{f.label}</Text>
                <TextInput
                  style={[s.input, f.multiline && { height: 80, textAlignVertical: "top", paddingTop: 10 }]}
                  value={form[f.key as keyof typeof form]}
                  onChangeText={(v) => setForm((p) => ({ ...p, [f.key]: v }))}
                  placeholder={f.placeholder}
                  placeholderTextColor={Colors.muted}
                  multiline={f.multiline}
                />
              </View>
            ))}
          </View>
        )}

        {/* Bio */}
        {!editing && profile?.bio && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Biographie</Text>
            <Text style={s.bio}>{profile.bio}</Text>
          </View>
        )}

        {/* Disciplines */}
        {!editing && profile?.disciplines && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Disciplines</Text>
            <View style={s.badgeRow}>
              {profile.disciplines.split(",").map((d) => (
                <Badge key={d.trim()} label={d.trim()} variant="orange" />
              ))}
            </View>
          </View>
        )}

        {/* Licences */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Licences</Text>
          {licenses.length === 0
            ? <Text style={s.emptyText}>Aucune licence renseignée.</Text>
            : licenses.map((l) => (
              <View key={l.id} style={s.licCard}>
                <View style={{ flex: 1 }}>
                  <Text style={s.licType}>{l.type || "—"}</Text>
                  <Text style={s.licMeta}>{l.category === "moto" ? "FFM" : "FFSA"}{l.number ? ` · N° ${l.number}` : ""}</Text>
                </View>
                <Badge label={l.verified ? "Vérifiée ✓" : "En attente"} variant={l.verified ? "green" : "gray"} />
              </View>
            ))
          }
        </View>

        {/* Sign out */}
        <TouchableOpacity style={s.signOutBtn} onPress={confirmSignOut}>
          <Ionicons name="log-out-outline" size={18} color={Colors.red} />
          <Text style={s.signOutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  avatarSection: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 88, height: 88, borderRadius: 24, marginBottom: 12 },
  avatarFallback: { backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  name: { fontSize: 22, fontWeight: "900", color: Colors.dark },
  location: { fontSize: 13, color: Colors.gray, marginTop: 4 },
  editRow: { flexDirection: "row", justifyContent: "center", gap: 10, marginBottom: 20 },
  formCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, gap: 4, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: "700", color: Colors.dark, marginBottom: 4, marginTop: 8 },
  input: { height: 46, backgroundColor: Colors.background, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 14, fontSize: 14, color: Colors.dark },
  section: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 14 },
  sectionTitle: { fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.8, color: Colors.primary, marginBottom: 10 },
  bio: { fontSize: 14, color: Colors.gray, lineHeight: 21 },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  licCard: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8, borderTopWidth: 1, borderColor: Colors.border },
  licType: { fontSize: 14, fontWeight: "700", color: Colors.dark },
  licMeta: { fontSize: 12, color: Colors.gray, marginTop: 1 },
  emptyText: { color: Colors.gray, fontSize: 13 },
  signOutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8, padding: 16 },
  signOutText: { color: Colors.red, fontSize: 15, fontWeight: "700" },
});
