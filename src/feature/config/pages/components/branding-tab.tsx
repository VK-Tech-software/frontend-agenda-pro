import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { SettingsDTO } from "@/feature/config/services/settings-service";

interface BrandingTabProps {
  settings: SettingsDTO;
  onChange: (patch: Partial<SettingsDTO>) => void;
}

export const BrandingTab = ({ settings, onChange }: BrandingTabProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Personalização</CardTitle>
      <CardDescription>Cores, marca e domínio</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Cor primária</Label>
          <Input
            type="color"
            value={settings.primary_color || "#0ea5e9"}
            onChange={(e) => onChange({ primary_color: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Cor secundária</Label>
          <Input
            type="color"
            value={settings.secondary_color || "#38bdf8"}
            onChange={(e) => onChange({ secondary_color: e.target.value })}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Domínio personalizado</Label>
          <Input
            placeholder="agenda.suaempresa.com"
            value={settings.custom_domain ?? ""}
            onChange={(e) => onChange({ custom_domain: e.target.value })}
          />
        </div>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Marca branca</p>
          <p className="text-xs text-muted-foreground">Remova a marca AgendaPro</p>
        </div>
        <Button variant="outline">Ativar</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Nome do remetente</Label>
          <Input
            placeholder="AgendaPro"
            value={settings.email_from_name ?? ""}
            onChange={(e) => onChange({ email_from_name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Email do remetente</Label>
          <Input
            placeholder="contato@suaempresa.com"
            value={settings.email_from_address ?? ""}
            onChange={(e) => onChange({ email_from_address: e.target.value })}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Favicon URL</Label>
          <Input
            placeholder="https://.../favicon.ico"
            value={settings.favicon_url ?? ""}
            onChange={(e) => onChange({ favicon_url: e.target.value })}
          />
        </div>
      </div>
    </CardContent>
  </Card>
);
