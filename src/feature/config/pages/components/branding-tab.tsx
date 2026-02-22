import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    </CardContent>
  </Card>
);
