import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { Colors } from "@/constants/Colors";

type State = "scan" | "loading" | "success" | "already" | "error";

export default function CheckinScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [state, setState] = useState<State>("scan");
  const [message, setMessage] = useState("");
  const [scanned, setScanned] = useState(false);

  async function handleScan({ data }: { data: string }) {
    if (scanned) return;
    setScanned(true);
    setState("loading");

    try {
      const url = new URL(data);
      const eventId = url.searchParams.get("event");
      const date = url.searchParams.get("date");
      if (!eventId || !date) { setState("error"); setMessage("QR invalide."); return; }

      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ eventId, date }),
      });
      const json = await res.json();
      if (!res.ok) { setState("error"); setMessage(json.error ?? "Erreur"); return; }
      setState(json.alreadyDone ? "already" : "success");
    } catch {
      setState("error");
      setMessage("QR invalide ou erreur réseau.");
    }
  }

  function reset() { setScanned(false); setState("scan"); setMessage(""); }

  if (!permission) return <View style={{ flex: 1 }} />;
  if (!permission.granted) {
    return (
      <SafeAreaView style={s.center}>
        <Text style={s.permText}>La caméra est nécessaire pour scanner les QR de check-in.</Text>
        <TouchableOpacity style={s.permBtn} onPress={requestPermission}>
          <Text style={s.permBtnText}>Autoriser la caméra</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark }}>
      <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
        <Ionicons name="close" size={24} color={Colors.white} />
      </TouchableOpacity>

      {state === "scan" && (
        <>
          <CameraView style={{ flex: 1 }} facing="back" barcodeScannerSettings={{ barcodeTypes: ["qr"] }} onBarcodeScanned={handleScan} />
          <View style={s.overlay}>
            <View style={s.frame} />
            <Text style={s.hint}>Scanne le QR code affiché à l'entrée de l'événement</Text>
          </View>
        </>
      )}

      {state === "loading" && (
        <View style={s.center}>
          <Text style={{ fontSize: 48 }}>⏳</Text>
          <Text style={[s.stateText, { color: Colors.white }]}>Enregistrement...</Text>
        </View>
      )}

      {state === "success" && (
        <View style={s.center}>
          <Text style={{ fontSize: 64 }}>✅</Text>
          <Text style={[s.stateText, { color: Colors.white }]}>Présence confirmée !</Text>
          <TouchableOpacity style={s.resetBtn} onPress={reset}><Text style={s.resetText}>Scanner un autre QR</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(app)")}><Text style={[s.resetText, { color: Colors.muted }]}>Retour au dashboard</Text></TouchableOpacity>
        </View>
      )}

      {state === "already" && (
        <View style={s.center}>
          <Text style={{ fontSize: 64 }}>👍</Text>
          <Text style={[s.stateText, { color: Colors.white }]}>Déjà enregistré !</Text>
          <TouchableOpacity style={s.resetBtn} onPress={() => router.push("/(app)")}><Text style={s.resetText}>Retour au dashboard</Text></TouchableOpacity>
        </View>
      )}

      {state === "error" && (
        <View style={s.center}>
          <Text style={{ fontSize: 64 }}>❌</Text>
          <Text style={[s.stateText, { color: Colors.white }]}>{message || "Erreur"}</Text>
          <TouchableOpacity style={s.resetBtn} onPress={reset}><Text style={s.resetText}>Réessayer</Text></TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 16, backgroundColor: Colors.dark },
  backBtn: { position: "absolute", top: 56, right: 20, zIndex: 10, width: 40, height: 40, backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 20, alignItems: "center", justifyContent: "center" },
  overlay: { position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", pointerEvents: "none" },
  frame: { width: 240, height: 240, borderRadius: 20, borderWidth: 3, borderColor: Colors.primary },
  hint: { position: "absolute", bottom: 120, color: Colors.white, fontSize: 14, fontWeight: "600", textAlign: "center", paddingHorizontal: 32 },
  permText: { color: Colors.white, fontSize: 16, textAlign: "center", marginBottom: 20 },
  permBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14 },
  permBtnText: { color: Colors.white, fontSize: 15, fontWeight: "800" },
  stateText: { fontSize: 22, fontWeight: "900", textAlign: "center" },
  resetBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  resetText: { color: Colors.white, fontSize: 15, fontWeight: "700" },
});
