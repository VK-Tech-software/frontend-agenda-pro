import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const AuditTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Auditoria/Logs</CardTitle>
      <CardDescription>Atividades recentes da conta</CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="rounded-md border p-3">
        <p className="text-sm font-medium">Login efetuado</p>
        <p className="text-xs text-muted-foreground">Hoje, 09:12 · IP 192.168.1.4</p>
      </div>
      <div className="rounded-md border p-3">
        <p className="text-sm font-medium">Permissões atualizadas</p>
        <p className="text-xs text-muted-foreground">Ontem, 18:44 · Admin</p>
      </div>
      <div className="rounded-md border p-3">
        <p className="text-sm font-medium">Plano alterado</p>
        <p className="text-xs text-muted-foreground">28/01/2026 · Upgrade para Pro</p>
      </div>
    </CardContent>
  </Card>
);
