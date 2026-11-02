type FindingDetailProps = {
  title: string;
  body: string;
};

export function FindingDetail({ title, body }: FindingDetailProps) {
  return (
    <section>
      <h2 className="text-lg font-medium">{title}</h2>
      <p>{body}</p>
    </section>
  );
}
