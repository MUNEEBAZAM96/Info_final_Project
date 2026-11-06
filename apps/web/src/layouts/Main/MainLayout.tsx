'use client';

import { ReactNode, useEffect, useState } from 'react';

import {
  ActionIcon,
  Affix,
  Box,
  Container,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

import SystemNotificationBanner from '@/components/system-notification-banner';

import FooterNav from './components/Footer';
import HeaderNav from './components/Header';
import SidebarNav from './components/Sidebar';
import layoutClasses from './MainLayout.module.css';

type Props = {
  children: ReactNode;
};

const SIDEBAR_WIDTH = 280;
const HEADER_HEIGHT = 72;
const SIDEBAR_STORAGE_KEY = 'cloudguard-sidebar';

export function MainLayout({ children }: Props) {
  const theme = useMantineTheme();
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const mobile_match = useMediaQuery('(max-width: 768px)');
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] =
    useDisclosure();
  const [desktopOpen, setDesktopOpen] = useState(true);

  useEffect(() => {
    if (window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'hidden') {
      setDesktopOpen(false);
    }
  }, []);

  const headerVariant: 'default' | 'colored' | 'gradient' | 'glassmorphism' =
    'default';
  const headerPosition: 'fixed' | 'sticky' | 'static' = 'fixed';
  const sidebarVariant: 'default' | 'colored' | 'gradient' | 'glassmorphism' =
    'default';
  const sidebarPosition: 'left' | 'right' = 'left';
  const sidebarPositionValue = sidebarPosition as 'left' | 'right';
  const sidebarOverlay = false;
  const sidebarVisible = mobile_match ? mobileOpened : desktopOpen;
  const contentLayout = 'full-width';
  const contentPadding = 'comfortable';
  const showShadow = true;

  // Generate dynamic styles based on static layout config
  const sidebarStyles = {
    '--sidebar-width': `${SIDEBAR_WIDTH}px`,
  } as React.CSSProperties;

  const headerStyles = {
    '--header-height': `${HEADER_HEIGHT}px`,
  } as React.CSSProperties;

  const contentStyles = {
    '--content-padding': contentPadding,
  } as React.CSSProperties;

  // Determine if sidebar should overlay (mobile or overlay setting enabled)
  const shouldOverlay = mobile_match || sidebarOverlay;

  // Calculate main content margin based on sidebar
  const getMainMargin = () => {
    const width = !shouldOverlay && sidebarVisible ? SIDEBAR_WIDTH : 0;
    return sidebarPositionValue === 'right'
      ? { marginRight: width }
      : { marginLeft: width };
  };

  // Determine if sidebar should be visible
  const isSidebarVisible = () => {
    if (!sidebarVisible) return false;
    if (mobile_match) return mobileOpened;
    return true;
  };

  // Show overlay backdrop when sidebar overlays content
  const showOverlay = shouldOverlay && isSidebarVisible() && !mobile_match;

  const handleSidebarToggle = () => {
    if (mobile_match) {
      toggleMobile();
      return;
    }
    setDesktopOpen((open) => {
      const next = !open;
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? 'open' : 'hidden');
      return next;
    });
  };

  const handleSidebarClose = () => {
    if (mobile_match) {
      closeMobile();
    }
  };

  return (
    <Box className={layoutClasses.layoutRoot}>
      {/* Overlay backdrop */}
      {showOverlay && (
        <Box className={layoutClasses.overlay} onClick={handleSidebarClose} />
      )}

      {/* Mobile Overlay */}
      {mobile_match && mobileOpened && (
        <Box className={layoutClasses.overlay} onClick={closeMobile} />
      )}

      {/* Header */}
      <Box
        className={layoutClasses.header}
        data-variant={headerVariant}
        data-position={headerPosition}
        style={{
          ...headerStyles,
          ...getMainMargin(),
          height: HEADER_HEIGHT,
          boxShadow: showShadow
            ? tablet_match
              ? theme.shadows.md
              : theme.shadows.sm
            : 'none',
        }}
      >
        <Container fluid px="lg" h="100%" style={{ display: 'flex', alignItems: 'center' }}>
          <HeaderNav
            toggleMobile={toggleMobile}
            sidebarVisible={sidebarVisible}
            onSidebarToggle={handleSidebarToggle}
            onSidebarShow={() => {}}
            headerVariant={headerVariant}
          />
        </Container>
      </Box>

      {/* Sidebar */}
      <Box
          className={layoutClasses.sidebar}
          data-variant={sidebarVariant}
          data-position={sidebarPosition}
          data-overlay={shouldOverlay}
          style={{
            ...sidebarStyles,
            width: SIDEBAR_WIDTH,
            [sidebarPosition]: 0,
            zIndex: shouldOverlay ? 102 : 101,
            direction: sidebarPosition === 'left' ? 'ltr' : 'rtl',
            pointerEvents: sidebarVisible ? 'auto' : 'none',
            transform: sidebarVisible
              ? 'translateX(0)'
              : `translateX(${sidebarPositionValue === 'right' ? '100%' : '-100%'})`,
          }}
        >
          <SidebarNav
            onClose={handleSidebarClose}
            showCloseButton={sidebarOverlay || mobile_match}
          />
        </Box>

      {/* Main Content */}
      <Box
        className={layoutClasses.main}
        data-sidebar-position={sidebarPosition}
        data-header-position={headerPosition}
        data-overlay={shouldOverlay}
        style={{
          ...getMainMargin(),
          paddingTop: headerPosition === 'fixed' ? HEADER_HEIGHT : 0,
          minHeight: `calc(100vh - ${rem(60)})`, // Account for footer
        }}
      >
        <Box
          className={layoutClasses.content}
          data-layout={contentLayout}
          data-padding={contentPadding}
          style={contentStyles}
        >
          {/* System Notification Banner */}
          <SystemNotificationBanner layout="main" mb="md" />
          {children}
        </Box>
      </Box>

      {/* Footer */}
      <Box
        className={layoutClasses.footer}
        data-position={sidebarPosition}
        style={{ ...getMainMargin() }}
      >
        <Container fluid px="lg">
          <FooterNav />
        </Container>
      </Box>
    </Box>
  );
}
