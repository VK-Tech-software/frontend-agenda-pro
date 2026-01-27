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
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useStockMovementStore } from "../stores/stockmovement-store";
import { useAlert } from "@/hooks/use-alert";

const movementSchema = z.object({
  stockId: z.number().int(),
  quantity: z.number().int().min(1),
  movementType: z.enum(["IN", "OUT"]),
  notes: z.string().optional().or(z.literal("")),
});

type MovementForm = z.infer<typeof movementSchema>;

export const StockMovementPage = () => {
  const { movements, loading, fetchByCompany, createMovement, deleteMovement } = useStockMovementStore();
  const { showAlert } = useAlert();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<MovementForm>({ resolver: zodResolver(movementSchema), defaultValues: { stockId: 0, quantity: 1, movementType: "IN", notes: "" } });

  useEffect(() => { fetchByCompany(1); }, [fetchByCompany]);

  const onSubmit = async (data: MovementForm) => {
    try {
      await createMovement({ ...data, companyId: 1 });
      showAlert({ title: "Sucesso", message: "Movimento criado", type: "success" });
      setIsOpen(false);
      form.reset();
    } catch (err) {
      showAlert({ title: "Erro", message: "Falha ao criar movimento", type: "destructive" });
    }
  };

  const handleDelete = async (id: number) => { if (!confirm("Confirmar exclusão?")) return; await deleteMovement(id); showAlert({ title: "Sucesso", message: "Movimento excluído", type: "success" }); };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Movimentos de Estoque</CardTitle>
            <CardDescription>Registre entradas e saídas</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={() => { setIsOpen(!isOpen); if (!isOpen) form.reset(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2"/>Novo Movimento</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Movimento</DialogTitle>
                <DialogDescription>Preencha os dados</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField name="stockId" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID do Estoque</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <FormField name="quantity" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <FormField name="movementType" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <FormControl>
                        <select {...field} className="border rounded px-2 py-1 w-full">
                          <option value="IN">Entrada</option>
                          <option value="OUT">Saída</option>
                        </select>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <FormField name="notes" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                    <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin mr-2"/> : null}Criar</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {movements.length === 0 ? (<div className="text-center py-8">Nenhum movimento</div>) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Estoque</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.stockId}</TableCell>
                    <TableCell>{m.quantity}</TableCell>
                    <TableCell>{m.movementType}</TableCell>
                    <TableCell>{new Date(m.createdAt || "").toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(m.id!)}><Trash2 className="h-4 w-4"/></Button>
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
