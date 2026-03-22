import { useAuth } from "@workos-inc/authkit-react";
import { useCallback } from "react";

import type { AuthUser } from "./useAppAuth";

type AppAuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

export function useAppAuth(): AppAuthState {
  const { user, isLoading, signIn, signOut } = useAuth();

  const basePath = process.env.EXPO_PUBLIC_BASE_URL?.trim();
  const normalizedBasePath =
    !basePath || basePath === "/" ? "" : basePath.startsWith("/") ? basePath : `/${basePath}`;

  const handleSignIn = useCallback(async () => {
    await signIn({
      state: {
        returnTo: `${window.location.pathname}${window.location.search}`,
      },
    });
  }, [signIn]);

  const handleSignOut = useCallback(async () => {
    await signOut({
      returnTo: `${window.location.origin}${normalizedBasePath}/cars`,
      navigate: true,
    });
  }, [normalizedBasePath, signOut]);

  return {
    user: user
      ? {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePictureUrl: user.profilePictureUrl,
        }
      : null,
    isLoading,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
}
