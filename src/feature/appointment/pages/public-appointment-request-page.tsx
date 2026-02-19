import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppointmentRequestService } from "../services/appointment-request-service";
import { PublicAvailabilityService, type PublicCompanyInfo, type PublicCompanyItem } from "../services/public-availability-service";

export const PublicAppointmentRequestPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [companyInfo, setCompanyInfo] = useState<PublicCompanyInfo | null>(null);
  const [companies, setCompanies] = useState<PublicCompanyItem[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [form, setForm] = useState({
    companyId: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });

  const onChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const loadCompany = async (id: number) => {
    try {
      const info = await PublicAvailabilityService.getCompanyInfo(id);
      setCompanyInfo(info);
    } catch {
      setCompanyInfo(null);
    }
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const list = await PublicAvailabilityService.listCompanies();
        setCompanies(list);
      } catch {
        setCompanies([]);
      }
    };
    fetchCompanies();
  }, []);

  const loadSlots = async (id: number, date: string) => {
    setSlotsLoading(true);
    try {
      const slots = await PublicAvailabilityService.getAvailableSlots(id, date);
      setAvailableSlots(slots);
    } catch {
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await AppointmentRequestService.createPublic({
        companyId: Number(form.companyId),
        clientName: form.clientName,
        clientEmail: form.clientEmail || undefined,
        clientPhone: form.clientPhone || undefined,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime,
        notes: form.notes || undefined,
      });
      setMessage("Solicitação enviada com sucesso.");
      setForm({
        companyId: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        preferredDate: "",
        preferredTime: "",
        notes: "",
      });
      setAvailableSlots([]);
      setCompanyInfo(null);
    } catch {
      setMessage("Não foi possível enviar sua solicitação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Solicitar agendamento</CardTitle>
          <CardDescription>Preencha os dados para solicitar um horário</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Empresa</Label>
              <select
                className="border-input bg-transparent h-9 w-full rounded-md border px-3 text-sm"
                value={form.companyId}
                onChange={(e) => {
                  const value = e.target.value;
                  onChange("companyId", value);
                  const id = Number(value);
                  if (id) {
                    loadCompany(id);
                    if (form.preferredDate) {
                      loadSlots(id, form.preferredDate);
                    }
                  } else {
                    setCompanyInfo(null);
                    setAvailableSlots([]);
                  }
                }}
              >
                <option value="">Selecione uma empresa</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={form.clientName}
                onChange={(e) => onChange("clientName", e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.clientEmail}
                onChange={(e) => onChange("clientEmail", e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                required
                value={form.clientPhone}
                onChange={(e) => onChange("clientPhone", e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={form.preferredDate}
                  onChange={(e) => {
                    const value = e.target.value;
                    onChange("preferredDate", value);
                    const id = Number(form.companyId);
                    if (id && value) {
                      loadSlots(id, value);
                    } else {
                      setAvailableSlots([]);
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Hora</Label>
                <select
                  className="border-input bg-transparent h-9 w-full rounded-md border px-3 text-sm"
                  value={form.preferredTime}
                  onChange={(e) => onChange("preferredTime", e.target.value)}
                  disabled={slotsLoading || availableSlots.length === 0}
                >
                  <option value="" disabled>
                    {slotsLoading ? "Carregando horários..." : "Selecione um horário"}
                  </option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {!slotsLoading && form.preferredDate && availableSlots.length === 0 ? (
                  <div className="text-xs text-muted-foreground">Sem horários disponíveis para esta data.</div>
                ) : null}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Input
                value={form.notes}
                onChange={(e) => onChange("notes", e.target.value)}
                placeholder="Opcional"
              />
            </div>
            {message ? (
              <div className="text-sm text-muted-foreground">{message}</div>
            ) : null}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar solicitação"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
