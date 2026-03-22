import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { AppShell } from "@/components/AppShell";
import { palette, radius, shadows, spacing } from "@/constants/theme";
import { useAppAuth } from "@/hooks/useAppAuth";

const shortcuts = [
  { label: "Upcoming bookings", icon: "calendar-outline" as const },
  { label: "Saved payment methods", icon: "card-outline" as const },
  { label: "Support and invoices", icon: "help-circle-outline" as const },
];

export default function ProfileTabScreen() {
  const { t } = useTranslation();
  const { user, isLoading, signIn, signOut } = useAppAuth();

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || "Rental Hero Member";
  const displayEmail = user?.email ?? "guest@rentalhero.app";
  const initials = (displayName.match(/\b\w/g)?.join("").slice(0, 2) || "RH").toUpperCase();

  const handleAuthPress = async () => {
    if (Platform.OS !== "web") {
      return;
    }

    if (user) {
      await signOut();
      return;
    }

    await signIn();
  };

  return (
    <AppShell>
      <View style={styles.profileCard}>
        {user?.profilePictureUrl ? (
          <Image
            source={{ uri: user.profilePictureUrl }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{displayEmail}</Text>
        {Platform.OS === "web" ? (
          <Pressable style={styles.authButton} onPress={handleAuthPress}>
            <Text style={styles.authButtonText}>{user ? t("logout") : t("login")}</Text>
          </Pressable>
        ) : null}
        {isLoading ? <Text style={styles.statusText}>Syncing account...</Text> : null}
      </View>

      <View style={styles.shortcutCard}>
        <Text style={styles.sectionTitle}>Account shortcuts</Text>
        <View style={styles.shortcutList}>
          {shortcuts.map((shortcut) => (
            <View key={shortcut.label} style={styles.shortcutRow}>
              <View style={styles.shortcutLead}>
                <View style={styles.shortcutIcon}>
                  <Ionicons name={shortcut.icon} size={18} color={palette.samsungBlue} />
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
    borderRadius: radius.panel,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.card,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: palette.samsungBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
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
  authButton: {
    minHeight: 44,
    borderRadius: radius.control,
    backgroundColor: palette.samsungBlue,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xs,
  },
  authButtonText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "800",
  },
  statusText: {
    color: palette.textMuted,
    fontSize: 13,
  },
  shortcutCard: {
    backgroundColor: palette.white,
    borderRadius: radius.card,
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
    flexWrap: "wrap",
  },
  shortcutLead: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
    minWidth: 0,
  },
  shortcutIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: palette.samsungBlueTint,
    alignItems: "center",
    justifyContent: "center",
  },
  shortcutText: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "700",
    flexShrink: 1,
  },
});
