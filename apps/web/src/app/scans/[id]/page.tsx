import Link from "next/link";

export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { Button, Stack, Text } from "@mantine/core";

import { getApiSample } from "@/cloudguard/api";
import { CloudGuardScan } from "@/cloudguard/ReviewScreens";
import { MainLayout } from "@/layouts/Main";

export default async function ScanPage({ params }: { params: Promise<{ id: string }> }) {
  await auth.protect();

  const { id } = await params;
  let sample = null;
  let unavailable = false;

  try {
    sample = await getApiSample(id);
  } catch {
    unavailable = true;
  }

  return (
    <MainLayout>
      {sample ? (
        <CloudGuardScan sample={sample} />
      ) : (
        <Stack>
          <Text>{unavailable ? "The analysis API is not running." : "No sample matches this id."}</Text>
          <Button component={Link} href="/" w="fit-content">
            Back to dashboard
          </Button>
        </Stack>
      )}
    </MainLayout>
  );
}
