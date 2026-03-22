import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { palette, radius, shadows, spacing } from "@/constants/theme";

type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  description?: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  emphasis?: "default" | "price";
};

export function FilterChip({
  label,
  selected,
  onPress,
  description,
  icon,
  emphasis = "default",
}: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        emphasis === "price" ? styles.priceChip : styles.standardChip,
        selected ? styles.chipSelected : styles.chipIdle,
      ]}
    >
      <View style={styles.topRow}>
        {icon ? (
          <View style={[styles.iconWrap, selected ? styles.iconWrapSelected : styles.iconWrapIdle]}>
            <Ionicons
              name={icon}
              size={16}
              color={selected ? palette.samsungBlue : palette.samsungBlueSoft}
            />
          </View>
        ) : (
          <View />
        )}

        {selected ? (
          <View style={styles.selectedBadge}>
            <Ionicons name="checkmark" size={13} color={palette.white} />
          </View>
        ) : null}
      </View>

      <View style={styles.textBlock}>
        <Text style={[styles.label, selected ? styles.labelSelected : styles.labelIdle]}>
          {label}
        </Text>
        {description ? (
          <Text
            style={[
              styles.description,
              selected ? styles.descriptionSelected : styles.descriptionIdle,
            ]}
          >
            {description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 92,
    borderRadius: radius.control,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    justifyContent: "space-between",
    gap: spacing.md,
  },
  standardChip: {
    flex: 1,
  },
  priceChip: {
    minHeight: 80,
  },
  chipIdle: {
    backgroundColor: palette.white,
    borderColor: palette.border,
  },
  chipSelected: {
    backgroundColor: palette.samsungBlueTint,
    borderColor: palette.samsungBlueSoft,
    ...shadows.softCard,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapIdle: {
    backgroundColor: palette.samsungBlueTint,
  },
  iconWrapSelected: {
    backgroundColor: "#D7E1F4",
  },
  selectedBadge: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: palette.samsungBlue,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    gap: spacing.xxs,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
  },
  labelIdle: {
    color: palette.samsungBlue,
  },
  labelSelected: {
    color: palette.samsungBlue,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  descriptionIdle: {
    color: "#6F84A8",
  },
  descriptionSelected: {
    color: palette.samsungBlueSoft,
  },
});
