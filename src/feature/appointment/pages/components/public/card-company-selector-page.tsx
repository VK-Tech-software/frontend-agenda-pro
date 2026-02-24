interface Props {
  companies: any[];
  onSelect: (id: string) => void;
}

export default function CompanySelector({ companies, onSelect }: Props) {
  return (
    <div>
      <h3 className="text-base font-semibold mb-3">Escolha a empresa</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {companies.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(String(c.id))}
            className="p-5 rounded-2xl border text-left transition hover:shadow-md hover:border-teal-500"
          >
            <div className="font-semibold text-lg">{c.name}</div>
            <div className="text-sm text-muted-foreground">
              Clique para agendar
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}