import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Easing,
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Calendar, type DateData } from "react-native-calendars";

import { AppShell } from "@/components/AppShell";
import { CarCard } from "@/components/CarCard";
import { FilterChip } from "@/components/FilterChip";
import { TopNavBar } from "@/components/TopNavBar";
import { palette, radius, shadows, spacing } from "@/constants/theme";
import { cars, carTypes, locations } from "@/data/cars";
import { useAppAuth } from "@/hooks/useAppAuth";
import { useResponsive } from "@/hooks/useResponsive";

const priceRanges = [
  { label: "All prices", min: 0, max: Number.POSITIVE_INFINITY },
  { label: "Up to ฿1,500", min: 0, max: 1500 },
  { label: "฿1,500 - ฿3,000", min: 1500, max: 3000 },
  { label: "Above ฿3,000", min: 3000, max: Number.POSITIVE_INFINITY },
];

const locationDescriptions: Record<(typeof locations)[number], string> = {
  All: "Browse all pickup cities",
  Bangkok: "Airport, Sukhumvit, Sathorn",
  "Chiang Mai": "Old City and Nimman pickup",
  Phuket: "Patong and airport delivery",
  Pattaya: "Beach road and downtown pickup",
};

const locationIcons: Record<
  (typeof locations)[number],
  React.ComponentProps<typeof Ionicons>["name"]
> = {
  All: "globe-outline",
  Bangkok: "business-outline",
  "Chiang Mai": "leaf-outline",
  Phuket: "sunny-outline",
  Pattaya: "boat-outline",
};

const carTypeDescriptions: Record<(typeof carTypes)[number], string> = {
  All: "See every available vehicle",
  SUV: "Family trips and extra luggage",
  Sedan: "City rides and business travel",
  Luxury: "Premium comfort and style",
  Electric: "Quiet drives with low fuel cost",
  Van: "Large groups and airport transfer",
};

const carTypeIcons: Record<
  (typeof carTypes)[number],
  React.ComponentProps<typeof Ionicons>["name"]
> = {
  All: "apps-outline",
  SUV: "car-sport-outline",
  Sedan: "car-outline",
  Luxury: "diamond-outline",
  Electric: "flash-outline",
  Van: "bus-outline",
};

const priceDescriptions: Record<string, string> = {
  "All prices": "Flexible budget across all cars",
  "Up to ฿1,500": "Best-value daily rentals",
  "฿1,500 - ฿3,000": "Balanced comfort and price",
  "Above ฿3,000": "Premium and flagship vehicles",
};

const filterSections = ["dates", "location", "type", "price"] as const;
type FilterSection = (typeof filterSections)[number];

const filterSectionLabels: Record<FilterSection, string> = {
  dates: "Dates",
  location: "Location",
  type: "Car Type",
  price: "Price",
};

const today = new Date();

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date: Date, count: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
}

