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
