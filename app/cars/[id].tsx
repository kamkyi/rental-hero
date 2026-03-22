import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { AppShell } from "@/components/AppShell";
import { palette, radius, shadows, spacing } from "@/constants/theme";
import { cars, getCarById } from "@/data/cars";
import { useResponsive } from "@/hooks/useResponsive";

const partnerByLocation = {
  Bangkok: { name: "Jenny Doe", role: "Owner" },
  "Chiang Mai": { name: "Narin K.", role: "Host" },
  Phuket: { name: "Aom P.", role: "Fleet manager" },
  Pattaya: { name: "Mark T.", role: "Rental partner" },
};

const tabs = ["About", "Gallery", "Review"] as const;

export function generateStaticParams() {
  return cars.map((car) => ({ id: car.id }));
}

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isMobile, isTablet } = useResponsive();
  const car = getCarById(id);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("About");

  const gallery = useMemo(() => {
    if (!car) {
      return [];
    }

    return [
      car.image,
      ...cars
        .filter((item) => item.id !== car.id)
        .slice(0, 4)
        .map((item) => item.image),
    ];
  }, [car]);

  if (!car) {
    return (
      <AppShell>
        <Stack.Screen options={{ title: "Car not found" }} />
        <View style={styles.notFoundCard}>
          <Text style={styles.notFoundTitle}>Car not found</Text>
          <Text style={styles.notFoundBody}>
            The selected car could not be loaded. Return to the catalog and choose another option.
          </Text>
          <Pressable style={styles.primaryButton} onPress={() => router.replace("/")}>
            <Text style={styles.primaryButtonText}>Back to listing</Text>
          </Pressable>
        </View>
      </AppShell>
    );
  }

  const partner = partnerByLocation[car.location];

  const handleBackPress = () => {
    if (
      Platform.OS === "web" &&
      typeof document !== "undefined" &&
      document.activeElement instanceof HTMLElement
    ) {
      document.activeElement.blur();
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/");
  };

  return (
    <AppShell>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screenWrap}>
        <View style={[styles.chromeRow, isMobile && styles.chromeRowMobile]}>
          <Pressable style={styles.chromeButton} onPress={handleBackPress}>
            <Ionicons name="chevron-back" size={20} color={palette.text} />
          </Pressable>

          <Text style={styles.chromeTitle}>Car Details</Text>

          <View style={styles.chromeActions}>
            <Pressable style={styles.chromeButton}>
              <Ionicons name="share-social-outline" size={18} color={palette.text} />
            </Pressable>
            <Pressable style={styles.chromeButton}>
              <Ionicons name="heart-outline" size={18} color={palette.text} />
            </Pressable>
          </View>
        </View>

        <View style={styles.galleryCard}>
          <Image
            source={{ uri: car.image }}
            style={[styles.heroImage, isTablet && styles.heroImageTablet]}
            resizeMode="contain"
          />

          <View style={styles.sliderTrack}>
            <View style={styles.sliderThumb} />
          </View>

          <View style={styles.thumbRow}>
            {gallery.slice(0, 4).map((image, index) => (
              <Image
                key={`${image}-${index}`}
                source={{ uri: image }}
                style={styles.thumbImage}
                resizeMode="cover"
              />
            ))}
            {gallery.length > 4 ? (
              <View style={styles.thumbMore}>
                <Text style={styles.thumbMoreText}>+{gallery.length - 4}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={[styles.infoRow, isMobile && styles.infoRowMobile]}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{car.type}</Text>
          </View>
          <View style={styles.detailRatingRow}>
            <Ionicons name="star" size={14} color="#F5A623" />
            <Text style={styles.detailRatingText}>{car.rating.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.title}>{car.name}</Text>

        <View style={[styles.tabRow, isMobile && styles.tabRowMobile]}>
          {tabs.map((tab) => (
            <Pressable key={tab} style={styles.tabButton} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              {activeTab === tab ? <View style={styles.tabIndicator} /> : null}
            </Pressable>
          ))}
        </View>

        {activeTab === "About" ? (
          <>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Rent Partner</Text>

              <View style={styles.partnerRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{partner.name.slice(0, 1)}</Text>
                </View>

                <View style={styles.partnerInfo}>
                  <Text style={styles.partnerName}>{partner.name}</Text>
                  <Text style={styles.partnerRole}>{partner.role}</Text>
                </View>

                <View style={styles.partnerActions}>
                  <Pressable style={styles.smallActionButton}>
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={18}
                      color={palette.samsungBlue}
                    />
                  </Pressable>
                  <Pressable style={styles.smallActionButton}>
                    <Ionicons name="call-outline" size={18} color={palette.samsungBlue} />
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{car.description}</Text>

              <View style={styles.featureWrap}>
                {car.features.map((feature) => (
                  <View key={feature} style={styles.featureChip}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <View style={[styles.statsRow, isMobile && styles.statsRowMobile]}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{car.transmission}</Text>
                  <Text style={styles.statLabel}>Transmission</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{car.fuel}</Text>
                  <Text style={styles.statLabel}>Fuel</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{car.seats}</Text>
                  <Text style={styles.statLabel}>Seats</Text>
                </View>
              </View>
            </View>
          </>
        ) : null}

        {activeTab === "Gallery" ? (
          <View style={styles.galleryGridCard}>
            <View style={[styles.galleryGrid, isMobile && styles.galleryGridMobile]}>
              {gallery.map((image, index) => (
                <Image
                  key={`${image}-gallery-${index}`}
                  source={{ uri: image }}
                  style={[styles.galleryGridImage, isMobile && styles.galleryGridImageMobile]}
                  resizeMode="cover"
                />
              ))}
            </View>
          </View>
        ) : null}

        {activeTab === "Review" ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Review Snapshot</Text>
            <Text style={styles.reviewHighlight}>
              Drivers praise the clean interior, smooth ride, and responsive pickup coordination.
            </Text>
            <Text style={styles.reviewLine}>• Easy handoff at {car.location}</Text>
            <Text style={styles.reviewLine}>• Clear communication before pickup</Text>
            <Text style={styles.reviewLine}>• Accurate photos and well-maintained condition</Text>
          </View>
        ) : null}

        <View style={[styles.bookingDock, isMobile && styles.bookingDockMobile]}>
          <View>
            <Text style={styles.bookingLabel}>Price</Text>
            <Text style={styles.bookingPrice}>
              ฿{car.pricePerDay.toLocaleString()}
              <Text style={styles.bookingUnit}>/day</Text>
            </Text>
          </View>
          <Pressable
            style={[styles.primaryButton, isMobile && styles.primaryButtonMobile]}
            onPress={() => router.push({ pathname: "/payment", params: { carId: car.id } })}
          >
            <Text style={styles.primaryButtonText}>Book Now</Text>
          </Pressable>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  screenWrap: {
    width: "100%",
    gap: spacing.lg,
  },
  chromeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  chromeRowMobile: {
    alignItems: "flex-start",
  },
  chromeTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "700",
  },
  chromeActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  chromeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: palette.white,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.icon,
  },
  galleryCard: {
    backgroundColor: palette.white,
    borderRadius: 22,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.card,
  },
  heroImage: {
    width: "100%",
    height: 210,
    backgroundColor: "#FAFCFF",
    borderRadius: radius.lg,
  },
  heroImageTablet: {
    height: 280,
  },
  sliderTrack: {
    alignSelf: "center",
    width: 120,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: palette.samsungBlueTint,
  },
  sliderThumb: {
    width: 30,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: palette.samsungBlue,
    alignSelf: "center",
    marginTop: -3,
  },
  thumbRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  thumbImage: {
    flex: 1,
    height: 58,
    borderRadius: radius.sm,
    backgroundColor: "#EFF4FB",
  },
  thumbMore: {
    width: 58,
    height: 58,
    borderRadius: radius.sm,
    backgroundColor: palette.samsungBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbMoreText: {
    color: palette.white,
    fontWeight: "800",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  infoRowMobile: {
    alignItems: "flex-start",
  },
  title: {
    color: palette.text,
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "800",
  },
  categoryBadge: {
    backgroundColor: palette.samsungBlueTint,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryText: {
    color: palette.samsungBlue,
    fontWeight: "700",
    fontSize: 12,
  },
  detailRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  detailRatingText: {
    color: palette.textMuted,
    fontWeight: "800",
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E7ECF3",
    gap: spacing.xs,
  },
  tabRowMobile: {
    flexWrap: "wrap",
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    flex: 1,
    gap: 8,
  },
  tabText: {
    color: palette.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  tabTextActive: {
    color: palette.samsungBlue,
    fontWeight: "700",
  },
  tabIndicator: {
    width: 42,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: palette.samsungBlue,
  },
  sectionCard: {
    backgroundColor: palette.white,
    borderRadius: 22,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.softCard,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "800",
  },
  partnerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFE7D6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: palette.accent,
    fontSize: 18,
    fontWeight: "800",
  },
  partnerInfo: {
    flex: 1,
    gap: 3,
  },
  partnerName: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "700",
  },
  partnerRole: {
    color: palette.textMuted,
    fontSize: 13,
  },
  partnerActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  smallActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.samsungBlueTint,
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 22,
  },
  featureWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  featureChip: {
    backgroundColor: "#F4F8FD",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  featureText: {
    color: palette.text,
    fontWeight: "600",
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  statsRowMobile: {
    gap: spacing.xs,
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: "#F8FBFF",
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4,
  },
  statValue: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "700",
  },
  statLabel: {
    color: palette.textMuted,
    fontSize: 12,
  },
  galleryGridCard: {
    backgroundColor: palette.white,
    borderRadius: 22,
    padding: spacing.md,
    ...shadows.softCard,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  galleryGridMobile: {
    gap: spacing.xs,
  },
  galleryGridImage: {
    width: "48%",
    aspectRatio: 1.15,
    borderRadius: radius.md,
    backgroundColor: "#EFF4FB",
  },
  galleryGridImageMobile: {
    width: "100%",
  },
  reviewHighlight: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 24,
  },
  reviewLine: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  bookingDock: {
    backgroundColor: palette.white,
    borderRadius: 22,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    ...shadows.softCard,
  },
  bookingDockMobile: {
    flexWrap: "wrap",
  },
  bookingLabel: {
    color: palette.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  bookingPrice: {
    color: palette.samsungBlue,
    fontSize: 26,
    fontWeight: "800",
  },
  bookingUnit: {
    color: palette.samsungBlueSoft,
    fontSize: 12,
    fontWeight: "600",
  },
  primaryButton: {
    minWidth: 150,
    backgroundColor: palette.samsungBlue,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
  },
  primaryButtonMobile: {
    width: "100%",
  },
  primaryButtonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "800",
  },
  notFoundCard: {
    backgroundColor: palette.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
  },
  notFoundTitle: {
    color: palette.text,
    fontSize: 24,
    fontWeight: "800",
  },
  notFoundBody: {
    color: palette.textMuted,
    lineHeight: 22,
  },
});
