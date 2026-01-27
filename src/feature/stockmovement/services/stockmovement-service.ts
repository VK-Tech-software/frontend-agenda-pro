import { api } from "../../../app/api";

export interface StockMovementDTO {
  id?: number;
  companyId: number;
  stockId: number;
  quantity: number;
  movementType: string; // "IN" | "OUT"
  notes?: string;
  createdAt?: string;
}

export type CreateStockMovementRequest = Omit<StockMovementDTO, "id" | "createdAt">;

export class StockMovementService {
  static async getByCompany(companyId: number): Promise<StockMovementDTO[]> {
    const { data } = await api.get(`/StockMovements/company/${companyId}`);
    return data;
  }

  static async getByStock(stockId: number): Promise<StockMovementDTO[]> {
    const { data } = await api.get(`/StockMovements/stock/${stockId}`);
    return data;
  }

  static async create(payload: CreateStockMovementRequest): Promise<StockMovementDTO> {
    const { data } = await api.post(`/StockMovements`, payload);
    return data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/StockMovements/${id}`);
  }
}
