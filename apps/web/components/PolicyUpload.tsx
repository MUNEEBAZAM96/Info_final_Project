type PolicyUploadProps = {
  label: string;
};

export function PolicyUpload({ label }: PolicyUploadProps) {
  return (
    <section>
      <h2 className="text-lg font-medium">Upload policy</h2>
      <p>{label}</p>
    </section>
  );
}
