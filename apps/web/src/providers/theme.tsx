import { useMemo } from 'react';

import { MantineProvider, MantineTheme } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import { createDynamicTheme } from '@/theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dynamicTheme: MantineTheme = useMemo(() => {
    return createDynamicTheme({
      primaryColor: 'indigo',
      borderRadius: 'md',
      compact: false,
    });
  }, []);

  return (
    <MantineProvider theme={dynamicTheme} defaultColorScheme="dark">
      <DatesProvider
        settings={{
          firstDayOfWeek: 0,
          weekendDays: [0],
        }}
      >
        <Notifications position="bottom-right" zIndex={1000} />
        <ModalsProvider>{children}</ModalsProvider>
      </DatesProvider>
    </MantineProvider>
  );
}
