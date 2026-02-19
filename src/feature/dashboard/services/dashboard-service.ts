import { api } from "@/app/api";

export type DashboardMetrics = {
  appointmentsToday: number;
  newClientsToday: number;
  lowStock: Array<{ id: number; name: string; stock_quantity: number }>;
  topServices: Array<{ service_id: number; service_name: string; total: number }>;
  cancelRate: { total: number; canceled: number; rate: number };
};

type ApiPayload<T> = {
  statusCode?: number;
  data?: T;
};

export const DashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const { data } = await api.get<DashboardMetrics | ApiPayload<DashboardMetrics>>("/dashboard/metrics");
    if (data && "data" in (data as ApiPayload<DashboardMetrics>)) {
      return (data as ApiPayload<DashboardMetrics>).data as DashboardMetrics;
    }
    return data as DashboardMetrics;
  },
};
