import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { SettingsDTO } from "@/feature/config/services/settings-service";

interface AgendaTabProps {
  settings: SettingsDTO;
  onChange: (patch: Partial<SettingsDTO>) => void;
}

const weekDays = [
  { value: "1", label: "Seg" },
  { value: "2", label: "Ter" },
  { value: "3", label: "Qua" },
  { value: "4", label: "Qui" },
  { value: "5", label: "Sex" },
  { value: "6", label: "Sáb" },
  { value: "7", label: "Dom" },
];

export const AgendaTab = ({ settings, onChange }: AgendaTabProps) => {
  const selectedDays = (settings.public_working_days || "").split(",").map((d) => d.trim()).filter(Boolean);
  const toggleDay = (day: string) => {
    const next = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    onChange({ public_working_days: next.join(",") });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências da agenda</CardTitle>
        <CardDescription>Defina horários públicos e regras padrão</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Horário de abertura (público)</Label>
            <Input
              type="time"
              value={settings.public_start_time ?? ""}
              onChange={(e) => onChange({ public_start_time: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Horário de fechamento (público)</Label>
            <Input
              type="time"
              value={settings.public_end_time ?? ""}
              onChange={(e) => onChange({ public_end_time: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Duração do slot (min)</Label>
            <Input
              type="number"
              placeholder="30"
              value={settings.public_slot_minutes ?? ""}
              onChange={(e) => onChange({ public_slot_minutes: Number(e.target.value) || null })}
            />
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>Dias disponíveis (público)</Label>
          <div className="flex flex-wrap gap-2">
            {weekDays.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={`px-3 py-1 rounded-full border text-sm ${selectedDays.includes(day.value) ? "bg-primary text-primary-foreground" : "bg-background"}`}
              >
                {day.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Define os dias em que o cliente pode solicitar.</p>
        </div>
      </CardContent>
    </Card>
  );
};
