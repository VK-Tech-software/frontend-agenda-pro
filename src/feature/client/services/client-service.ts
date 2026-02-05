import { api } from "../../../app/api";

export interface ClientDTO {
  id?: number;
  name: string;
  phone?: string;
  origem?: string;}

export type CreateClientRequest = Omit<ClientDTO, "id" | "active"> & { password?: string };
export type UpdateClientRequest = CreateClientRequest;

export class ClientService {
  static async getAll(): Promise<ClientDTO[]> {
    const { data } = await api.get(`/Clients`);
    return data;
  }

  static async getById(id: number): Promise<ClientDTO> {
    const { data } = await api.get(`/Clients/${id}`);
    return data;
  }

  static async create(payload: CreateClientRequest): Promise<ClientDTO> {
    const { data } = await api.post(`/Clients`, payload);
    return data;
  }

  static async update(id: number, payload: UpdateClientRequest): Promise<ClientDTO> {
    const { data } = await api.put(`/Clients/${id}`, payload);
    return data;
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/Clients/${id}`);
  }
}
