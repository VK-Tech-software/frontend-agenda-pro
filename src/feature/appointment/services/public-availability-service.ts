import { api } from "@/app/api";

export interface PublicCompanyInfo {
  id: number;
  name: string;
  settings: {
    brand_name?: string | null;
    primary_color?: string | null;
    secondary_color?: string | null;
    header_bg_color?: string | null;
    public_start_time?: string | null;
    public_end_time?: string | null;
    public_slot_minutes?: number | null;
    public_working_days?: string | null;
  };
  services?: PublicServiceItem[];
  professionals?: PublicProfessionalItem[];
}

export interface PublicServiceItem {
  id: number;
  service_name: string;
  price?: number | null;
  duration?: number | null;
}

export interface PublicProfessionalItem {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
}

export type PublicCompanyItem = Pick<PublicCompanyInfo, "id" | "name">;

export class PublicAvailabilityService {
  static async getCompanyInfo(companyId: number): Promise<PublicCompanyInfo | null> {
    const { data } = await api.get(`/public/companies/${companyId}`);
    const item = data?.dados ?? data?.data ?? data;
    if (!item) return null;

    const normalizedServices = Array.isArray(item.services)
      ? item.services.map((service: any) => ({
          id: Number(service.id),
          service_name: service.service_name ?? service.name ?? "Servico",
          price: service.price != null ? Number(service.price) : null,
          duration:
            service.duration != null
              ? Number(service.duration)
              : service.duration_minutes != null
                ? Number(service.duration_minutes)
                : null,
        }))
      : [];

    return {
      ...item,
      services: normalizedServices,
    } as PublicCompanyInfo;
  }

  static async listCompanies(): Promise<PublicCompanyItem[]> {
    const { data } = await api.get(`/public/companies`);
    const list = data?.dados ?? data?.data ?? data;
    return Array.isArray(list) ? list : [];
  }

  static async getAvailableSlots(companyId: number, date: string, professionalId?: number): Promise<string[]> {
    const params: any = { companyId, date };
    if (professionalId) params.professionalId = professionalId;
    const { data } = await api.get(`/appointment-requests/public/availability`, {
      params,
    });
    const list = data?.dados ?? data?.data ?? data;
    return Array.isArray(list) ? list : [];
  }
}
