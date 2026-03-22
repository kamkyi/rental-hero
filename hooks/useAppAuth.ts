import { useCallback } from "react";

export type AuthUser = {
  email: string;
  firstName: string | null;
  lastName: string | null;
  profilePictureUrl: string | null;
};

type AppAuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

export function useAppAuth(): AppAuthState {
  const signIn = useCallback(async () => {}, []);
  const signOut = useCallback(async () => {}, []);

  return {
    user: null,
    isLoading: false,
    signIn,
    signOut,
  };
}
