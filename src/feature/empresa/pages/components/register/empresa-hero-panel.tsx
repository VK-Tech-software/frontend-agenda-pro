import { Sparkles } from "lucide-react";

export const EmpresaHeroPanel = () => {
  return (
    <aside className="hidden lg:flex flex-col justify-center bg-slate-950 text-white px-16">
      <div className="max-w-md">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
          <Sparkles className="h-6 w-6" />
        </div>

        <h1 className="text-3xl font-bold mb-4">
          Comece a transformar seu negócio hoje
        </h1>

        <p className="text-slate-300 leading-relaxed">
          Junte-se a milhares de empresas que já usam o AgendaPro para
          simplificar sua gestão de agendamentos e estoque.
        </p>

        <ul className="mt-8 space-y-3 text-sm">
          <li>✔ Suporte em português</li>
          <li>✔ Cancele quando quiser</li>
          <li>✔ Migração assistida</li>
        </ul>
      </div>
    </aside>
  );
};
