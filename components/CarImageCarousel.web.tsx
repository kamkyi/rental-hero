import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { palette, radius, shadows, spacing } from "@/constants/theme";

type CarImageCarouselProps = {
  images: string[];
  isTablet: boolean;
};

export function CarImageCarousel({ images, isTablet }: CarImageCarouselProps) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaViewportRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false });
  const [thumbViewportRef, thumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);

    if (thumbApi) {
      thumbApi.scrollTo(index);
    }
  }, [emblaApi, thumbApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaApi) {
        return;
      }

      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  if (safeImages.length === 0) {
    return null;
  }

  return (
    <View style={styles.galleryCard}>
      <View ref={emblaViewportRef as never} style={styles.emblaViewport}>
        <View style={styles.emblaContainer}>
          {safeImages.map((image, index) => (
            <View key={`${image}-hero-${index}`} style={styles.emblaSlide}>
              <Image
                source={{ uri: image }}
                style={[styles.heroImage, isTablet && styles.heroImageTablet]}
                resizeMode="contain"
              />
            </View>
          ))}
        </View>
      </View>

      <View ref={thumbViewportRef as never} style={styles.thumbViewport}>
        <View style={styles.thumbTrack}>
          {safeImages.map((image, index) => (
            <View key={`${image}-thumb-${index}`} style={styles.thumbSlide}>
              <Pressable
                onPress={() => onThumbClick(index)}
                style={[styles.thumbButton, selectedIndex === index && styles.thumbButtonActive]}
              >
                <Image source={{ uri: image }} style={styles.thumbImage} resizeMode="cover" />
              </Pressable>
            </View>
          ))}
        </View>
      </View>
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
  emblaViewport: {
    overflow: "hidden",
  },
  emblaContainer: {
    flexDirection: "row",
  },
  emblaSlide: {
    flexShrink: 0,
    width: "100%",
    minWidth: 0,
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
  thumbViewport: {
    overflow: "hidden",
  },
  thumbTrack: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  thumbSlide: {
    flexShrink: 0,
    width: spacing.xxl + spacing.xl,
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
