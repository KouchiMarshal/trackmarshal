import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
};

export default function Button({ label, onPress, variant = "primary", loading, disabled, size = "md" }: Props) {
  const s = styles[variant];
  const h = size === "sm" ? 38 : size === "lg" ? 56 : 48;
  const fs = size === "sm" ? 13 : size === "lg" ? 17 : 15;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[s.btn, { height: h, opacity: disabled ? 0.5 : 1 }]}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color={variant === "primary" ? "#fff" : Colors.primary} size="small" />
        : <Text style={[s.label, { fontSize: fs }]}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

const base = StyleSheet.create({
  btn: { borderRadius: 14, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
});

const styles = {
  primary: StyleSheet.create({
    btn: { ...base.btn, backgroundColor: Colors.primary },
    label: { color: "#fff", fontWeight: "800" as const },
  }),
  outline: StyleSheet.create({
    btn: { ...base.btn, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.primary },
    label: { color: Colors.primary, fontWeight: "700" as const },
  }),
  ghost: StyleSheet.create({
    btn: { ...base.btn, backgroundColor: "transparent" },
    label: { color: Colors.gray, fontWeight: "600" as const },
  }),
};
