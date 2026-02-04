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
import { useProductStore } from "../stores/product-store";
import { useAlert } from "@/hooks/use-alert";

const productSchema = z.object({
  name: z.string().min(1, "Nome inválido"),
  description: z.string().optional().or(z.literal("")),
  price: z.string().optional().or(z.literal("")),
});

type ProductForm = z.infer<typeof productSchema>;

export const ProductPage = () => {
  const { products, loading, fetchAll, createProduct, updateProduct, deleteProduct } = useProductStore();
  const { showAlert } = useAlert();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const form = useForm<ProductForm>({ resolver: zodResolver(productSchema), defaultValues: { name: "", description: "", price: "" } });

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const onSubmit = async (data: ProductForm) => {
    try {
      const payload = { name: data.name, description: data.description, price: data.price ? Number(data.price) : undefined };
      if (editingId) {
        await updateProduct(editingId, payload as any);
        showAlert({ title: "Sucesso", message: "Produto atualizado", type: "success" });
      } else {
        await createProduct(payload as any);
        showAlert({ title: "Sucesso", message: "Produto criado", type: "success" });
      }
      setIsOpen(false);
      setEditingId(null);
      form.reset();
    } catch (err) {
      showAlert({ title: "Erro", message: "Falha ao salvar produto", type: "destructive" });
    }
  };

  const handleEdit = (p: any) => { setEditingId(p.id); form.setValue("name", p.name); form.setValue("description", p.description || ""); form.setValue("price", p.price?.toString() || ""); setIsOpen(true); };
  const handleDelete = async (id: number) => { if (!confirm("Confirmar exclusão?")) return; await deleteProduct(id); showAlert({ title: "Sucesso", message: "Produto excluído", type: "success" }); };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>Gerencie os produtos</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={() => { setIsOpen(!isOpen); if (!isOpen) form.reset(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2"/>Novo Produto</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Produto" : "Novo Produto"}</DialogTitle>
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
          {products.length === 0 ? (<div className="text-center py-8">Nenhum produto</div>) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.description || "-"}</TableCell>
                    <TableCell>{p.price !== undefined ? p.price : "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(p)}><Pencil className="h-4 w-4"/></Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(p.id!)}><Trash2 className="h-4 w-4"/></Button>
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
