import { AuthKitProvider } from "@workos-inc/authkit-react";
import type { PropsWithChildren } from "react";

import { AppToastProvider } from "@/components/AppToastProvider";

function parseBoolean(value?: string) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}

function normalizeBasePath(basePath?: string) {
  if (!basePath || basePath === "/") {
    return "";
  }

  return basePath.startsWith("/") ? basePath : `/${basePath}`;
}

export function AuthKitAppProvider({ children }: PropsWithChildren) {
  const clientId = process.env.EXPO_PUBLIC_WORKOS_CLIENT_ID?.trim();

  if (!clientId) {
    return <AppToastProvider>{children}</AppToastProvider>;
  }

  const basePath = normalizeBasePath(process.env.EXPO_PUBLIC_BASE_URL);
  const defaultRedirectUri = `${window.location.origin}${basePath}/cars`;
  const redirectUri = process.env.EXPO_PUBLIC_WORKOS_REDIRECT_URI?.trim() || defaultRedirectUri;
  const apiHostname = process.env.EXPO_PUBLIC_WORKOS_API_HOSTNAME?.trim();
  const devMode = parseBoolean(process.env.EXPO_PUBLIC_WORKOS_DEV_MODE);

  return (
    <AuthKitProvider
      clientId={clientId}
      redirectUri={redirectUri}
      apiHostname={apiHostname || undefined}
      devMode={devMode}
      onRedirectCallback={({ state }) => {
        if (typeof state?.returnTo === "string" && state.returnTo.length > 0) {
          window.location.assign(state.returnTo);
        }
      }}
    >
      <AppToastProvider>{children}</AppToastProvider>
    </AuthKitProvider>
  );
}
