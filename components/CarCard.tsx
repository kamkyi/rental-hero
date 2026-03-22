import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { palette, radius, shadows, spacing } from "@/constants/theme";
import type { Car } from "@/data/cars";
import { useResponsive } from "@/hooks/useResponsive";

type CarCardProps = {
  car: Car;
  onPress: () => void;
};

export function CarCard({ car, onPress }: CarCardProps) {
  const { t } = useTranslation();
  const { isCompact, isMobile } = useResponsive();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, isCompact && styles.cardCompact]}
    >
      <View style={styles.imageWrap}>
        <View style={styles.mediaMetaRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{car.type}</Text>
          </View>
          <View style={styles.favoriteButton}>
            <Ionicons
              name="heart-outline"
              size={16}
              color={palette.samsungBlue}
            />
          </View>
        </View>

        <Image
          source={{ uri: car.image }}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={[styles.imageBadgeRow, isCompact && styles.imageBadgeRowCompact]}>
          <View
            style={[
              styles.insuranceBadge,
              isCompact && styles.insuranceBadgeCompact,
            ]}
          >
            <Ionicons name="shield-checkmark" size={13} color={palette.white} />
            <Text style={styles.insuranceBadgeText}>{t("insurance")}</Text>
          </View>

          <View style={styles.ratingPill}>
            <Ionicons name="star" size={12} color="#F5A623" />
            <Text style={styles.rating}>{car.rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <View
          style={[styles.titlePriceRow, isMobile && styles.titlePriceRowMobile]}
        >
          <View style={styles.titleBlock}>
            <Text style={styles.name} numberOfLines={1}>
              {car.name}
            </Text>
            <View style={styles.locationMetaRow}>
              <Ionicons
                name="location-outline"
                size={14}
                color={palette.textMuted}
              />
              <Text style={styles.meta}>{car.location}</Text>
            </View>
          </View>

          <View style={[styles.priceBlock, isMobile && styles.priceBlockMobile]}>
            <Text style={styles.price}>
              ฿{car.pricePerDay.toLocaleString()}
            </Text>
            <Text style={styles.priceUnit}>per day</Text>
          </View>
        </View>

        <View style={styles.specRow}>
          <View style={styles.specItem}>
            <Ionicons
              name="settings-outline"
              size={14}
              color={palette.samsungBlue}
            />
            <Text style={styles.specText}>{car.transmission}</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons
              name="flash-outline"
              size={14}
              color={palette.samsungBlue}
            />
            <Text style={styles.specText}>{car.fuel}</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons
              name="people-outline"
              size={14}
              color={palette.samsungBlue}
            />
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
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: "rgba(22, 33, 62, 0.08)",
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  cardCompact: {
    padding: spacing.md,
  },
  image: {
    width: "100%",
    height: 164,
  },
  imageWrap: {
    backgroundColor: "#F4F7FB",
    borderRadius: radius.lg,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  mediaMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  body: {
    gap: spacing.sm,
  },
  imageBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  imageBadgeRowCompact: {
    justifyContent: "flex-start",
  },
  titlePriceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  titlePriceRowMobile: {
    flexWrap: "wrap",
  },
  titleBlock: {
    gap: spacing.xs,
    flex: 1,
    minWidth: 0,
  },
  locationMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  name: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "800",
  },
  meta: {
    color: palette.textMuted,
    fontSize: 14,
  },
  ratingPill: {
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: "rgba(22, 33, 62, 0.08)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },
  insuranceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    backgroundColor: palette.samsungBlue,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    ...shadows.icon,
  },
  insuranceBadgeCompact: {
    maxWidth: "100%",
  },
  insuranceBadgeText: {
    color: palette.white,
    fontSize: 12,
    fontWeight: "800",
  },
  favoriteButton: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: "rgba(22, 33, 62, 0.08)",
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
    backgroundColor: palette.white,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: "rgba(22, 33, 62, 0.08)",
  },
  categoryText: {
    color: palette.samsungBlue,
    fontWeight: "700",
    fontSize: 12,
  },
  priceBlock: {
    alignItems: "flex-end",
    gap: spacing.xxs,
    flexShrink: 0,
  },
  priceBlockMobile: {
    width: "100%",
    alignItems: "flex-start",
  },
  specRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F6",
  },
  specItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: "#F7FAFD",
  },
  specText: {
    color: palette.textMuted,
    fontSize: 13,
  },
  price: {
    color: palette.samsungBlue,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "right",
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: "700",
    color: palette.textMuted,
  },
});
