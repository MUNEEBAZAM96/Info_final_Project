type ScanPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ScanPage({ params }: ScanPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-6 py-12">
      <h1 className="text-3xl font-semibold">CloudGuard</h1>
      <p>Scan results will appear here</p>
      <p>{id}</p>
    </main>
  );
}
