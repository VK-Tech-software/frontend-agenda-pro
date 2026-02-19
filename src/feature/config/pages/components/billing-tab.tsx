import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const BillingTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Cobrança e plano</CardTitle>
      <CardDescription>Plano atual, upgrade e histórico</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="rounded-lg border p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Plano atual</p>
          <p className="text-lg font-semibold">Pro Mensal</p>
        </div>
        <Button>Fazer upgrade</Button>
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium">Faturas recentes</p>
        <div className="rounded-md border p-3 flex items-center justify-between">
          <span>Jan/2026</span>
          <Button variant="outline">Baixar</Button>
        </div>
        <div className="rounded-md border p-3 flex items-center justify-between">
          <span>Dez/2025</span>
          <Button variant="outline">Baixar</Button>
        </div>
      </div>
    </CardContent>
  </Card>
);
