import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const appointmentSchema = z.object({
  professionalId: z.coerce.number().int().min(1),
  clientId: z.coerce.number().int().min(1),
  serviceId: z.coerce.number().int().min(1),
  date: z.string().min(1, "Informe a data"),
  startTime: z.string().min(1, "Informe a hora de início"),
  endTime: z.string().min(1, "Informe a hora de término"),
  notes: z.string().optional().or(z.literal("")),
}).superRefine((values, ctx) => {
  const [sh, sm] = values.startTime.split(":").map(Number);
  const [eh, em] = values.endTime.split(":").map(Number);
  const start = sh * 60 + sm;
  const end = eh * 60 + em;
  if (Number.isFinite(start) && Number.isFinite(end) && end <= start) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["endTime"],
      message: "Hora final deve ser maior que a inicial",
    });
  }
});

export type AppointmentFormValues = z.output<typeof appointmentSchema>;
type AppointmentFormInput = z.input<typeof appointmentSchema>;

interface OptionItem {
  value: number;
  label: string;
}

interface AppointmentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  initialValues?: Partial<AppointmentFormValues>;
  professionals: OptionItem[];
  clients: OptionItem[];
  services: OptionItem[];
  loading?: boolean;
  onSubmit: (data: AppointmentFormValues) => void | Promise<void>;
  onCancelAppointment?: () => void | Promise<void>;
}

const defaultValues: AppointmentFormValues = {
  professionalId: 0,
  clientId: 0,
  serviceId: 0,
  date: "",
  startTime: "",
  endTime: "",
  notes: "",
};

export function AppointmentFormModal({
  open,
  onOpenChange,
  title,
  description,
  initialValues,
  professionals,
  clients,
  services,
  loading,
  onSubmit,
  onCancelAppointment,
}: AppointmentFormModalProps) {
  const form = useForm<AppointmentFormInput, unknown, AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset({ ...defaultValues, ...initialValues });
  }, [form, initialValues]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="professionalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profissional</FormLabel>
                  <FormControl>
                    <select
                      className="border-input bg-transparent h-9 w-full rounded-md border px-3 text-sm"
                      value={field.value ? String(field.value) : ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={professionals.length === 0}
                    >
                      <option value="" disabled>Selecione um profissional</option>
                      {professionals.map((p) => (
                        <option key={p.value} value={String(p.value)}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  {professionals.length === 0 ? (
                    <div className="text-xs text-muted-foreground">Nenhum profissional disponível</div>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <select
                      className="border-input bg-transparent h-9 w-full rounded-md border px-3 text-sm"
                      value={field.value ? String(field.value) : ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={clients.length === 0}
                    >
                      <option value="" disabled>Selecione um cliente</option>
                      {clients.map((c) => (
                        <option key={c.value} value={String(c.value)}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  {clients.length === 0 ? (
                    <div className="text-xs text-muted-foreground">Nenhum cliente disponível</div>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serviço</FormLabel>
                  <FormControl>
                    <select
                      className="border-input bg-transparent h-9 w-full rounded-md border px-3 text-sm"
                      value={field.value ? String(field.value) : ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={services.length === 0}
                    >
                      <option value="" disabled>Selecione um serviço</option>
                      {services.map((s) => (
                        <option key={s.value} value={String(s.value)}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  {services.length === 0 ? (
                    <div className="text-xs text-muted-foreground">Nenhum serviço disponível</div>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Início</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fim</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Opcional" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              {onCancelAppointment ? (
                <Button type="button" variant="destructive" onClick={() => onCancelAppointment()}>
                  Cancelar agendamento
                </Button>
              ) : null}
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
