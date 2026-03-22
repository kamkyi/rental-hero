import { useWindowDimensions } from "react-native";

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 390;
  const isMobile = width < 768;
  const isTablet = width >= 768;
  const isDesktop = width >= 1100;
  const contentWidth = Math.min(width - 24, 1180);
  const listColumns = isDesktop ? 3 : isTablet ? 2 : 1;

  return {
    width,
    height,
    isCompact,
    isMobile,
    isTablet,
    isDesktop,
    contentWidth,
    listColumns,
  };
}
