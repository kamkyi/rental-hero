import { useWindowDimensions } from 'react-native';

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1100;
  const contentWidth = Math.min(width - 24, 1180);
  const listColumns = isDesktop ? 3 : isTablet ? 2 : 1;

  return {
    width,
    height,
    isTablet,
    isDesktop,
    contentWidth,
    listColumns,
  };
}