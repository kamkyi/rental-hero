export type PendingAuthToast = "signed-in" | "signed-out";

const AUTH_FEEDBACK_STORAGE_KEY = "rentalhero.auth.feedback";

function canUseSessionStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function queuePendingAuthToast(nextToast: PendingAuthToast) {
  if (!canUseSessionStorage()) {
    return;
  }

  try {
    window.sessionStorage.setItem(AUTH_FEEDBACK_STORAGE_KEY, nextToast);
  } catch {
    // Ignore storage failures and continue with the auth flow.
  }
}

export function readPendingAuthToast(): PendingAuthToast | null {
  if (!canUseSessionStorage()) {
    return null;
  }

  let nextToast: string | null = null;

  try {
    nextToast = window.sessionStorage.getItem(AUTH_FEEDBACK_STORAGE_KEY);
  } catch {
    return null;
  }

  if (nextToast === "signed-in" || nextToast === "signed-out") {
    return nextToast;
  }

  return null;
}

export function clearPendingAuthToast() {
  if (!canUseSessionStorage()) {
    return;
  }

  try {
    window.sessionStorage.removeItem(AUTH_FEEDBACK_STORAGE_KEY);
  } catch {
    // Ignore storage failures and continue with the auth flow.
  }
}
