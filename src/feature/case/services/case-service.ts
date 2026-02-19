import { api } from "@/app/api";

export interface CaseDTO {
  id?: number;
  company_id?: number;
  client_id?: number | null;
  professional_id?: number | null;
  title: string;
  case_number?: string | null;
  area?: string | null;
  status?: string | null;
  priority?: string | null;
  notes?: string | null;
}

export interface CasePayload {
  clientId?: number | null;
  professionalId?: number | null;
  title: string;
  caseNumber?: string | null;
  area?: string | null;
  status?: string | null;
  priority?: string | null;
  notes?: string | null;
}

export class CaseService {
  static async getAll(): Promise<CaseDTO[]> {
    const { data } = await api.get(`/cases`);
    const list = data?.dados ?? data?.data ?? data;
    return Array.isArray(list) ? list : [];
  }

  static async create(payload: CasePayload): Promise<CaseDTO> {
    const { data } = await api.post(`/cases`, payload);
    return data?.dados ?? data?.data ?? data;
  }

  static async update(id: number, payload: CasePayload): Promise<void> {
    await api.put(`/cases/${id}`, payload);
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/cases/${id}`);
  }
}
