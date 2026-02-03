import create from 'zustand';
import { ServiceService, type ServiceDTO, type CreateServiceRequest, type UpdateServiceRequest } from '../services/service-service';

interface ServiceState {
  services: ServiceDTO[];
  loading: boolean;
  fetchByCompany: (companyId: number) => Promise<void>;
  getById: (id: number) => Promise<ServiceDTO | null>;
  createService: (payload: CreateServiceRequest) => Promise<void>;
  updateService: (id: number, payload: UpdateServiceRequest) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  loading: false,
  fetchByCompany: async (companyId: number) => {
    set({ loading: true });
    const data = await ServiceService.getByCompany(companyId);
    set({ services: data, loading: false });
  },
  getById: async (id: number) => {
    set({ loading: true });
    const data = await ServiceService.getById(id);
    set({ loading: false });
    return data;
  },
  createService: async (payload: CreateServiceRequest) => {
    set({ loading: true });
    const created = await ServiceService.create(payload);
    set((state) => ({ services: [...state.services, created], loading: false }));
  },
  updateService: async (id: number, payload: UpdateServiceRequest) => {
    set({ loading: true });
    const updated = await ServiceService.update(id, payload as any);
    set((state) => ({ services: state.services.map(s => s.id === id ? updated : s), loading: false }));
  },
  deleteService: async (id: number) => {
    set({ loading: true });
    await ServiceService.delete(id);
    set((state) => ({ services: state.services.filter(s => s.id !== id), loading: false }));
  }
}));
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ServiceService, type ServiceDTO, type CreateServiceRequest, type UpdateServiceRequest } from "../services/service-service";

interface ServiceState {
  services: ServiceDTO[];
  selected: ServiceDTO | null;
  loading: boolean;
  error: string | null;
  fetchByCompany: (companyId: number) => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  createService: (payload: CreateServiceRequest) => Promise<void>;
  updateService: (id: number, payload: UpdateServiceRequest) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
}

export const useServiceStore = create<ServiceState>()(
  persist(
    (set) => ({
      services: [],
      selected: null,
      loading: false,
      error: null,

      fetchByCompany: async (companyId: number) => {
        set({ loading: true, error: null });
        try {
          const data = await ServiceService.getByCompany(companyId);
          set({ services: data, loading: false });
        } catch (err: any) {
          set({ loading: false, error: err?.response?.data?.message ?? "Erro ao carregar serviços" });
        }
      },

      fetchById: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const data = await ServiceService.getById(id);
          set({ selected: data, loading: false });
        } catch (err: any) {
          set({ loading: false, error: err?.response?.data?.message ?? "Erro ao carregar serviço" });
        }
      },

      createService: async (payload: CreateServiceRequest) => {
        set({ loading: true, error: null });
        try {
          const created = await ServiceService.create(payload);
          set((state) => ({ services: [...state.services, created], loading: false }));
        } catch (err: any) {
          set({ loading: false, error: err?.response?.data?.message ?? "Erro ao criar serviço" });
          throw err;
        }
      },

      updateService: async (id: number, payload: UpdateServiceRequest) => {
        set({ loading: true, error: null });
        try {
          const updated = await ServiceService.update(id, payload);
          set((state) => ({ services: state.services.map((s) => (s.id === id ? updated : s)), selected: state.selected?.id === id ? updated : state.selected, loading: false }));
        } catch (err: any) {
          set({ loading: false, error: err?.response?.data?.message ?? "Erro ao atualizar serviço" });
          throw err;
        }
      },

      deleteService: async (id: number) => {
        set({ loading: true, error: null });
        try {
          await ServiceService.delete(id);
          set((state) => ({ services: state.services.filter((s) => s.id !== id), selected: state.selected?.id === id ? null : state.selected, loading: false }));
        } catch (err: any) {
          set({ loading: false, error: err?.response?.data?.message ?? "Erro ao excluir serviço" });
          throw err;
        }
      },
    }),
    { name: "service-storage", storage: createJSONStorage(() => sessionStorage) }
  )
);
