import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/hooks/use-alert";
import { useProfessionalStore } from "@/feature/profissional/stores/professional-store";
import { PermissionService } from "@/feature/permissions/services/permission-service";
import type { Permission } from "@/feature/permissions/services/permission-service";

type PermissionMap = Record<number, string[]>;

export const PermissionsPage = () => {
  const { showAlert } = useAlert();
  const { professionals, fetchAll } = useProfessionalStore();

  const [permissions, setPermissions] = useState<PermissionMap>({});
  const [permissionList, setPermissionList] = useState<Permission[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const list = await PermissionService.list();
        setPermissionList(list);
      } catch (error) {
        console.error(error);
        showAlert({ title: "Erro", message: "Não foi possível carregar permissões", type: "error" });
      }
    };

    loadPermissions();
  }, [showAlert]);

  const rows = useMemo(() => professionals.filter((p) => typeof p.id === "number"), [professionals]);

  useEffect(() => {
    if (rows.length === 0) {
      setPermissions({});
      return;
    }

    const loadProfessionalPermissions = async () => {
      try {
        const entries = await Promise.all(
          rows.map(async (p) => {
            const perms = await PermissionService.getProfessionalPermissions(p.id as number);
            return [p.id as number, perms] as const;
          })
        );
        setPermissions(Object.fromEntries(entries));
      } catch (error) {
        console.error(error);
        showAlert({ title: "Erro", message: "Não foi possível carregar permissões dos profissionais", type: "error" });
      }
    };

    loadProfessionalPermissions();
  }, [rows, showAlert]);

  const togglePermission = (id: number, key: string) => {
    setPermissions((prev) => {
      const current = prev[id] ?? [];
      const has = current.includes(key);
      const updated = has ? current.filter((k) => k !== key) : [...current, key];
      return { ...prev, [id]: updated };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = Object.entries(permissions).map(([id, perms]) => ({
        id: Number(id),
        permissions: perms,
      }));

      await Promise.all(payload.map((item) => PermissionService.setProfessionalPermissions(item.id, item.permissions)));
      showAlert({ title: "Sucesso", message: "Permissões salvas", type: "success" });
    } catch (error) {
      console.error(error);
      showAlert({ title: "Erro", message: "Não foi possível salvar permissões", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Permissões</CardTitle>
            <CardDescription>Defina permissões por profissional</CardDescription>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">Profissional</th>
                  {permissionList.map((p) => (
                    <th key={p.key} className="text-left font-semibold px-4 py-3">{p.description ?? p.key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={permissionList.length + 1} className="text-center py-6 text-muted-foreground">
                      Nenhum profissional encontrado
                    </td>
                  </tr>
                ) : (
                  rows.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      {permissionList.map((perm) => {
                        const checked = (permissions[p.id as number] ?? []).includes(perm.key);
                        return (
                          <td key={`${p.id}-${perm.key}`} className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePermission(p.id as number, perm.key)}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
