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
import { useClientStore } from "../stores/client-store";
import { useAlert } from "@/hooks/use-alert";

const clientSchema = z.object({
  name: z.string().min(3, "Nome inválido"),
  email: z.string().email("E-mail inválido"),
  cnpjcpf: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  password: z.string().min(6).optional(),
});

type ClientForm = z.infer<typeof clientSchema>;

export const ClientPage = () => {
  const { clients, loading, fetchAll, createClient, updateClient, deleteClient } = useClientStore();
  const { showAlert } = useAlert();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const form = useForm<ClientForm>({ resolver: zodResolver(clientSchema), defaultValues: { name: "", email: "", cnpjcpf: "", phone: "", password: "" } });

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const onSubmit = async (data: ClientForm) => {
    try {
      if (editingId) {
        await updateClient(editingId, data);
        showAlert({ title: "Sucesso", message: "Cliente atualizado", type: "success" });
      } else {
        await createClient(data);
        showAlert({ title: "Sucesso", message: "Cliente criado", type: "success" });
      }
      setIsOpen(false);
      setEditingId(null);
      form.reset();
    } catch (err) {
      showAlert({ title: "Erro", message: "Falha ao salvar cliente", type: "destructive" });
    }
  };

  const handleEdit = (c: any) => { setEditingId(c.id); form.setValue("name", c.name); form.setValue("email", c.email); form.setValue("cnpjcpf", c.cnpjcpf || ""); form.setValue("phone", c.phone || ""); setIsOpen(true); };
  const handleDelete = async (id: number) => { if (!confirm("Confirmar exclusão?")) return; await deleteClient(id); showAlert({ title: "Sucesso", message: "Cliente excluído", type: "success" }); };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>Gerencie os clientes</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={() => { setIsOpen(!isOpen); if (!isOpen) form.reset(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2"/>Novo Cliente</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
                <DialogDescription>Preencha os dados</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <FormField name="email" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl><Input type="email" {...field} /></FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <FormField name="cnpjcpf" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF/CNPJ (opcional)</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <FormField name="phone" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone (opcional)</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <FormField name="password" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha (opcional)</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
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
          {clients.length === 0 ? (<div className="text-center py-8">Nenhum cliente</div>) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(c)}><Pencil className="h-4 w-4"/></Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(c.id!)}><Trash2 className="h-4 w-4"/></Button>
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
