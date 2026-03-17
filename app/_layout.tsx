import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { LogBox } from "react-native";
import "react-native-reanimated";

import { palette } from "@/constants/theme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (!__DEV__) {
      return;
    }

    const ignoredMessages = [
      "props.pointerEvents is deprecated. Use style.pointerEvents",
      "Image: style.tintColor is deprecated. Please use props.tintColor.",
      "TouchableWithoutFeedback is deprecated. Please use Pressable.",
    ];

    LogBox.ignoreLogs(ignoredMessages);

    const originalWarn = console.warn;

    console.warn = (...args: Parameters<typeof console.warn>) => {
      const [firstArg] = args;

      if (
        typeof firstArg === "string" &&
        ignoredMessages.some((message) => firstArg.includes(message))
      ) {
        return;
      }

      originalWarn(...args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return (
    <ThemeProvider
      value={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: palette.background,
          card: palette.surface,
          border: palette.border,
          text: palette.text,
          primary: palette.primary,
        },
      }}
    >
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: palette.surface },
          headerTintColor: palette.text,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: palette.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="cars/[id]" options={{ title: "Car details" }} />
        <Stack.Screen name="payment" options={{ title: "Payment method" }} />
      </Stack>
    </ThemeProvider>
  );
}
