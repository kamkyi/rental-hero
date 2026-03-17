import { PropsWithChildren, ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import { palette, spacing } from '@/constants/theme';

type AppShellProps = PropsWithChildren<{
  header?: ReactNode;
  scrollable?: boolean;
}>

export function AppShell({ children, header, scrollable = true }: AppShellProps) {
  const { contentWidth } = useResponsive();

  const content = (
    <View style={[styles.inner, { maxWidth: contentWidth }]}>
      {header}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {scrollable ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  inner: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
});