function formatDisplayDate(dateKey?: string) {
  if (!dateKey) {
    return "Select date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(parseDateKey(dateKey));
}

function buildMarkedRange(startDate?: string, endDate?: string) {
  if (!startDate) {
    return {};
  }

  if (!endDate || startDate === endDate) {
    return {
      [startDate]: {
        startingDay: true,
        endingDay: true,
        color: palette.samsungBlue,
        textColor: "#FFFFFF",
      },
    };
  }

  const marks: Record<
    string,
    {
      startingDay?: boolean;
      endingDay?: boolean;
      color: string;
      textColor: string;
    }
  > = {};
  const cursor = parseDateKey(startDate);
  const finalDate = parseDateKey(endDate);

  while (cursor <= finalDate) {
    const key = toDateKey(cursor);
    const isFirst = key === startDate;
    const isLast = key === endDate;

    marks[key] = {
      startingDay: isFirst,
      endingDay: isLast,
      color: isFirst || isLast ? palette.samsungBlue : palette.samsungBlueTint,
      textColor: isFirst || isLast ? "#FFFFFF" : "#16478A",
    };

    cursor.setDate(cursor.getDate() + 1);
  }

  return marks;
}

export default function CarsTabScreen() {
  const { isCompact, isMobile, isTablet, listColumns, contentWidth } = useResponsive();
  const { user, signIn, signOut } = useAppAuth();
  const { t } = useTranslation();
  const stickyProgress = useRef(new Animated.Value(0)).current;
  const stickyVisibleRef = useRef(false);
  const [search, setSearch] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isStickyFiltersVisible, setIsStickyFiltersVisible] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState<FilterSection>("dates");
  const [selectedLocation, setSelectedLocation] = useState<(typeof locations)[number]>("All");
  const [selectedType, setSelectedType] = useState<(typeof carTypes)[number]>("All");
  const [selectedPrice, setSelectedPrice] = useState(priceRanges[0].label);
  const [dateFrom, setDateFrom] = useState(toDateKey(addDays(today, 2)));
  const [dateTo, setDateTo] = useState(toDateKey(addDays(today, 5)));

  const filteredCars = useMemo(() => {
    const activeRange =
      priceRanges.find((range) => range.label === selectedPrice) ?? priceRanges[0];
    const normalized = search.trim().toLowerCase();

    return cars.filter((car) => {
      const matchesSearch =
        normalized.length === 0 ||
        car.name.toLowerCase().includes(normalized) ||
        car.type.toLowerCase().includes(normalized) ||
        car.location.toLowerCase().includes(normalized);
      const matchesLocation = selectedLocation === "All" || car.location === selectedLocation;
      const matchesType = selectedType === "All" || car.type === selectedType;
      const matchesPrice = car.pricePerDay >= activeRange.min && car.pricePerDay <= activeRange.max;

      return matchesSearch && matchesLocation && matchesType && matchesPrice;
    });
  }, [search, selectedLocation, selectedType, selectedPrice]);

  const displayLocation =
    selectedLocation === "All" ? "Bangkok, Thailand" : `${selectedLocation}, Thailand`;

  const activeLocationText = selectedLocation === "All" ? "Any pickup city" : selectedLocation;
  const activeTypeText = selectedType === "All" ? "Any vehicle class" : selectedType;
  const dateSummaryText = `${formatDisplayDate(dateFrom)} - ${formatDisplayDate(dateTo)}`;
  const activeFilterCount = [
    search.trim().length > 0,
    selectedLocation !== "All",
    selectedType !== "All",
    selectedPrice !== priceRanges[0].label,
  ].filter(Boolean).length;

  const markedDates = useMemo(() => buildMarkedRange(dateFrom, dateTo), [dateFrom, dateTo]);

  const tripLength = useMemo(() => {
    if (!dateFrom || !dateTo) {
      return 0;
    }

    const difference = parseDateKey(dateTo).getTime() - parseDateKey(dateFrom).getTime();
    return Math.max(1, Math.ceil(difference / (1000 * 60 * 60 * 24)));
  }, [dateFrom, dateTo]);

  const handleDateSelect = (day: DateData) => {
    if (!dateFrom || (dateFrom && dateTo)) {
      setDateFrom(day.dateString);
      setDateTo("");
      return;
    }

    if (day.dateString < dateFrom) {
      setDateFrom(day.dateString);
      setDateTo("");
      return;
    }

    setDateTo(day.dateString);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedLocation("All");
    setSelectedType("All");
    setSelectedPrice(priceRanges[0].label);
    setDateFrom(toDateKey(addDays(today, 2)));
    setDateTo(toDateKey(addDays(today, 5)));
  };

  const blurActiveWebElement = () => {
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const openFilters = () => {
    blurActiveWebElement();
    setActiveFilterSection("dates");
    setIsFiltersOpen(true);
  };

  const openFilterSection = (section: FilterSection) => {
    blurActiveWebElement();
    setActiveFilterSection(section);
    setIsFiltersOpen(true);
  };

  const closeFilters = () => {
    blurActiveWebElement();
    setIsFiltersOpen(false);
  };

  const handleLoginPress = async () => {
    if (Platform.OS !== "web") {
      router.push("/(tabs)/profile");
      return;
    }

    try {
      if (user) {
        await signOut();
        return;
      }

      await signIn();
    } catch (error) {
      console.error("AuthKit auth action failed", error);
    }
  };

  const setStickyFiltersVisible = (nextVisible: boolean) => {
    if (stickyVisibleRef.current === nextVisible) {
      return;
    }

    stickyVisibleRef.current = nextVisible;
    setIsStickyFiltersVisible(nextVisible);

    Animated.timing(stickyProgress, {
      toValue: nextVisible ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const stickyRevealOffset = isTablet ? 250 : 190;
    setStickyFiltersVisible(yOffset > stickyRevealOffset);
  };

  const stickyTranslateY = stickyProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0],
  });
  const stickyScale = stickyProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1],
  });

  const renderFilterSection = (section: FilterSection) => {
    if (section === "dates") {
      return (
        <View style={styles.filterGroup}>
          <View style={styles.modalSectionHeader}>
            <Text style={styles.modalSectionTitle}>Rental dates</Text>
            <Text style={styles.modalSectionMeta}>{tripLength} days selected</Text>
          </View>

          <View style={styles.dateSummaryRow}>
            <View style={styles.modalDateCard}>
              <Text style={styles.modalDateLabel}>From</Text>
              <Text style={styles.modalDateValue}>{formatDisplayDate(dateFrom)}</Text>
            </View>
            <View style={styles.modalDateCard}>
              <Text style={styles.modalDateLabel}>To</Text>
              <Text style={styles.modalDateValue}>{formatDisplayDate(dateTo)}</Text>
            </View>
            <View style={styles.modalTripCard}>
              <Text style={styles.modalTripValue}>{tripLength}</Text>
              <Text style={styles.modalTripLabel}>days</Text>
            </View>
          </View>

          <View style={styles.calendarCardModal}>
            <Calendar
              current={dateFrom}
              minDate={toDateKey(today)}
              onDayPress={handleDateSelect}
              markingType="period"
              markedDates={markedDates}
              enableSwipeMonths
              hideExtraDays={false}
              theme={{
                calendarBackground: "#FFFFFF",
                textSectionTitleColor: "#7D8FB3",
                monthTextColor: palette.samsungBlue,
                textMonthFontWeight: "700",
                textDayFontWeight: "600",
                textDayHeaderFontWeight: "700",
                arrowColor: palette.samsungBlue,
                todayTextColor: palette.samsungBlue,
                dayTextColor: "#243250",
                textDisabledColor: "#C1CEE2",
              }}
              style={styles.calendar}
            />
          </View>
        </View>
      );
    }

    if (section === "location") {
      return (
        <View style={styles.filterGroup}>
          <View style={styles.modalSectionHeader}>
            <Text style={styles.modalSectionTitle}>Pickup location</Text>
            <Text style={styles.modalSectionMeta}>{activeLocationText}</Text>
          </View>
          <View style={styles.optionGrid}>
            {locations.map((location) => (
              <View
                key={location}
                style={[
                  styles.optionCell,
                  isTablet ? styles.optionCellTablet : styles.optionCellMobile,
                ]}
              >
                <FilterChip
                  label={location}
                  description={locationDescriptions[location]}
                  icon={locationIcons[location]}
                  selected={selectedLocation === location}
                  onPress={() => setSelectedLocation(location)}
                />
              </View>
            ))}
          </View>
        </View>
      );
    }

    if (section === "type") {
      return (
        <View style={styles.filterGroup}>
          <View style={styles.modalSectionHeader}>
            <Text style={styles.modalSectionTitle}>Car type</Text>
            <Text style={styles.modalSectionMeta}>{activeTypeText}</Text>
          </View>
          <View style={styles.optionGrid}>
            {carTypes.map((type) => (
              <View
                key={type}
                style={[
                  styles.optionCell,
                  isTablet ? styles.optionCellTablet : styles.optionCellMobile,
                ]}
              >
                <FilterChip
                  label={type}
                  description={carTypeDescriptions[type]}
                  icon={carTypeIcons[type]}
                  selected={selectedType === type}
                  onPress={() => setSelectedType(type)}
                />
              </View>
            ))}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.filterGroup}>
        <View style={styles.modalSectionHeader}>
          <Text style={styles.modalSectionTitle}>Price range</Text>
          <Text style={styles.modalSectionMeta}>{selectedPrice}</Text>
        </View>
        <View style={styles.priceOptionStack}>
          {priceRanges.map((range) => (
            <FilterChip
              key={range.label}
              label={range.label}
              description={priceDescriptions[range.label]}
              icon="cash-outline"
              emphasis="price"
              selected={selectedPrice === range.label}
              onPress={() => setSelectedPrice(range.label)}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <AppShell
      scrollable={false}
      contentStyle={styles.shellContent}
      overlay={
        <Animated.View
          pointerEvents={isStickyFiltersVisible ? "auto" : "none"}
          style={[
            styles.stickyBarWrap,
            {
              opacity: stickyProgress,
              transform: [{ translateY: stickyTranslateY }, { scale: stickyScale }],
            },
          ]}
        >
          <View style={[styles.stickyBarShell, { maxWidth: contentWidth }]}>
            <View style={[styles.stickyBar, isTablet && styles.stickyBarTablet]}>
              <View style={[styles.stickySearchRow, isMobile && styles.stickySearchRowMobile]}>
                <View
                  style={[styles.stickySearchShell, isCompact && styles.stickySearchShellCompact]}
                >
                  <Ionicons name="search-outline" size={17} color={palette.samsungBlueSoft} />
                  <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder={t("searchPlaceholder")}
                    placeholderTextColor="#8091A6"
                    style={styles.stickySearchInput}
                  />
                </View>

                <Pressable
                  style={[styles.stickyFilterButton, isMobile && styles.stickyFilterButtonMobile]}
                  onPress={() => openFilterSection("dates")}
                >
                  <Ionicons name="options-outline" size={17} color={palette.white} />
                  <Text style={styles.stickyFilterButtonText}>{t("filters")}</Text>
                </Pressable>
              </View>

              <View style={[styles.stickyQuickRow, isMobile && styles.stickyQuickRowMobile]}>
                <Pressable
                  style={[styles.stickyQuickPill, isMobile && styles.stickyQuickPillMobile]}
                  onPress={() => openFilterSection("location")}
                >
                  <Ionicons name="location-outline" size={14} color={palette.samsungBlue} />
                  <Text style={styles.stickyQuickPillText}>{activeLocationText}</Text>
                </Pressable>

                <Pressable
                  style={[styles.stickyQuickPill, isMobile && styles.stickyQuickPillMobile]}
                  onPress={() => openFilterSection("dates")}
                >
                  <Ionicons name="calendar-outline" size={14} color={palette.samsungBlue} />
                  <Text style={styles.stickyQuickPillText}>{dateSummaryText}</Text>
                </Pressable>

                {isTablet ? (
                  <Pressable
                    style={styles.stickyQuickPill}
                    onPress={() => openFilterSection("type")}
                  >
                    <Ionicons name="car-outline" size={14} color={palette.samsungBlue} />
                    <Text style={styles.stickyQuickPillText}>{activeTypeText}</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          </View>
        </Animated.View>
      }
    >
      <FlatList
        key={listColumns}
        data={filteredCars}
        style={[styles.carsList, !isTablet && styles.listMobile]}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        numColumns={listColumns}
        columnWrapperStyle={listColumns > 1 ? styles.columnWrapper : undefined}
        ListHeaderComponent={
          <View style={styles.listHeaderContent}>
            <TopNavBar
              selectedLocation={selectedLocation}
              locationOptions={locations}
              onLocationChange={(location) =>
                setSelectedLocation(location as (typeof locations)[number])
              }
              onLoginPress={handleLoginPress}
              loginLabel={user ? t("logout") : t("login")}
            />

            <View style={styles.jumbotronWrap}>
              <View style={[styles.heroPanel, isMobile && styles.heroPanelMobile]}>
                <View style={[styles.heroTopRow, isMobile && styles.heroTopRowMobile]}>
                  <View style={styles.heroLocationBlock}>
                    <Text style={styles.heroLabel}>{t("heroLocationLabel")}</Text>
                    <View style={styles.locationRow}>
                      <Ionicons name="location" size={14} color={palette.samsungBlueSoft} />
                      <Text style={styles.heroLocation}>{displayLocation}</Text>
                    </View>
                    <Text style={styles.heroMeta}>
                      {t("carsAvailableNow", { count: filteredCars.length })}
                    </Text>
                  </View>

                  {activeFilterCount > 0 ? (
                    <View style={styles.activeFilterPill}>
                      <Text style={styles.activeFilterPillText}>{activeFilterCount} active</Text>
                    </View>
                  ) : null}
                </View>

                <View style={[styles.searchRow, isMobile && styles.searchRowMobile]}>
                  <View style={styles.searchShell}>
                    <Ionicons name="search-outline" size={18} color="#6F7D90" />
                    <TextInput
                      value={search}
                      onChangeText={setSearch}
                      placeholder={t("searchPlaceholder")}
                      placeholderTextColor="#8091A6"
                      style={styles.searchInput}
                    />
                  </View>

                  <Pressable
                    style={[styles.filterButton, isMobile && styles.filterButtonMobile]}
                    onPress={openFilters}
                  >
                    <Ionicons name="options-outline" size={18} color={palette.white} />
                    <Text style={styles.filterButtonText}>{t("filters")}</Text>
                  </Pressable>
                </View>

                <View style={[styles.summaryStrip, isMobile && styles.summaryStripMobile]}>
                  <Pressable
                    style={[styles.summaryPill, isMobile && styles.summaryPillMobile]}
                    onPress={() => openFilterSection("dates")}
                  >
                    <Ionicons name="calendar-outline" size={15} color={palette.samsungBlue} />
                    <Text style={styles.summaryPillText}>{dateSummaryText}</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.summaryPill, isMobile && styles.summaryPillMobile]}
                    onPress={() => openFilterSection("location")}
                  >
                    <Ionicons name="location-outline" size={15} color={palette.samsungBlue} />
                    <Text style={styles.summaryPillText}>{activeLocationText}</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.summaryPill, isMobile && styles.summaryPillMobile]}
                    onPress={() => openFilterSection("type")}
                  >
                    <Ionicons name="car-outline" size={15} color={palette.samsungBlue} />
                    <Text style={styles.summaryPillText}>{activeTypeText}</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.resultsHeader}>
              <View>
                <Text style={styles.resultsText}>
                  {t("resultsMatching", { count: filteredCars.length })}
                </Text>
              </View>
              <Pressable onPress={clearFilters}>
                <Text style={styles.sectionLink}>See All</Text>
              </Pressable>
            </View>
          </View>
        }
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) => (
          <View style={styles.listItemWrap}>
            <CarCard
              car={item}
              onPress={() => router.push({ pathname: "/cars/[id]", params: { id: item.id } })}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{t("emptyTitle")}</Text>
            <Text style={styles.emptyBody}>{t("emptyBody")}</Text>
          </View>
        }
      />

      <Modal animationType="fade" transparent visible={isFiltersOpen} onRequestClose={closeFilters}>
        <View style={[styles.modalBackdrop, isTablet && styles.modalBackdropTablet]}>
          <Pressable style={styles.modalScrim} onPress={closeFilters} />
          <View style={[styles.modalCard, isTablet && styles.modalCardTablet]}>
            {!isTablet ? <View style={styles.modalHandle} /> : null}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTextBlock}>
                <Text style={styles.modalTitle}>{t("searchFilters")}</Text>
                <Text style={styles.modalSubtitle}>{t("searchFiltersSubtitle")}</Text>
              </View>
              <Pressable
                style={styles.modalCloseButton}
                onPress={closeFilters}
                accessibilityLabel="Close filter modal"
              >
                <Ionicons name="close" size={22} color={palette.text} />
              </Pressable>
            </View>

            {isTablet ? (
              <View style={styles.modalTabRow}>
                {filterSections.map((section) => {
                  const isActive = activeFilterSection === section;

                  return (
                    <Pressable
                      key={section}
                      style={[styles.modalTab, isActive && styles.modalTabActive]}
                      onPress={() => setActiveFilterSection(section)}
                    >
                      <Text style={[styles.modalTabText, isActive && styles.modalTabTextActive]}>
                        {filterSectionLabels[section]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {isTablet ? (
                <View style={styles.filterSectionCard}>
                  {renderFilterSection(activeFilterSection)}
                </View>
              ) : (
                filterSections.map((section) => (
                  <View key={section} style={styles.filterSectionCard}>
                    {renderFilterSection(section)}
                  </View>
                ))
              )}
            </ScrollView>

            <View style={[styles.modalFooter, isMobile && styles.modalFooterMobile]}>
              <Pressable
                style={[
                  styles.footerButton,
                  styles.footerSecondaryButton,
                  isMobile && styles.footerButtonMobile,
                ]}
                onPress={clearFilters}
              >
                <Text style={styles.footerSecondaryText}>{t("reset")}</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.footerButton,
                  styles.footerPrimaryButton,
                  isMobile && styles.footerButtonMobile,
                ]}
                onPress={closeFilters}
              >
                <Text style={styles.footerPrimaryText}>
                  {t("showCars", { count: filteredCars.length })}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  shellContent: {
    flex: 1,
  },
  carsList: {
    flex: 1,
  },
  listHeaderContent: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
  stickyBarWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: spacing.xs,
  },
  stickyBarShell: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: spacing.md,
  },
  stickyBar: {
    backgroundColor: "rgba(255, 253, 248, 0.97)",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(22, 33, 62, 0.08)",
    padding: spacing.sm,
    gap: spacing.sm,
    ...shadows.card,
  },
  stickyBarTablet: {
    gap: spacing.xs,
  },
  stickySearchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  stickySearchRowMobile: {
    flexWrap: "wrap",
  },
  stickySearchShell: {
    flex: 1,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: palette.white,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: "rgba(22, 33, 62, 0.08)",
    paddingHorizontal: spacing.md,
  },
  stickySearchShellCompact: {
    minWidth: "100%",
  },
  stickySearchInput: {
    flex: 1,
    color: palette.text,
    fontSize: 14,
    paddingVertical: 0,
  },
  stickyFilterButton: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: radius.control,
    backgroundColor: palette.samsungBlue,
    paddingHorizontal: spacing.md,
  },
  stickyFilterButtonMobile: {
    width: "100%",
  },
  stickyFilterButtonText: {
    color: palette.white,
    fontSize: 13,
    fontWeight: "800",
  },
  stickyQuickRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  stickyQuickRowMobile: {
    alignItems: "stretch",
  },
  stickyQuickPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    minHeight: 36,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: palette.samsungBlueTint,
  },
  stickyQuickPillMobile: {
    width: "100%",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  stickyQuickPillText: {
    flex: 1,
    color: palette.samsungBlue,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: spacing.xs,
  },
  jumbotronWrap: {
    marginBottom: spacing.sm,
  },
  heroPanel: {
    backgroundColor: palette.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: "rgba(22, 33, 62, 0.08)",
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.softCard,
    marginTop: 0,
    marginHorizontal: 0,
  },
  heroPanelMobile: {
    padding: spacing.md,
  },
  heroLabel: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  heroTopRowMobile: {
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  heroLocationBlock: {
    flex: 1,
    gap: spacing.xxs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  heroLocation: {
    color: palette.samsungBlue,
    fontSize: 18,
    fontWeight: "800",
    flexShrink: 1,
  },
  heroMeta: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  activeFilterPill: {
    minHeight: 32,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: palette.samsungBlueTint,
    alignItems: "center",
    justifyContent: "center",
  },
  activeFilterPillText: {
    color: palette.samsungBlue,
    fontSize: 12,
    fontWeight: "800",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  searchRowMobile: {
    flexWrap: "wrap",
  },
  summaryStrip: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  summaryStripMobile: {
    alignItems: "stretch",
    gap: spacing.sm,
  },
  summaryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  summaryPillMobile: {
    width: "100%",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  summaryPillText: {
    flex: 1,
    color: palette.samsungBlue,
    fontSize: 13,
    fontWeight: "700",
    marginLeft: spacing.xs,
  },
  searchShell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: palette.surface,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: "rgba(23, 51, 44, 0.08)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterButton: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.control,
    backgroundColor: palette.samsungBlue,
    justifyContent: "center",
  },
  filterButtonMobile: {
    width: "100%",
  },
  filterButtonText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(8, 22, 43, 0.38)",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  modalBackdropTablet: {
    justifyContent: "center",
    padding: spacing.lg,
  },
  modalScrim: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#F8FBFF",
    borderRadius: radius.sheet,
    maxHeight: "92%",
    padding: spacing.lg,
    gap: spacing.lg,
    ...shadows.card,
  },
  modalCardTablet: {
    maxWidth: 760,
    alignSelf: "center",
  },
  modalHandle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: "#CFD8E7",
  },
  modalTitle: {
    color: palette.samsungBlue,
    fontSize: 24,
    fontWeight: "800",
    flexShrink: 1,
  },
  modalSubtitle: {
    color: "#6F84A8",
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.xxs,
    maxWidth: 420,
    flexShrink: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  modalHeaderTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: palette.white,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.icon,
  },
  modalTabRow: {
    flexDirection: "row",
    gap: spacing.xs,
    backgroundColor: palette.samsungBlueTint,
    borderRadius: radius.control,
    padding: spacing.xs,
  },
  modalTab: {
    flex: 1,
    minWidth: 0,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.control,
    alignItems: "center",
  },
  modalTabActive: {
    backgroundColor: palette.samsungBlue,
  },
  modalTabText: {
    color: palette.samsungBlueSoft,
    fontSize: 13,
    fontWeight: "700",
  },
  modalTabTextActive: {
    color: palette.white,
  },
  modalScroll: {
    flexShrink: 1,
  },
  modalScrollContent: {
    gap: spacing.md,
  },
  modalSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  modalSectionTitle: {
    color: palette.samsungBlue,
    fontSize: 18,
    fontWeight: "800",
    flexShrink: 1,
  },
  modalSectionMeta: {
    color: "#6F84A8",
    fontSize: 13,
    fontWeight: "700",
    flexShrink: 1,
  },
  searchInput: {
    color: palette.text,
    fontSize: 15,
    flex: 1,
    paddingVertical: 0,
  },
  filterSectionCard: {
    backgroundColor: palette.white,
    borderRadius: radius.card,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.softCard,
  },
  filterGroup: {
    gap: spacing.md,
  },
  dateSummaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  modalDateCard: {
    flex: 1,
    minWidth: 128,
    backgroundColor: "#EEF5FF",
    borderRadius: radius.control,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  modalDateLabel: {
    color: "#6F84A8",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  modalDateValue: {
    color: palette.samsungBlue,
    fontSize: 18,
    fontWeight: "800",
    marginTop: spacing.xs,
  },
  modalTripCard: {
    flex: 1,
    minWidth: 92,
    backgroundColor: palette.samsungBlue,
    borderRadius: radius.control,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTripValue: {
    color: palette.white,
    fontSize: 22,
    fontWeight: "800",
  },
  modalTripLabel: {
    color: "#D8E1F3",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  calendarCardModal: {
    backgroundColor: palette.white,
    borderRadius: radius.card,
    padding: spacing.xs,
    overflow: "hidden",
    ...shadows.softCard,
  },
  calendar: {
    borderRadius: radius.control,
  },
  filterLabel: {
    color: palette.textMuted,
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  filterLabelOnBlue: {
    color: palette.samsungBlueTint,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  filterGroupValue: {
    color: "#D5E6FF",
    fontSize: 13,
    fontWeight: "700",
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  optionCell: {
    minWidth: 0,
  },
  optionCellMobile: {
    width: "100%",
  },
  optionCellTablet: {
    width: "48.5%",
  },
  priceOptionStack: {
    gap: spacing.sm,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  resultsText: {
    color: palette.textMuted,
    fontSize: 14,
    marginTop: spacing.xxs,
  },
  sectionLink: {
    color: palette.samsungBlue,
    fontSize: 14,
    fontWeight: "700",
  },
  filterHint: {
    color: palette.textMuted,
    fontSize: 13,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  listMobile: {
    marginHorizontal: 0,
  },
  columnWrapper: {
    gap: spacing.md,
  },
  listItemWrap: {
    flex: 1,
    minWidth: 0,
  },
  emptyState: {
    backgroundColor: palette.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.xs,
  },
  emptyTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "700",
  },
  emptyBody: {
    color: palette.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  modalFooterMobile: {
    flexWrap: "wrap",
  },
  footerButton: {
    minHeight: 52,
    borderRadius: radius.control,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  footerButtonMobile: {
    width: "100%",
  },
  footerSecondaryButton: {
    backgroundColor: palette.samsungBlueTint,
    borderWidth: 1,
    borderColor: palette.samsungBlueSoft,
  },
  footerSecondaryText: {
    color: palette.samsungBlue,
    fontSize: 14,
    fontWeight: "700",
  },
  footerPrimaryButton: {
    flex: 1,
    backgroundColor: palette.samsungBlue,
  },
  footerPrimaryText: {
    color: palette.white,
    fontSize: 15,
    fontWeight: "800",
  },
});
