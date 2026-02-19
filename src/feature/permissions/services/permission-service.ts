import { api } from "@/app/api";

export type Permission = {
  id: number;
  key: string;
  description?: string | null;
};

type ApiPayload<T> = {
  statusCode?: number;
  data?: T;
};

export const PermissionService = {
  async list(): Promise<Permission[]> {
    const { data } = await api.get<Permission[] | ApiPayload<Permission[]>>("/permissions");
    if (Array.isArray(data)) {
      return data;
    }
    return Array.isArray(data?.data) ? data.data : [];
  },

  async getProfessionalPermissions(professionalId: number): Promise<string[]> {
    const { data } = await api.get<{ permissions: string[] } | ApiPayload<{ permissions: string[] }>>(
      `/profissionals/${professionalId}/permissions`
    );

    if ("permissions" in (data as { permissions?: string[] })) {
      return (data as { permissions?: string[] }).permissions ?? [];
    }

    return (data as ApiPayload<{ permissions: string[] }>).data?.permissions ?? [];
  },

  async setProfessionalPermissions(professionalId: number, permissions: string[]): Promise<void> {
    await api.put(`/profissionals/${professionalId}/permissions`, { permissions });
  },
};
