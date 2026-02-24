interface Props {
  company: string | undefined;
  service: string | undefined;
  date: string;
  time: string;
  price?: number;
}

export default function SummaryCard({
  company,
  service,
  date,
  time,
  price
}: Props) {
  return (
    <div className="lg:sticky lg:top-10">
      <div className="rounded-2xl shadow-md border p-6 bg-white space-y-4">
        <h3 className="font-semibold text-lg">Resumo</h3>

        <div>
          <div className="text-muted-foreground text-sm">Empresa</div>
          <div className="font-medium">{company ?? "—"}</div>
        </div>

        <div>
          <div className="text-muted-foreground text-sm">Serviço</div>
          <div className="font-medium">{service ?? "—"}</div>
        </div>

        <div>
          <div className="text-muted-foreground text-sm">Data</div>
          <div className="font-medium">{date || "—"}</div>
        </div>

        <div>
          <div className="text-muted-foreground text-sm">Horário</div>
          <div className="font-medium">{time || "—"}</div>
        </div>

        {price && (
          <div className="pt-4 border-t flex justify-between">
            <span>Total</span>
            <span className="text-xl font-semibold text-teal-600">
              R$ {price}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}