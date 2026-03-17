import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { AppShell } from "@/components/AppShell";
import { palette, shadows, spacing } from "@/constants/theme";

const shortcuts = [
  { label: "Upcoming bookings", icon: "calendar-outline" as const },
  { label: "Saved payment methods", icon: "card-outline" as const },
  { label: "Support and invoices", icon: "help-circle-outline" as const },
];

export default function ProfileTabScreen() {
  return (
    <AppShell>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>RH</Text>
        </View>
        <Text style={styles.name}>Rental Hero Member</Text>
        <Text style={styles.email}>guest@rentalhero.app</Text>
      </View>

      <View style={styles.shortcutCard}>
        <Text style={styles.sectionTitle}>Account shortcuts</Text>
        <View style={styles.shortcutList}>
          {shortcuts.map((shortcut) => (
            <View key={shortcut.label} style={styles.shortcutRow}>
              <View style={styles.shortcutLead}>
                <View style={styles.shortcutIcon}>
                  <Ionicons name={shortcut.icon} size={18} color="#0F66EA" />
                </View>
                <Text style={styles.shortcutText}>{shortcut.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#93A4BC" />
            </View>
          ))}
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: palette.white,
    borderRadius: 28,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.card,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#0F66EA",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: palette.white,
    fontSize: 28,
    fontWeight: "800",
  },
  name: {
    color: palette.text,
    fontSize: 24,
    fontWeight: "800",
  },
  email: {
    color: palette.textMuted,
    fontSize: 14,
  },
  shortcutCard: {
    backgroundColor: palette.white,
    borderRadius: 24,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.softCard,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "800",
  },
  shortcutList: {
    gap: spacing.xs,
  },
  shortcutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  shortcutLead: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  shortcutIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EAF3FF",
    alignItems: "center",
    justifyContent: "center",
  },
  shortcutText: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "700",
  },
});
