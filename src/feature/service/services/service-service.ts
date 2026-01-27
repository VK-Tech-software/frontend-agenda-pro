import { api } from "../../../app/api";

export interface ServiceDTO {
  id?: number;
  companyId: number;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateServiceRequest = Omit<ServiceDTO, "id" | "active" | "createdAt" | "updatedAt">;
export type UpdateServiceRequest = CreateServiceRequest;

export class ServiceService {
  static async getByCompany(companyId: number): Promise<ServiceDTO[]> {
    const { data } = await api.get(`/Services/company/${companyId}`);
    return data;
  }

  static async getById(id: number): Promise<ServiceDTO> {
    const { data } = await api.get(`/Services/${id}`);
    return data;
  }

  static async create(payload: CreateServiceRequest): Promise<ServiceDTO> {
    const { data } = await api.post(`/Services`, payload);
    return data;
  }

  static async update(id: number, payload: UpdateServiceRequest): Promise<ServiceDTO> {
    const { data } = await api.put(`/Services/${id}`, payload);
    return data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/Services/${id}`);
  }
}
