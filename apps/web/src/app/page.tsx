import { auth } from "@clerk/nextjs/server";

import { CloudGuardHome } from "@/cloudguard/ReviewScreens";
import { MainLayout } from "@/layouts/Main";

export default async function Page() {
  await auth.protect();

  return (
    <MainLayout>
      <CloudGuardHome />
    </MainLayout>
  );
}
