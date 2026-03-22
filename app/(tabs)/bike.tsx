import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { AppShell } from "@/components/AppShell";
import { palette, radius, shadows, spacing } from "@/constants/theme";

const bikeTypes = [
  {
    name: "City Bike",
    detail: "Quick trips around downtown and old town areas.",
  },
  {
    name: "Scooter",
    detail: "Easy pickup for beach roads and short daily rides.",
  },
  {
    name: "Touring Bike",
    detail: "Longer scenic routes with better comfort and storage.",
  },
];

export default function BikeTabScreen() {
  return (
    <AppShell>
      <View style={styles.heroCard}>
        <Text style={styles.kicker}>Rental Hero</Text>
        <Text style={styles.title}>Bike rentals coming into the same booking flow.</Text>
        <Text style={styles.body}>
          This tab is ready for your next inventory set. You can expand it later with bike-specific
          filters, pricing, and details.
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Planned categories</Text>
        <View style={styles.list}>
          {bikeTypes.map((bike) => (
            <View key={bike.name} style={styles.rowCard}>
              <View style={styles.iconWrap}>
                <Ionicons name="bicycle-outline" size={20} color={palette.samsungBlue} />
              </View>
              <View style={styles.textBlock}>
                <Text style={styles.rowTitle}>{bike.name}</Text>
                <Text style={styles.rowBody}>{bike.detail}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: palette.samsungBlue,
    borderRadius: 28,
    padding: spacing.xl,
    gap: spacing.sm,
    ...shadows.blueHero,
  },
  kicker: {
    color: "#CFE0FF",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  title: {
    color: palette.white,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
  },
  body: {
    color: "#DCE8FF",
    fontSize: 14,
    lineHeight: 22,
  },
  sectionCard: {
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
  list: {
    gap: spacing.sm,
  },
  rowCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: spacing.md,
    backgroundColor: palette.samsungBlueTint,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: palette.white,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "700",
  },
  rowBody: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
});
