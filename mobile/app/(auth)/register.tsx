import { useState } from "react";
import {
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";
import Button from "@/components/ui/Button";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function register() {
    if (!fullName || !email || !password) { setError("Remplis tous les champs."); return; }
    if (password.length < 6) { setError("Mot de passe trop court (6 caractères min)."); return; }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
  }

  if (done) return (
    <View style={[s.container, { justifyContent: "center", alignItems: "center" }]}>
      <Text style={{ fontSize: 48 }}>✅</Text>
      <Text style={[s.title, { textAlign: "center", marginTop: 16 }]}>Compte créé !</Text>
      <Text style={[s.sub, { textAlign: "center" }]}>Vérifie ta boîte email pour confirmer ton inscription.</Text>
      <Link href="/(auth)/login" asChild>
        <TouchableOpacity style={{ marginTop: 24 }}>
          <Text style={{ color: Colors.primary, fontWeight: "700", fontSize: 15 }}>← Retour à la connexion</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        <View style={s.logo}>
          <Text style={s.logoMark}>🏁</Text>
          <Text style={s.logoWord}>Track<Text style={{ color: Colors.primary }}>Marshal</Text></Text>
        </View>

        <Text style={s.title}>Créer un compte</Text>
        <Text style={s.sub}>Commissaire ou organisateur, rejoins la communauté.</Text>

        {!!error && <View style={s.errorBox}><Text style={s.errorText}>{error}</Text></View>}

        <View style={s.form}>
          <Text style={s.label}>Nom complet</Text>
          <TextInput style={s.input} value={fullName} onChangeText={setFullName} placeholder="Jean Dupont" placeholderTextColor={Colors.muted} />
          <Text style={s.label}>Email</Text>
          <TextInput style={s.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="ton@email.fr" placeholderTextColor={Colors.muted} />
          <Text style={s.label}>Mot de passe</Text>
          <TextInput style={s.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="6 caractères minimum" placeholderTextColor={Colors.muted} />
          <Button label="Créer mon compte" onPress={register} loading={loading} size="lg" />
        </View>

        <View style={s.foot}>
          <Text style={s.footText}>Déjà un compte ? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity><Text style={s.footLink}>Se connecter</Text></TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.white, padding: 28, paddingTop: 72 },
  logo: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 40 },
  logoMark: { fontSize: 28 },
  logoWord: { fontSize: 22, fontWeight: "900", color: Colors.dark },
  title: { fontSize: 32, fontWeight: "900", color: Colors.dark },
  sub: { fontSize: 15, color: Colors.gray, marginTop: 6, marginBottom: 28 },
  form: { gap: 8 },
  label: { fontSize: 13, fontWeight: "700", color: Colors.dark, marginTop: 8, marginBottom: 4 },
  input: {
    height: 50, borderRadius: 14, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 16, fontSize: 15, color: Colors.dark,
    backgroundColor: Colors.background, marginBottom: 4,
  },
  errorBox: { backgroundColor: Colors.redLight, borderRadius: 12, padding: 12, marginBottom: 12 },
  errorText: { color: Colors.red, fontSize: 13, fontWeight: "600" },
  foot: { flexDirection: "row", justifyContent: "center", marginTop: 28 },
  footText: { color: Colors.gray, fontSize: 14 },
  footLink: { color: Colors.primary, fontSize: 14, fontWeight: "700" },
});
