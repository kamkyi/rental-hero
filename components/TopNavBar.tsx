import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { palette, radius, shadows, spacing } from "@/constants/theme";
import { useResponsive } from "@/hooks/useResponsive";

type TopNavBarProps = {
  selectedLocation: string;
  locationOptions: readonly string[];
  onLocationChange: (location: string) => void;
  onLoginPress: () => void;
};

type LanguageCode = "en" | "my" | "th";

export function TopNavBar({
  selectedLocation,
  locationOptions,
  onLocationChange,
  onLoginPress,
}: TopNavBarProps) {
  const { t, i18n } = useTranslation();
  const { isMobile } = useResponsive();
  const [openMenu, setOpenMenu] = useState<"location" | "language" | null>(null);

  const activeLanguage = (i18n.language as LanguageCode) || "en";

  const changeLanguage = (language: LanguageCode) => {
    i18n.changeLanguage(language);
    setOpenMenu(null);
  };

  return (
    <View style={styles.navWrap}>
      <View style={[styles.navBar, isMobile && styles.navBarMobile]}>
        <View style={styles.brandBlock}>
          <Text style={styles.brandText}>{t("appName")}</Text>
        </View>

        <View style={[styles.navActions, isMobile && styles.navActionsMobile]}>
          <View
            style={[
              styles.dropdownWrap,
              isMobile && styles.dropdownWrapMobile,
              openMenu === "location" && styles.dropdownWrapActive,
            ]}
          >
            <Pressable
              style={[styles.dropdownButton, isMobile && styles.dropdownButtonMobile]}
              onPress={() => setOpenMenu("location")}
            >
              <Ionicons name="location-outline" size={16} color={palette.samsungBlue} />
              <Text style={styles.dropdownText}>{selectedLocation}</Text>
              <Ionicons name="chevron-down" size={14} color={palette.samsungBlueSoft} />
            </Pressable>

            {openMenu === "location" ? (
              <View style={[styles.dropdownMenu, isMobile && styles.dropdownMenuMobile]}>
                {locationOptions.map((location) => (
                  <Pressable
                    key={location}
                    style={styles.dropdownOption}
                    onPress={() => {
                      onLocationChange(location);
                      setOpenMenu(null);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{location}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>

          <View
            style={[
              styles.dropdownWrap,
              isMobile && styles.dropdownWrapMobile,
              openMenu === "language" && styles.dropdownWrapActive,
            ]}
          >
            <Pressable
              style={[styles.dropdownButton, isMobile && styles.dropdownButtonMobile]}
              onPress={() => setOpenMenu("language")}
            >
              <Ionicons name="language-outline" size={16} color={palette.samsungBlue} />
              <Text style={styles.dropdownText}>{t(`languageNames.${activeLanguage}`)}</Text>
              <Ionicons name="chevron-down" size={14} color={palette.samsungBlueSoft} />
            </Pressable>

            {openMenu === "language" ? (
              <View style={[styles.dropdownMenu, isMobile && styles.dropdownMenuMobile]}>
                {(["en", "my", "th"] as const).map((language) => (
                  <Pressable
                    key={language}
                    style={styles.dropdownOption}
                    onPress={() => changeLanguage(language)}
                  >
                    <Text style={styles.dropdownOptionText}>{t(`languageNames.${language}`)}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>

          <Pressable
            style={[styles.loginButton, isMobile && styles.loginButtonMobile]}
            onPress={onLoginPress}
          >
            <Text style={styles.loginText}>{t("login")}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navWrap: {
    zIndex: 10,
  },
  navBar: {
    paddingVertical: spacing.xs,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
    flexWrap: "wrap",
  },
  navBarMobile: {
    gap: spacing.sm,
  },
  brandBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandText: {
    color: palette.samsungBlue,
    fontSize: 18,
    fontWeight: "800",
  },
  navActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flexWrap: "wrap",
  },
  navActionsMobile: {
    width: "100%",
    alignItems: "stretch",
    gap: spacing.sm,
  },
  dropdownWrap: {
    position: "relative",
    zIndex: 20,
  },
  dropdownWrapActive: {
    zIndex: 30,
  },
  dropdownWrapMobile: {
    flexBasis: "48%",
    flexGrow: 1,
    minWidth: 0,
  },
  dropdownButton: {
    minHeight: 40,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.samsungBlueTint,
    backgroundColor: palette.surface,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  dropdownButtonMobile: {
    width: "100%",
    justifyContent: "space-between",
  },
  dropdownText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "700",
    flexShrink: 1,
  },
  dropdownMenu: {
    position: "absolute",
    top: 46,
    right: 0,
    minWidth: 156,
    backgroundColor: palette.white,
    borderRadius: radius.control,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: "rgba(22, 33, 62, 0.08)",
    ...shadows.card,
  },
  dropdownMenuMobile: {
    top: 48,
    left: 0,
    right: 0,
    minWidth: 0,
  },
  dropdownOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dropdownOptionText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    minHeight: 40,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: palette.samsungBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonMobile: {
    width: "100%",
  },
  loginText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "800",
  },
});
