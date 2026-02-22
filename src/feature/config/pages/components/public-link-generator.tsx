import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAlert } from "@/hooks/use-alert";
import { AuthStore } from "@/feature/auth/stores/auth-store";
import type { SettingsDTO } from "@/feature/config/services/settings-service";

interface Props { settings: SettingsDTO }

export const PublicLinkGenerator = ({ settings }: Props) => {
  const user = AuthStore.getState().user;
  const initialCompanyId = String(settings.company_id ?? user?.empresaId ?? "");
  const [companyId, setCompanyId] = useState<string>(initialCompanyId);

  useEffect(() => {
 

    const cidNum = Number(companyId || settings.company_id || user?.empresaId || 0);
    if (cidNum > 0) {
      if (String(cidNum) !== companyId) setCompanyId(String(cidNum));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, settings.company_id]);

  const compose = () => {
    const base = `${window.location.origin}/public/appointment`;
    const parts: string[] = [];
    if (companyId) parts.push(`company=${encodeURIComponent(companyId)}`);
    return parts.length ? `${base}?${parts.join("&")}` : base;
  };

  const { showAlert } = useAlert();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(compose());
      showAlert({ title: "Link copiado", message: "Link público copiado para a área de transferência", type: "success" });
    } catch {
      showAlert({ title: "Erro", message: "Não foi possível copiar o link", type: "error" });
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <Label>Empresa (ID)</Label>
          <Input value={companyId} onChange={(e) => setCompanyId(e.target.value)} placeholder="ID da empresa" />
        </div>    
      </div>

      <div className="flex items-center gap-2">
        <Input readOnly value={compose()} className="flex-1" />
        <Button onClick={handleCopy}>Copiar link</Button>
      </div>
    </div>
  );
};

export default PublicLinkGenerator;
