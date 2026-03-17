import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { palette, radius, shadows, spacing } from "@/constants/theme";
import { Car } from "@/data/cars";

type CarCardProps = {
  car: Car;
  onPress: () => void;
};

export function CarCard({ car, onPress }: CarCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={styles.ratingPill}>
          <Ionicons name="star" size={12} color="#F5A623" />
          <Text style={styles.rating}>{car.rating.toFixed(1)}</Text>
        </View>
        <View style={styles.favoriteButton}>
          <Ionicons name="heart" size={14} color="#FF6C7A" />
        </View>
      </View>

      <Image
        source={{ uri: car.image }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.body}>
        <View style={styles.rowBetween}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{car.type}</Text>
          </View>
          <Text style={styles.price}>
            ฿{car.pricePerDay.toLocaleString()}
            <Text style={styles.priceUnit}>/day</Text>
          </Text>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.name} numberOfLines={1}>
            {car.name}
          </Text>
          <Text style={styles.meta}>{car.location}</Text>
        </View>

        <View style={styles.specRow}>
          <View style={styles.specItem}>
            <Ionicons name="settings-outline" size={14} color="#3388FF" />
            <Text style={styles.specText}>{car.transmission}</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="flash-outline" size={14} color="#3388FF" />
            <Text style={styles.specText}>{car.fuel}</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="people-outline" size={14} color="#3388FF" />
            <Text style={styles.specText}>{car.seats} Seats</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: palette.white,
    borderRadius: 22,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.card,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 140,
    backgroundColor: "#F8FBFF",
    borderRadius: radius.md,
  },
  body: {
    gap: spacing.sm,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  titleBlock: {
    gap: 4,
  },
  name: {
    color: palette.text,
    fontSize: 19,
    fontWeight: "700",
  },
  meta: {
    color: palette.textMuted,
    fontSize: 14,
  },
  ratingPill: {
    backgroundColor: "#FFF4DA",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  favoriteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFF4F5",
    alignItems: "center",
    justifyContent: "center",
  },
  rating: {
    color: "#A87200",
    fontWeight: "700",
    fontSize: 13,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF6FF",
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryText: {
    color: "#3388FF",
    fontWeight: "700",
    fontSize: 12,
  },
  specRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  specItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  specText: {
    color: palette.textMuted,
    fontSize: 14,
  },
  price: {
    color: "#3388FF",
    fontSize: 22,
    fontWeight: "800",
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7AAFFF",
  },
});
