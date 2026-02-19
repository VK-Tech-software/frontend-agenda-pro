import { api } from "@/app/api";

export interface PublicCompanyInfo {
  id: number;
  name: string;
  settings: {
    brand_name?: string | null;
    public_start_time?: string | null;
    public_end_time?: string | null;
    public_slot_minutes?: number | null;
    public_working_days?: string | null;
  };
}

export type PublicCompanyItem = Pick<PublicCompanyInfo, "id" | "name">;

export class PublicAvailabilityService {
  static async getCompanyInfo(companyId: number): Promise<PublicCompanyInfo | null> {
    const { data } = await api.get(`/public/companies/${companyId}`);
    const item = data?.dados ?? data?.data ?? data;
    return item ?? null;
  }

  static async listCompanies(): Promise<PublicCompanyItem[]> {
    const { data } = await api.get(`/public/companies`);
    const list = data?.dados ?? data?.data ?? data;
    return Array.isArray(list) ? list : [];
  }

  static async getAvailableSlots(companyId: number, date: string): Promise<string[]> {
    const { data } = await api.get(`/appointment-requests/public/availability`, {
      params: { companyId, date },
    });
    const list = data?.dados ?? data?.data ?? data;
    return Array.isArray(list) ? list : [];
  }
}
