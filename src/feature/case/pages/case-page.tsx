import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCaseStore } from "../store/case-store";
import { useClientStore } from "@/feature/client/stores/client-store";
import { useProfessionalStore } from "@/feature/profissional/stores/professional-store";
import { CaseFormPage } from "./components/case-form-page";
import { CaseListPage } from "./components/case-list-page";
import type { CaseDTO, CasePayload } from "../services/case-service";

export const CasePage = () => {
  const { cases, loading, fetchAll, createCase, updateCase, deleteCase } = useCaseStore();
  const { clients, fetchAll: fetchClients } = useClientStore();
  const { professionals, fetchAll: fetchProfessionals } = useProfessionalStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formInitial, setFormInitial] = useState<CasePayload | undefined>(undefined);

  useEffect(() => {
    fetchAll();
    fetchClients();
    fetchProfessionals();
  }, [fetchAll, fetchClients, fetchProfessionals]);

  const clientNames = clients.reduce<Record<number, string>>((acc, client) => {
    if (typeof client.id === "number") {
      acc[client.id] = client.name;
    }
    return acc;
  }, {});

  const professionalNames = professionals.reduce<Record<number, string>>((acc, professional) => {
    if (typeof professional.id === "number") {
      acc[professional.id] = professional.name ?? "";
    }
    return acc;
  }, {});

  const clientOptions = clients
    .filter((client) => typeof client.id === "number")
    .map((client) => ({ value: client.id as number, label: client.name }));

  const professionalOptions = professionals
    .filter((professional) => typeof professional.id === "number")
    .map((professional) => ({
      value: professional.id as number,
      label: professional.name ?? "",
    }));

  const handleEdit = (item: CaseDTO) => {
    setEditingId(item.id ?? null);
    setFormInitial({
      title: item.title,
      caseNumber: item.case_number ?? "",
      area: item.area ?? "",
      status: item.status ?? "Ativo",
      priority: item.priority ?? "Normal",
      notes: item.notes ?? "",
      clientId: item.client_id ?? null,
      professionalId: item.professional_id ?? null,
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Confirmar exclusão?")) return;
    await deleteCase(id);
  };

  const handleSubmit = async (data: CasePayload) => {
    if (editingId) {
      await updateCase(editingId, data);
    } else {
      await createCase(data);
    }
    setIsOpen(false);
    setEditingId(null);
    setFormInitial(undefined);
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Casos</CardTitle>
            <CardDescription>Gerencie os casos jurídicos</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setEditingId(null);
              setFormInitial(undefined);
            }
          }}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto"><Plus className="mr-2" />Novo Caso</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Caso" : "Novo Caso"}</DialogTitle>
                <DialogDescription>Preencha os dados do caso</DialogDescription>
              </DialogHeader>
              <CaseFormPage
                initialValues={formInitial}
                clientOptions={clientOptions}
                professionalOptions={professionalOptions}
                onSubmit={handleSubmit}
                loading={loading}
                onCancel={() => setIsOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <CaseListPage
            cases={cases}
            clientNames={clientNames}
            professionalNames={professionalNames}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
};
