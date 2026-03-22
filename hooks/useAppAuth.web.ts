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

  const handleSignIn = useCallback(async () => {
    await signIn({
      state: {
        returnTo: `${window.location.pathname}${window.location.search}`,
      },
    });
  }, [signIn]);

  const handleSignOut = useCallback(async () => {
    signOut({
      returnTo: `${window.location.origin}/cars`,
      navigate: true,
    });
  }, [signOut]);

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
