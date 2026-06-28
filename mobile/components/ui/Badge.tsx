import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";

type Variant = "green" | "red" | "orange" | "blue" | "gray";

const map: Record<Variant, { bg: string; text: string }> = {
  green:  { bg: Colors.greenLight,  text: "#16A34A" },
  red:    { bg: Colors.redLight,    text: "#DC2626" },
  orange: { bg: Colors.primaryLight, text: Colors.primary },
  blue:   { bg: Colors.blueLight,   text: Colors.blue },
  gray:   { bg: Colors.lightGray,   text: Colors.gray },
};

export default function Badge({ label, variant = "gray" }: { label: string; variant?: Variant }) {
  const c = map[variant];
  return (
    <View style={[s.badge, { backgroundColor: c.bg }]}>
      <Text style={[s.text, { color: c.text }]}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: { borderRadius: 99, paddingHorizontal: 9, paddingVertical: 3, alignSelf: "flex-start" },
  text:  { fontSize: 11, fontWeight: "700" },
});
