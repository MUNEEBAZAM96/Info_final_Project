'use client';

import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { ActionIcon, Badge, Button, Group, Text, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand, IconMenu2 } from '@tabler/icons-react';

type HeaderNavProps = {
  toggleMobile?: () => void;
  sidebarVisible: boolean;
  onSidebarToggle: () => void;
  onSidebarShow?: () => void;
  headerVariant: 'default' | 'colored' | 'gradient' | 'glassmorphism';
};

const HeaderNav = ({
  toggleMobile,
  sidebarVisible,
  onSidebarToggle,
}: HeaderNavProps) => {
  const mobile = useMediaQuery('(max-width: 768px)');
  const label = sidebarVisible ? 'Hide sidebar' : 'Show sidebar';

  return (
    <Group justify="space-between" wrap="nowrap" h={40}>
      <Group gap="sm" wrap="nowrap">
        <Tooltip label={label}>
          <ActionIcon
            onClick={() => (mobile ? toggleMobile?.() : onSidebarToggle())}
            variant="default"
            size="lg"
            aria-label={label}
            aria-expanded={sidebarVisible}
          >
            {mobile ? (
              <IconMenu2 size={18} />
            ) : sidebarVisible ? (
              <IconLayoutSidebarLeftCollapse size={18} />
            ) : (
              <IconLayoutSidebarLeftExpand size={18} />
            )}
          </ActionIcon>
        </Tooltip>
        <div>
          <Text fw={700} lh={1.15}>
            CloudGuard
          </Text>
          <Text size="xs" c="dimmed" lh={1.2}>
            Offline demo
          </Text>
        </div>
      </Group>
      <Group gap="sm" wrap="nowrap">
        <Show when="signed-out">
          <SignInButton mode="redirect">
            <Button variant="default" size="compact-sm">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="redirect">
            <Button size="compact-sm">Sign up</Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
        <Badge variant="light" color="indigo" radius="sm" visibleFrom="sm">
          Local fixtures
        </Badge>
      </Group>
    </Group>
  );
};

export default HeaderNav;
