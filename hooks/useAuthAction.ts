import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import { useToast } from "react-native-toast-notifications";

import { clearPendingAuthToast, queuePendingAuthToast } from "@/constants/authFeedback";
import { useAppAuth } from "@/hooks/useAppAuth";

type UseAuthActionOptions = {
  onNativePress?: () => void;
};

export function useAuthAction({ onNativePress }: UseAuthActionOptions = {}) {
  const { t } = useTranslation();
  const toast = useToast();
  const { user, isLoading, signIn, signOut } = useAppAuth();
  const [isPending, setIsPending] = useState(false);

  const handleAuthPress = useCallback(async () => {
    if (Platform.OS !== "web") {
      onNativePress?.();
      return;
    }

    if (isPending) {
      return;
    }

    const isSigningOut = Boolean(user);

    setIsPending(true);

    try {
      queuePendingAuthToast(isSigningOut ? "signed-out" : "signed-in");
      toast.show(t(isSigningOut ? "authSigningOut" : "authOpeningLogin"), {
        type: "normal",
        duration: 1800,
      });

      if (isSigningOut) {
        await signOut();
        return;
      }

      await signIn();
    } catch (error) {
      clearPendingAuthToast();
      toast.show(t(isSigningOut ? "authLogoutError" : "authLoginError"), {
        type: "danger",
      });
      console.error("Auth action failed", error);
    } finally {
      setIsPending(false);
    }
  }, [isPending, onNativePress, signIn, signOut, t, toast, user]);

  return {
    user,
    isLoading,
    isPending,
    authLabel: user ? t("logout") : t("login"),
    handleAuthPress,
  };
}
