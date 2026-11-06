import { Group, Text } from '@mantine/core';

const FooterNav = () => {
  return (
    <Group justify="space-between">
      <Text size="xs" c="dimmed">
        Offline review of sample AWS policies
      </Text>
      <Text
        size="xs"
        c="dimmed"
        component="a"
        href="https://github.com/MUNEEBAZAM96/Info_final_Project"
        target="_blank"
      >
        &copy;&nbsp;{new Date().getFullYear()}&nbsp;CloudGuard
      </Text>
    </Group>
  );
};

export default FooterNav;
