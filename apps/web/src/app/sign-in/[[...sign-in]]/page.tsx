import { SignIn } from "@clerk/nextjs";
import { Box, Stack, Text } from "@mantine/core";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <Box
      mih="100vh"
      px="md"
      py={48}
      style={{ display: "flex", justifyContent: "center", alignItems: "safe center" }}
    >
      <Stack align="center" gap="lg">
        <Stack gap={4} align="center">
          <Text fw={650} size="xl">
            CloudGuard
          </Text>
          <Text c="dimmed" size="sm">
            Sign in to review sample policies.
          </Text>
        </Stack>
        <Suspense>
          <SignIn path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/" />
        </Suspense>
      </Stack>
    </Box>
  );
}
