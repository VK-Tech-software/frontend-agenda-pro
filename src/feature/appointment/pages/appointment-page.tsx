import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useAppointmentStore } from "../stores/appointment-store";
import { useAlert } from "@/hooks/use-alert";

const appointmentSchema = z.object({
  professionalId: z.number().int().min(1),
  clientId: z.number().int().min(1),
  serviceId: z.number().int().min(1),
  startAt: z.string(),
  durationMinutes: z.number().int().min(1),
  notes: z.string().optional().or(z.literal("")),
});

type AppointmentForm = z.infer<typeof appointmentSchema>;

export const AppointmentPage = () => {
  const { appointments, loading, fetchByCompany, createAppointment, updateAppointment, deleteAppointment } = useAppointmentStore();
  const { showAlert } = useAlert();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const form = useForm<AppointmentForm>({ resolver: zodResolver(appointmentSchema), defaultValues: { professionalId: 0, clientId: 0, serviceId: 0, startAt: new Date().toISOString(), durationMinutes: 30, notes: "" } });

  useEffect(() => { fetchByCompany(1); }, [fetchByCompany]);

  const onSubmit = async (data: AppointmentForm) => {
    try {
      if (editingId) {
        await updateAppointment(editingId, { ...data, companyId: 1 });
        showAlert({ title: "Sucesso", message: "Agendamento atualizado", type: "success" });
      } else {
        await createAppointment({ ...data, companyId: 1 });
        showAlert({ title: "Sucesso", message: "Agendamento criado", type: "success" });
      }
      setIsOpen(false);
      setEditingId(null);
      form.reset();
    } catch (err) {
      showAlert({ title: "Erro", message: "Falha ao salvar agendamento", type: "destructive" });
    }
  };

  const handleEdit = (a: any) => { setEditingId(a.id); form.setValue("professionalId", a.professionalId); form.setValue("clientId", a.clientId); form.setValue("serviceId", a.serviceId); form.setValue("startAt", a.startAt); form.setValue("durationMinutes", a.durationMinutes); form.setValue("notes", a.notes || ""); setIsOpen(true); };
  const handleDelete = async (id: number) => { if (!confirm("Confirmar exclusão?")) return; await deleteAppointment(id); showAlert({ title: "Sucesso", message: "Agendamento excluído", type: "success" }); };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Agendamentos</CardTitle>
            <CardDescription>Gerencie os agendamentos</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={() => { setIsOpen(!isOpen); if (!isOpen) form.reset(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2"/>Novo Agendamento</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Agendamento" : "Novo Agendamento"}</DialogTitle>
                <DialogDescription>Preencha os dados</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField name="professionalId" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profissional (ID)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <FormField name="clientId" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente (ID)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <FormField name="serviceId" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serviço (ID)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <FormField name="startAt" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data e hora</FormLabel>
                      <FormControl><Input type="datetime-local" {...field} /></FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <FormField name="durationMinutes" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração (min)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <FormField name="notes" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações (opcional)</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                    <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin mr-2"/> : null}{editingId ? "Atualizar" : "Criar"}</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (<div className="text-center py-8">Nenhum agendamento</div>) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.professionalId}</TableCell>
                    <TableCell>{a.clientId}</TableCell>
                    <TableCell>{a.serviceId}</TableCell>
                    <TableCell>{new Date(a.startAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(a)}><Pencil className="h-4 w-4"/></Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(a.id!)}><Trash2 className="h-4 w-4"/></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
