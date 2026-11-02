type SampleSelectorProps = {
  label: string;
};

export function SampleSelector({ label }: SampleSelectorProps) {
  return (
    <section>
      <h2 className="text-lg font-medium">Sample policies</h2>
      <p>{label}</p>
    </section>
  );
}
