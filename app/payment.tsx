import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AppShell } from "@/components/AppShell";
import { palette, radius, spacing } from "@/constants/theme";
import { getCarById } from "@/data/cars";
import { useResponsive } from "@/hooks/useResponsive";

export default function PaymentScreen() {
  const { carId } = useLocalSearchParams<{ carId?: string }>();
  const { isMobile, isTablet } = useResponsive();
  const car = carId ? getCarById(carId) : undefined;
  const [cardholder, setCardholder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleAddPayment = () => {
    Alert.alert(
      "Payment method added",
      "Your card details have been captured for this sample booking flow.",
    );
  };

  const handleConfirmBooking = () => {
    const bookingTarget = car ? `${car.name} in ${car.location}` : "your selected car";
    Alert.alert("Booking requested", `Your booking request for ${bookingTarget} has been created.`);
  };

  return (
    <AppShell>
      <Stack.Screen options={{ title: "Payment method" }} />

      <View style={[styles.layout, isTablet && styles.layoutWide]}>
        <View style={[styles.formCard, isTablet && styles.formCardWide]}>
          <Text style={styles.kicker}>Secure checkout</Text>
          <Text style={styles.title}>Add payment method</Text>
          <Text style={styles.subtitle}>
            Save a card to complete the sample booking flow for Rental Hero.
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Cardholder name</Text>
            <TextInput
              value={cardholder}
              onChangeText={setCardholder}
              placeholder="John Appleseed"
              placeholderTextColor={palette.textMuted}
              style={styles.input}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Card number</Text>
            <TextInput
              value={cardNumber}
              onChangeText={setCardNumber}
              placeholder="4242 4242 4242 4242"
              placeholderTextColor={palette.textMuted}
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>

          <View
            style={[
              styles.row,
              styles.fieldRow,
              isMobile && styles.fieldRowMobile,
            ]}
          >
            <View style={[styles.fieldGroup, styles.rowField]}>
              <Text style={styles.label}>Expiry</Text>
              <TextInput
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="08/28"
                placeholderTextColor={palette.textMuted}
                style={styles.input}
              />
            </View>
            <View style={[styles.fieldGroup, styles.rowField]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                value={cvv}
                onChangeText={setCvv}
                placeholder="123"
                placeholderTextColor={palette.textMuted}
                keyboardType="number-pad"
                secureTextEntry
                style={styles.input}
              />
            </View>
          </View>

          <Pressable style={styles.secondaryButton} onPress={handleAddPayment}>
            <Text style={styles.secondaryButtonText}>Add payment method</Text>
          </Pressable>

          <Pressable style={styles.primaryButton} onPress={handleConfirmBooking}>
            <Text style={styles.primaryButtonText}>Confirm booking</Text>
          </Pressable>
        </View>

        <View style={[styles.summaryCard, isTablet && styles.summaryCardWide]}>
          <Text style={styles.summaryKicker}>Booking summary</Text>
          <Text style={styles.summaryTitle}>{car?.name ?? "Selected rental car"}</Text>
          <Text style={styles.summaryBody}>
            {car
              ? `${car.type} pickup in ${car.location} for ฿${car.pricePerDay.toLocaleString()} per day.`
              : "Choose a car from the listing page to populate the booking summary."}
          </Text>

          {car ? (
            <>
              <View
                style={[
                  styles.summaryLine,
                  isMobile && styles.summaryLineMobile,
                ]}
              >
                <Text style={styles.summaryKey}>Location</Text>
                <Text style={styles.summaryValue}>{car.location}</Text>
              </View>
              <View
                style={[
                  styles.summaryLine,
                  isMobile && styles.summaryLineMobile,
                ]}
              >
                <Text style={styles.summaryKey}>Category</Text>
                <Text style={styles.summaryValue}>{car.type}</Text>
              </View>
              <View
                style={[
                  styles.summaryLine,
                  isMobile && styles.summaryLineMobile,
                ]}
              >
                <Text style={styles.summaryKey}>Daily price</Text>
                <Text style={styles.summaryValue}>฿{car.pricePerDay.toLocaleString()}</Text>
              </View>
            </>
          ) : null}

          <Text style={styles.summaryFootnote}>
            This is a sample UI only. Hook this screen to a real payment provider before production
            use.
          </Text>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  layout: {
    gap: spacing.lg,
  },
  layoutWide: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  formCard: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.xl,
    gap: spacing.md,
  },
  formCardWide: {
    flex: 1.2,
  },
  kicker: {
    color: palette.accent,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    color: palette.text,
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "700",
  },
  input: {
    backgroundColor: palette.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    color: palette.text,
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  fieldRow: {
    flexWrap: "wrap",
  },
  fieldRowMobile: {
    gap: spacing.sm,
  },
  rowField: {
    flex: 1,
    minWidth: 150,
  },
  primaryButton: {
    backgroundColor: palette.primary,
    borderRadius: radius.pill,
    alignItems: "center",
    paddingVertical: 16,
  },
  primaryButtonText: {
    color: palette.white,
    fontWeight: "800",
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: radius.pill,
    alignItems: "center",
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: palette.primary,
  },
  secondaryButtonText: {
    color: palette.primary,
    fontWeight: "800",
    fontSize: 16,
  },
  summaryCard: {
    backgroundColor: palette.primary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
  },
  summaryCardWide: {
    flex: 0.8,
  },
  summaryKicker: {
    color: "#C0D7CC",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  summaryTitle: {
    color: palette.white,
    fontSize: 26,
    fontWeight: "800",
  },
  summaryBody: {
    color: "#D3E0DA",
    fontSize: 14,
    lineHeight: 22,
  },
  summaryLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  summaryLineMobile: {
    flexWrap: "wrap",
  },
  summaryKey: {
    color: "#C0D7CC",
    fontSize: 14,
  },
  summaryValue: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "700",
  },
  summaryFootnote: {
    color: "#D3E0DA",
    fontSize: 13,
    lineHeight: 20,
  },
});
