import { useState } from "react";
import {
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";
import Button from "@/components/ui/Button";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login() {
    if (!email || !password) { setError("Remplis tous les champs."); return; }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) setError(err.message);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
        <View style={s.logo}>
          <Text style={s.logoMark}>🏁</Text>
          <Text style={s.logoWord}>Track<Text style={{ color: Colors.primary }}>Marshal</Text></Text>
        </View>

        <Text style={s.title}>Connexion</Text>
        <Text style={s.sub}>Accède à ton espace commissaire ou organisateur.</Text>

        {!!error && <View style={s.errorBox}><Text style={s.errorText}>{error}</Text></View>}

        <View style={s.form}>
          <Text style={s.label}>Email</Text>
          <TextInput
            style={s.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="ton@email.fr"
            placeholderTextColor={Colors.muted}
          />
          <Text style={s.label}>Mot de passe</Text>
          <TextInput
            style={s.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={Colors.muted}
          />
          <Button label="Se connecter" onPress={login} loading={loading} size="lg" />
        </View>

        <View style={s.foot}>
          <Text style={s.footText}>Pas encore de compte ? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity><Text style={s.footLink}>Créer un compte</Text></TouchableOpacity>
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
