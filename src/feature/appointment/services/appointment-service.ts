import { api } from "../../../app/api";

export interface AppointmentDTO {
  id?: number;
  companyId: number;
  professionalId: number;
  clientId: number;
  serviceId: number;
  startAt: string;
  durationMinutes: number;
  notes?: string;
  active?: boolean;
}

export type CreateAppointmentRequest = Omit<AppointmentDTO, "id" | "active">;
export type UpdateAppointmentRequest = CreateAppointmentRequest;

export class AppointmentService {
  static async getByCompany(companyId: number): Promise<AppointmentDTO[]> {
    const { data } = await api.get(`/Appointments/company/${companyId}`);
    return data;
  }

  static async getById(id: number): Promise<AppointmentDTO> {
    const { data } = await api.get(`/Appointments/${id}`);
    return data;
  }

  static async create(payload: CreateAppointmentRequest): Promise<AppointmentDTO> {
    const { data } = await api.post(`/Appointments`, payload);
    return data;
  }

  static async update(id: number, payload: UpdateAppointmentRequest): Promise<AppointmentDTO> {
    const { data } = await api.put(`/Appointments/${id}`, payload);
    return data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/Appointments/${id}`);
  }
}
