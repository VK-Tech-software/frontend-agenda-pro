import { api } from "@/app/api";

export interface NotificationDTO {
  id: string;
  type: string;
  title: string;
  description?: string;
  createdAt?: string;
  meta?: Record<string, unknown>;
}

export class NotificationService {
  static async getAll(): Promise<NotificationDTO[]> {
    const { data } = await api.get(`/notifications`);
    const list = data?.dados ?? data?.data ?? data;
    return Array.isArray(list) ? list : [];
  }
}
