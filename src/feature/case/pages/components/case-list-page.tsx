import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { CaseDTO } from "../../services/case-service";

interface CaseListPageProps {
  cases: CaseDTO[];
  clientNames: Record<number, string>;
  professionalNames: Record<number, string>;
  onEdit: (item: CaseDTO) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

export const CaseListPage = ({ cases, clientNames, professionalNames, onEdit, onDelete, loading }: CaseListPageProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Nº processo</TableHead>
          <TableHead>Área</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Profissional</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Prioridade</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cases.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center">Nenhum caso encontrado</TableCell>
          </TableRow>
        ) : (
          cases.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.case_number ?? "-"}</TableCell>
              <TableCell>{item.area ?? "-"}</TableCell>
              <TableCell>{item.client_id ? (clientNames[item.client_id] ?? `#${item.client_id}`) : "-"}</TableCell>
              <TableCell>{item.professional_id ? (professionalNames[item.professional_id] ?? `#${item.professional_id}`) : "-"}</TableCell>
              <TableCell>{item.status ?? "-"}</TableCell>
              <TableCell>{item.priority ?? "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button size="icon" variant="ghost" onClick={() => onEdit(item)} disabled={loading}>
                    <Pencil size={16} />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(item.id!)} disabled={loading}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
