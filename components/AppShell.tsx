import type { PropsWithChildren, ReactNode } from "react";
import type { ScrollViewProps, StyleProp, ViewStyle } from "react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { palette, spacing } from "@/constants/theme";
import { useResponsive } from "@/hooks/useResponsive";

type AppShellProps = PropsWithChildren<{
  header?: ReactNode;
  overlay?: ReactNode;
  scrollable?: boolean;
  scrollViewProps?: ScrollViewProps;
  contentStyle?: StyleProp<ViewStyle>;
}>;

export function AppShell({
  children,
  header,
  overlay,
  scrollable = true,
  scrollViewProps,
  contentStyle,
}: AppShellProps) {
  const { contentWidth } = useResponsive();

  const content = (
    <View style={[styles.inner, { maxWidth: contentWidth }, contentStyle]}>
      {header}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          {...scrollViewProps}
          contentContainerStyle={[
            styles.scrollContent,
            scrollViewProps?.contentContainerStyle,
          ]}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
      {overlay ? (
        <View pointerEvents="box-none" style={styles.overlayLayer}>
          {overlay}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  inner: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  overlayLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
});
