import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, ShieldCheck } from "lucide-react";
import type { EmpresaDTO } from "@/feature/empresa/services/empresa-service";

type EmpresaFormData = Omit<EmpresaDTO, "userId">;

type EmpresaFormCardProps = {
  formData: EmpresaFormData;
  loading: boolean;
  documentError: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof EmpresaFormData, value: string) => void;
};

export const EmpresaFormCard = ({
  formData,
  loading,
  documentError,
  onSubmit,
  onChange,
}: EmpresaFormCardProps) => {
  return (
    <Card className="w-full max-w-md border-slate-200/80 shadow-xl shadow-slate-200/60">
      <CardContent className="p-8">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-2 text-xl font-semibold">
              <div className="bg-primary p-2 rounded-lg text-primary-foreground">
                <Calendar className="h-4 w-4" />
              </div>
              AgendaPro
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600">
              <ShieldCheck className="h-3 w-3" />
              Seguro
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">Crie sua conta</h2>
          <p className="text-sm text-muted-foreground">Comece sua conta agora</p>
        </header>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label>Nome da empresa</Label>
            <Input
              placeholder="Salão Beleza Total"
              className="h-11"
              value={formData.name}
              onChange={(event) => onChange("name", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>CPF / CNPJ</Label>
            <Input
              placeholder="Somente números"
              className="h-11"
              value={formData.cnpj}
              onChange={(event) => onChange("cnpj", event.target.value)}
            />
            {documentError && (
              <p className="text-sm text-destructive">{documentError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Endereço</Label>
            <Input
              placeholder="Rua das Flores, 123"
              className="h-11"
              value={formData.address}
              onChange={(event) => onChange("address", event.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Input
                placeholder="São Paulo"
                className="h-11"
                value={formData.city}
                onChange={(event) => onChange("city", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Input
                placeholder="SP"
                className="h-11"
                value={formData.state}
                onChange={(event) => onChange("state", event.target.value)}
              />
            </div>
          </div>

          <Button className="w-full h-11 bg-emerald-500 hover:bg-emerald-600" disabled={loading}>
            {loading ? "Criando..." : "Criar conta"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Ao criar uma conta, você concorda com nossos{" "}
          <span className="underline cursor-pointer">Termos de Uso</span> e{" "}
          <span className="underline cursor-pointer">Política de Privacidade</span>.
        </p>
      </CardContent>
    </Card>
  );
};
