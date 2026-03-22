import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";

import { palette, radius, shadows, spacing } from "@/constants/theme";

type CarImageCarouselProps = {
  images: string[];
  isTablet: boolean;
};

export function CarImageCarousel({ images, isTablet }: CarImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const heroImage = safeImages[selectedIndex] ?? safeImages[0];

  if (!heroImage) {
    return null;
  }

  return (
    <View style={styles.galleryCard}>
      <Image
        source={{ uri: heroImage }}
        style={[styles.heroImage, isTablet && styles.heroImageTablet]}
        resizeMode="contain"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.thumbRow}
      >
        {safeImages.map((image, index) => (
          <Pressable
            key={`${image}-${index}`}
            onPress={() => setSelectedIndex(index)}
            style={[styles.thumbButton, selectedIndex === index && styles.thumbButtonActive]}
          >
            <Image source={{ uri: image }} style={styles.thumbImage} resizeMode="cover" />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  galleryCard: {
    backgroundColor: palette.white,
    borderRadius: radius.card,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.card,
  },
  heroImage: {
    width: "100%",
    height: spacing.xxl * 6 + spacing.sm,
    backgroundColor: "#FAFCFF",
    borderRadius: radius.lg,
  },
  heroImageTablet: {
    height: spacing.xxl * 8 + spacing.md,
  },
  thumbRow: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  thumbButton: {
    width: spacing.xxl + spacing.xl,
    height: spacing.xxl + spacing.xl,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "rgba(22, 33, 62, 0.1)",
    overflow: "hidden",
    backgroundColor: "#EFF4FB",
  },
  thumbButtonActive: {
    borderColor: palette.samsungBlue,
    ...shadows.icon,
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
});
