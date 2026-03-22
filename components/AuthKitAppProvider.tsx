import type { PropsWithChildren } from "react";

import { AppToastProvider } from "@/components/AppToastProvider";

export function AuthKitAppProvider({ children }: PropsWithChildren) {
  return <AppToastProvider>{children}</AppToastProvider>;
}
