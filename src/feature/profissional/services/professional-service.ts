import { api } from "../../../app/api";

export interface ProfessionalDTO {
  id?: number;
  companyId: number;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  available?: boolean;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateProfessionalRequest = Omit<ProfessionalDTO, "id" | "createdAt" | "updatedAt" | "active" | "available">;
export type UpdateProfessionalRequest = CreateProfessionalRequest;

export class ProfessionalService {
  static async getByCompany(companyId: number): Promise<ProfessionalDTO[]> {
    const { data } = await api.get(`/Professionals/company/${companyId}`);
    return data;
  }

  static async getById(id: number): Promise<ProfessionalDTO> {
    const { data } = await api.get(`/Professionals/${id}`);
    return data;
  }

  static async create(payload: CreateProfessionalRequest): Promise<ProfessionalDTO> {
    const { data } = await api.post("/Professionals", payload);
    return data;
  }

  static async update(id: number, payload: UpdateProfessionalRequest): Promise<ProfessionalDTO> {
    const { data } = await api.put(`/Professionals/${id}`, payload);
    return data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/Professionals/${id}`);
  }
}
