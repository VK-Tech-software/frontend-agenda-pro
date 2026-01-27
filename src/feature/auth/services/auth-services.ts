import { api } from "../../../app/api"

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: "client" | "professional" | "manager";
  cnpjcpf: string;
  phone: string;
};

export class AuthService {
  static async login(payload: { email: string; password: string }) {
    const response = await api.post("Auth/login", payload)
    console.log(response.data)
    return response.data
  }

  static async register(payload: RegisterPayload) {
    const { data } = await api.post("Auth/register", payload)
    return data
  }
}