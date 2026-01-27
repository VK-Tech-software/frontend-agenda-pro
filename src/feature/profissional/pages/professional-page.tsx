import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useProfessionalStore } from "../stores/professional-store";
import { useAlert } from "@/hooks/use-alert";
import { AuthStore } from "../../auth/stores/auth-store";

const professionalSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido").optional().or(z.literal("")),
  specialization: z.string().optional().or(z.literal("")),
});

type ProfessionalFormValues = z.infer<typeof professionalSchema>;

export const ProfessionalPage = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { user } = AuthStore();

  const {
    professionals,
    loading,
    fetchByCompany,
    createProfessional,
    updateProfessional,
    deleteProfessional,
  } = useProfessionalStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialization: "",
    },
  });

  useEffect(() => {
    // TODO: substituir por companyId real quando disponível
    const companyId = 1; // Provisório
    if (companyId) {
      fetchByCompany(companyId);
    }
  }, [fetchByCompany]);

  const onSubmit = async (data: ProfessionalFormValues) => {
    try {
      const companyId = 1; // TODO: pegar companyId real
      if (editingId) {
        await updateProfessional(editingId, { ...data, companyId });
        showAlert({
          title: "Sucesso",
          message: "Profissional atualizado com sucesso",
          type: "success",
        });
      } else {
        await createProfessional({ ...data, companyId });
        showAlert({
          title: "Sucesso",
          message: "Profissional criado com sucesso",
          type: "success",
        });
      }
      setIsDialogOpen(false);
      setEditingId(null);
      form.reset();
    } catch (error) {
      showAlert({
        title: "Erro",
        message: "Erro ao salvar profissional",
        type: "destructive",
      });
    }
  };

  const handleEdit = (professional: any) => {
    setEditingId(professional.id);
    form.setValue("name", professional.name);
    form.setValue("email", professional.email);
    form.setValue("phone", professional.phone || "");
    form.setValue("specialization", professional.specialization || "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este profissional?")) return;
    try {
      await deleteProfessional(id);
      showAlert({
        title: "Sucesso",
        message: "Profissional excluído com sucesso",
        type: "success",
      });
    } catch (error) {
      showAlert({
        title: "Erro",
        message: "Erro ao excluir profissional",
        type: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    form.reset();
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Profissionais</CardTitle>
            <CardDescription>Gerencie os profissionais da sua empresa</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Profissional
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Editar Profissional" : "Novo Profissional"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do profissional
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="(11) 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Especialização (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Cabelereiro, Manicure..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDialogClose}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingId ? "Atualizar" : "Criar"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : professionals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum profissional cadastrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Especialização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {professionals.map((professional) => (
                  <TableRow key={professional.id}>
                    <TableCell className="font-medium">{professional.name}</TableCell>
                    <TableCell>{professional.email}</TableCell>
                    <TableCell>{professional.phone || "-"}</TableCell>
                    <TableCell>{professional.specialization || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(professional)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(professional.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
