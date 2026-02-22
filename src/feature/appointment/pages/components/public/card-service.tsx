import React from "react";

interface ServiceItem {
  id: number;
  service_name?: string | null;
  price?: number | null;
  duration?: number | null;
}

interface Props {
  services: ServiceItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export const CardService: React.FC<Props> = ({ services, selectedId, onSelect }) => {
  return (
    <div className="w-full rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Serviços</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => {
          const label = s.service_name ?? (s as any).name ?? String(s.id);
          const isSelected = String(s.id) === String(selectedId);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(String(s.id))}
              className={`flex flex-col items-start gap-2 p-4 rounded-lg border transition-shadow hover:shadow-md w-full text-left ${isSelected ? "ring-2 ring-teal-500 bg-teal-50" : "bg-white"}`}>
              <div className="flex items-center justify-between w-full">
                <div className="font-medium text-sm">{label}</div>
                {s.price ? <div className="text-sm font-semibold text-teal-600">R$ {s.price}</div> : null}
              </div>
              <div className="flex items-center gap-3 w-full">
                {s.duration ? <div className="text-xs text-muted-foreground">{s.duration} min</div> : <div className="text-xs text-muted-foreground">Duração não informada</div>}
                {isSelected ? <div className="ml-auto text-xs text-teal-600 font-semibold">Selecionado</div> : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CardService;
