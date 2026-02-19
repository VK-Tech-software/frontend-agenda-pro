import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStockMovementPageProps {
    totals: {
        totalIn: number;
        totalOut: number;
        net: number;
    };
}



export const DashboardStockMovementPage = ({ totals }: DashboardStockMovementPageProps) => {
    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mb-6">
            <Card>
                <CardHeader>
                    <CardDescription>Entradas</CardDescription>
                    <CardTitle>{totals.totalIn}</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Saídas</CardDescription>
                    <CardTitle>{totals.totalOut}</CardTitle>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardDescription>Saldo</CardDescription>
                    <CardTitle>{totals.net}</CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
};