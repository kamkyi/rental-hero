import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { palette, spacing } from "@/constants/theme";

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
          <View
            style={[
              styles.iconWrap,
              selected ? styles.iconWrapSelected : styles.iconWrapIdle,
            ]}
          >
            <Ionicons
              name={icon}
              size={16}
              color={selected ? "#0F66EA" : "#4A74B3"}
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
        <Text
          style={[
            styles.label,
            selected ? styles.labelSelected : styles.labelIdle,
          ]}
        >
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
    minHeight: 82,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  standardChip: {
    flex: 1,
  },
  priceChip: {
    minHeight: 74,
  },
  chipIdle: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderColor: "rgba(255,255,255,0.18)",
  },
  chipSelected: {
    backgroundColor: "#F3F8FF",
    borderColor: "#7BB0FF",
    boxShadow: "0px 8px 18px rgba(15, 102, 234, 0.12)",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapIdle: {
    backgroundColor: "#EAF3FF",
  },
  iconWrapSelected: {
    backgroundColor: "#DCEBFF",
  },
  selectedBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#0F66EA",
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
  },
  labelIdle: {
    color: "#12315F",
  },
  labelSelected: {
    color: "#0F66EA",
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
  },
  descriptionIdle: {
    color: "#6F84A8",
  },
  descriptionSelected: {
    color: "#4A74B3",
  },
});
