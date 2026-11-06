import Link from "next/link";

import { Button, Stack, Text } from "@mantine/core";

import { CloudGuardScan } from "@/cloudguard/ReviewScreens";
import { getSample } from "@/cloudguard/fixtures";
import { MainLayout } from "@/layouts/Main";

export default async function ScanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sample = getSample(id);

  return (
    <MainLayout>
      {sample ? (
        <CloudGuardScan sampleId={sample.id} />
      ) : (
        <Stack>
          <Text>No sample matches this id.</Text>
          <Button component={Link} href="/" w="fit-content">
            Back to dashboard
          </Button>
        </Stack>
      )}
    </MainLayout>
  );
}
