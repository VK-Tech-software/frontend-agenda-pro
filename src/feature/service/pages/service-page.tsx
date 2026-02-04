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
import { useServiceStore } from "../stores/service-store";
import { useAlert } from "@/hooks/use-alert";
import type { ServiceDTO } from "../services/service-service";
import { ProductService } from "../../product/services/product-service";

const serviceSchema = z.object({
  name: z.string().min(2, "Nome inválido"),
  description: z.string().optional().or(z.literal("")),
  price: z.number().min(0),
  durationMinutes: z.number().int().min(1),
  productIds: z.array(z.number()).optional(),
});

type ServiceForm = z.infer<typeof serviceSchema>;

export const ServicePage = () => {
  const { services, loading, fetchByCompany, createService, updateService, deleteService } = useServiceStore();
  const { showAlert } = useAlert();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const form = useForm<ServiceForm>({ resolver: zodResolver(serviceSchema), defaultValues: { name: "", description: "", price: 0, durationMinutes: 30, productIds: [] } });

  useEffect(() => { fetchByCompany(1); loadProducts(); }, [fetchByCompany]);

  const loadProducts = async () => {
    const prods = await ProductService.getAll();
    setAvailableProducts(prods.map((p: any) => ({ value: p.id, label: p.name })));
  };

  const onSubmit = async (data: ServiceForm) => {
    try {
      const payload = { ...data, companyId: 1, productIds: data.productIds || [] } as any;
      if (editingId) {
        await updateService(editingId, payload);
        showAlert({ title: "Sucesso", message: "Serviço atualizado", type: "success" });
      } else {
        await createService(payload);
        showAlert({ title: "Sucesso", message: "Serviço criado", type: "success" });
      }
      setIsOpen(false);
      setEditingId(null);
      form.reset();
    } catch (err) {
      showAlert({ title: "Erro", message: "Falha ao salvar serviço", type: "destructive" });
    }
  };

  const handleEdit = (s: any) => {
    setEditingId(s.id);
    form.setValue("name", s.name);
    form.setValue("description", s.description || "");
    form.setValue("price", s.price);
    form.setValue("durationMinutes", s.durationMinutes);
    form.setValue("productIds", s.productIds || []);
    setIsOpen(true);
  };
  const handleDelete = async (id: number) => { if (!confirm("Confirmar exclusão?")) return; await deleteService(id); showAlert({ title: "Sucesso", message: "Serviço excluído", type: "success" }); };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Serviços</CardTitle>
            <CardDescription>Gerencie os serviços</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={() => { setIsOpen(!isOpen); if (!isOpen) form.reset(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2"/>Novo Serviço</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
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

                  <FormField name="description" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage/>
                    </FormItem>
                  )} />

                  <FormField name="price" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço</FormLabel>
                      <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
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
                  
                  <FormField name="productIds" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Produtos</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {availableProducts.map((p) => {
                            const selected = Array.isArray(field.value) && field.value.includes(p.value);
                            return (
                              <Button
                                key={p.value}
                                type="button"
                                size="sm"
                                variant={selected ? "default" : "outline"}
                                onClick={() => {
                                  const current = Array.isArray(field.value) ? [...field.value] : [];
                                  const idx = current.indexOf(p.value);
                                  if (idx === -1) current.push(p.value);
                                  else current.splice(idx, 1);
                                  field.onChange(current);
                                }}
                              >
                                {p.label}
                              </Button>
                            );
                          })}
                        </div>
                      </FormControl>
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
          {services.length === 0 ? (<div className="text-center py-8">Nenhum serviço</div>) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((s: ServiceDTO) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.price.toFixed(2)}</TableCell>
                    <TableCell>{s.durationMinutes} min</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(s)}><Pencil className="h-4 w-4"/></Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(s.id!)}><Trash2 className="h-4 w-4"/></Button>
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
