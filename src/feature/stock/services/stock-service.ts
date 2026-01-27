import { api } from "../../../app/api";

export interface StockDTO {
  id?: number;
  companyId: number;
  productName: string;
  sku?: string;
  description?: string;
  quantity: number;
  minimumQuantity?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateStockRequest = Omit<StockDTO, "id" | "active" | "createdAt" | "updatedAt">;
export type UpdateStockRequest = CreateStockRequest;

export class StockService {
  static async getByCompany(companyId: number): Promise<StockDTO[]> {
    const { data } = await api.get(`/Stocks/company/${companyId}`);
    return data;
  }

  static async getById(id: number): Promise<StockDTO> {
    const { data } = await api.get(`/Stocks/${id}`);
    return data;
  }

  static async create(payload: CreateStockRequest): Promise<StockDTO> {
    const { data } = await api.post(`/Stocks`, payload);
    return data;
  }

  static async update(id: number, payload: UpdateStockRequest): Promise<StockDTO> {
    const { data } = await api.put(`/Stocks/${id}`, payload);
    return data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/Stocks/${id}`);
  }
}
