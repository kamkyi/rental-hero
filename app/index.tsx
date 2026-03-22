import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { palette, radius, spacing } from "@/constants/theme";

type PermissionState = "checking" | "prompt" | "blocked" | "requesting";

const locationPromptCopy = {
  eyebrow: "Location Access",
  title: "Allow location for nearby rentals",
  body: "We use your location to suggest nearby pickup cities and make local availability faster to browse.",
};

export default function IndexScreen() {
  const [permissionState, setPermissionState] =
    useState<PermissionState>("checking");

  useEffect(() => {
    let isMounted = true;

    const loadPermissionState = async () => {
      if (Platform.OS === "web") {
        if (isMounted) {
          setPermissionState("prompt");
        }
        return;
      }

      try {
        const permission = await Location.getForegroundPermissionsAsync();

        if (!isMounted) {
          return;
        }

        if (permission.granted) {
          router.replace("/cars");
          return;
        }

        setPermissionState(permission.canAskAgain ? "prompt" : "blocked");
      } catch {
        if (isMounted) {
          setPermissionState("prompt");
        }
      }
    };

    loadPermissionState();

    return () => {
      isMounted = false;
    };
  }, []);

  const continueToCars = () => {
    router.replace("/cars");
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === "web") {
      continueToCars();
      return;
    }

    setPermissionState("requesting");

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.granted) {
        continueToCars();
        return;
      }

      setPermissionState(permission.canAskAgain ? "prompt" : "blocked");
    } catch {
      setPermissionState("prompt");
    }
  };

  const openDeviceSettings = async () => {
    try {
      await Linking.openSettings();
    } finally {
      continueToCars();
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.heroPanel}>
        <Text style={styles.eyebrow}>{locationPromptCopy.eyebrow}</Text>
        <Text style={styles.title}>{locationPromptCopy.title}</Text>
        <Text style={styles.body}>{locationPromptCopy.body}</Text>

        <View style={styles.bulletList}>
          <Text style={styles.bullet}>Nearby pickup city suggestions</Text>
          <Text style={styles.bullet}>Faster local availability browsing</Text>
          <Text style={styles.bullet}>You can continue without it</Text>
        </View>
      </View>

      <View style={styles.actionPanel}>
        {permissionState === "checking" ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={palette.samsungBlue} />
            <Text style={styles.loadingText}>
              Checking permission status...
            </Text>
          </View>
        ) : null}

        {permissionState === "prompt" ? (
          <>
            <Pressable
              style={styles.primaryButton}
              onPress={requestLocationPermission}
            >
              <Text style={styles.primaryButtonText}>Allow location</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={continueToCars}>
              <Text style={styles.secondaryButtonText}>Not now</Text>
            </Pressable>
          </>
        ) : null}

        {permissionState === "requesting" ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={palette.samsungBlue} />
            <Text style={styles.loadingText}>Waiting for your decision...</Text>
          </View>
        ) : null}

        {permissionState === "blocked" ? (
          <>
            <Text style={styles.blockedText}>
              Location access is currently blocked for this app. You can enable
              it in system settings, or continue without it.
            </Text>
            <Pressable
              style={styles.primaryButton}
              onPress={openDeviceSettings}
            >
              <Text style={styles.primaryButtonText}>Open settings</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={continueToCars}>
              <Text style={styles.secondaryButtonText}>
                Continue without location
              </Text>
            </Pressable>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    justifyContent: "space-between",
    gap: spacing.lg,
  },
  heroPanel: {
    backgroundColor: palette.white,
    borderRadius: radius.sheet,
    padding: spacing.lg,
    gap: spacing.md,
  },
  eyebrow: {
    color: palette.samsungBlueSoft,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  title: {
    color: palette.samsungBlue,
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
  },
  body: {
    color: palette.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  bulletList: {
    gap: spacing.xs,
  },
  bullet: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "600",
  },
  actionPanel: {
    backgroundColor: palette.white,
    borderRadius: radius.card,
    padding: spacing.md,
    gap: spacing.sm,
  },
  loadingState: {
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  loadingText: {
    color: palette.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  blockedText: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  primaryButton: {
    minHeight: 52,
    borderRadius: radius.control,
    backgroundColor: palette.samsungBlue,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  primaryButtonText: {
    color: palette.white,
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: radius.control,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  secondaryButtonText: {
    color: palette.samsungBlue,
    fontSize: 15,
    fontWeight: "700",
  },
});
