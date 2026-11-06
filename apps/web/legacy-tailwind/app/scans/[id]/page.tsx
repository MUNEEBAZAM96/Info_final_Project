import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "../../../components/AppHeader";
import { ScanReview } from "../../../components/ScanReview";
import { getSample } from "../../../lib/fixtures";

type ScanPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ScanPage({ params }: ScanPageProps) {
  const { id } = await params;
  const sample = getSample(id);

  if (!sample) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <AppHeader />
        <p className="text-sm text-slate-300">No sample matches this id.</p>
        <Button
          variant="link"
          nativeButton={false}
          render={<Link href="/" />}
          className="h-auto w-fit px-0 text-sm text-slate-300 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
        >
          Back to dashboard
        </Button>
      </main>
    );
  }

  return <ScanReview sample={sample} />;
}
