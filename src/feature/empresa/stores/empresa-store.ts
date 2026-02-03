import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { EmpresaService, type EmpresaDTO } from "../services/empresa-service";

type EmpresaPayload = Omit<EmpresaDTO, "userId">;

interface EmpresaState {
    company: EmpresaDTO | null;
    companies: EmpresaDTO[];
    loading: boolean;
    error: string | null;
    createEmpresa: (data: EmpresaPayload, userId: number) => Promise<void>;
    fetchAll: () => Promise<void>;
    fetchByUserId: (userId: number) => Promise<EmpresaDTO | null>;
    updateEmpresa: (id: number, data: EmpresaPayload) => Promise<void>;
    inactivateEmpresa: (id: number) => Promise<void>;
}

export const useEmpresaStore = create<EmpresaState>()(
    persist(
        (set) => ({
            company: null,
            companies: [],
            loading: false,
            error: null,
            createEmpresa: async (data: EmpresaPayload, userId: number) => {
                set({ loading: true });
                try {
                    const res = await EmpresaService.createEmpresa({ ...data, userId });
                    set({ company: res, companies: res?.id ? [res] : [] });
                } finally {
                    set({ loading: false });
                }
            },
            fetchAll: async () => {
                set({ loading: true, error: null });
                try {
                    const data = await EmpresaService.getAll();
                    set({ companies: data, loading: false });
                } catch (err: any) {
                    set({ loading: false, error: err?.response?.data?.message ?? "Erro ao carregar empresas" });
                }
            },
            fetchByUserId: async (userId: number) => {
                set({ loading: true, error: null });
                try {
                    const data = await EmpresaService.getByUserId(userId);
                    set({ company: data, loading: false });
                    return data;
                } catch (err: any) {
                    set({ loading: false, error: err?.response?.data?.message ?? "Erro ao buscar empresa" });
                    return null;
                }
            },
            updateEmpresa: async (id: number, data: EmpresaPayload) => {
                set({ loading: true, error: null });
                try {
                    const updated = await EmpresaService.update(id, data);
                    set((state) => ({
                        companies: state.companies.map((c) => (c.id === id ? updated : c)),
                        company: state.company?.id === id ? updated : state.company,
                        loading: false,
                    }));
                } catch (err: any) {
                    set({ loading: false, error: err?.response?.data?.message ?? "Erro ao atualizar empresa" });
                    throw err;
                }
            },
            inactivateEmpresa: async (id: number) => {
                set({ loading: true, error: null });
                try {
                    await EmpresaService.inactivate(id);
                    set((state) => ({
                        companies: state.companies.map((c) => (c.id === id ? { ...c, active: false } : c)),
                        company: state.company?.id === id ? { ...state.company, active: false } : state.company,
                        loading: false,
                    }));
                } catch (err: any) {
                    set({ loading: false, error: err?.response?.data?.message ?? "Erro ao inativar empresa" });
                    throw err;
                }
            },
        }),
        {
            name: "empresa-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);