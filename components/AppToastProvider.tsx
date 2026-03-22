import { Ionicons } from "@expo/vector-icons";
import type { PropsWithChildren, ReactNode } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { ToastProvider, useToast } from "react-native-toast-notifications";

import { clearPendingAuthToast, readPendingAuthToast } from "@/constants/authFeedback";
import { palette, radius, shadows, spacing } from "@/constants/theme";
import { useAppAuth } from "@/hooks/useAppAuth";
import { useResponsive } from "@/hooks/useResponsive";

type ThemedToastData = {
  message: string | ReactNode;
  type?: string;
  style?: StyleProp<ViewStyle>;
};

function resolveToastTone(type?: string) {
  if (type === "success") {
    return {
      icon: "checkmark-circle" as const,
      iconColor: palette.success,
      iconBackgroundColor: "rgba(43, 140, 99, 0.14)",
    };
  }

  if (type === "danger") {
    return {
      icon: "alert-circle" as const,
      iconColor: palette.danger,
      iconBackgroundColor: "rgba(178, 77, 66, 0.14)",
    };
  }

  if (type === "warning") {
    return {
      icon: "warning" as const,
      iconColor: palette.accent,
      iconBackgroundColor: "rgba(217, 122, 57, 0.14)",
    };
  }

  return {
    icon: "information-circle-outline" as const,
    iconColor: palette.samsungBlue,
    iconBackgroundColor: palette.samsungBlueTint,
  };
}

function ThemedToast({ message, style, type }: ThemedToastData) {
  const tone = resolveToastTone(type);

  return (
    <View style={[styles.toastCard, style]}>
      <View style={[styles.toastIconWrap, { backgroundColor: tone.iconBackgroundColor }]}>
        <Ionicons name={tone.icon} size={18} color={tone.iconColor} />
      </View>
      <View style={styles.toastBody}>
        {typeof message === "string" ? <Text style={styles.toastMessage}>{message}</Text> : message}
      </View>
    </View>
  );
}

function AuthToastBridge() {
  const { t } = useTranslation();
  const toast = useToast();
  const { user, isLoading } = useAppAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const pendingToast = readPendingAuthToast();

    if (!pendingToast) {
      return;
    }

    const shouldShowToast = pendingToast === "signed-in" ? Boolean(user) : !user;

    if (!shouldShowToast) {
      return;
    }

    clearPendingAuthToast();
    toast.show(pendingToast === "signed-in" ? t("authLoginSuccess") : t("authLogoutSuccess"), {
      type: pendingToast === "signed-in" ? "success" : "normal",
      duration: 2600,
    });
  }, [isLoading, t, toast, user]);

  return null;
}

export function AppToastProvider({ children }: PropsWithChildren) {
  const { contentWidth, isMobile, width } = useResponsive();
  const toastWidth = isMobile ? width - spacing.xxs * 2 : contentWidth;

  return (
    <ToastProvider
      placement="top"
      duration={2800}
      animationType="zoom-in"
      animationDuration={220}
      offsetTop={spacing.xl}
      swipeEnabled
      renderToast={(toast) => (
        <ThemedToast
          message={toast.message}
          style={{ maxWidth: toastWidth, width: toastWidth }}
          type={toast.type}
        />
      )}
    >
      <AuthToastBridge />
      {children}
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  toastCard: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.white,
    ...shadows.card,
  },
  toastIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  toastBody: {
    flex: 1,
    minWidth: 0,
  },
  toastMessage: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
});
