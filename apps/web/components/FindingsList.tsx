type FindingsListProps = {
  title: string;
  emptyText: string;
};

export function FindingsList({ title, emptyText }: FindingsListProps) {
  return (
    <section>
      <h2 className="text-lg font-medium">{title}</h2>
      <p>{emptyText}</p>
    </section>
  );
}
