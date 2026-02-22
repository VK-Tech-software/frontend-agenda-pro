import React from "react";

interface ProfessionalItem {
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    title?: string | null;
}

interface Props {
    professionals: ProfessionalItem[];
    selectedId?: string;
    onSelect: (id: string) => void;
}

export const CardProfissionals: React.FC<Props> = ({ professionals, selectedId, onSelect }) => {
    return (
        <div className="w-full rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Profissionais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {professionals.map((p) => {
                    const isSelected = String(p.id) === String(selectedId);
                    return (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => onSelect(String(p.id))}
                            className={`flex flex-col items-start gap-3 p-4 rounded-lg border transition-shadow hover:shadow-md w-full text-left ${isSelected ? "ring-2 ring-teal-500 bg-teal-50" : "bg-white"}`}>
                            <div className="flex items-center w-full gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-sm font-medium text-slate-700">{p.name.split(" ").slice(0,2).map(n=>n[0]).join("")}</div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium text-sm">{p.name}</div>
                                        {isSelected ? <div className="text-xs text-teal-600 font-semibold">Selecionado</div> : null}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{p.title ?? p.phone ?? p.email ?? "—"}</div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CardProfissionals;