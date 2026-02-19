import { create } from "zustand";
import { CaseService, type CaseDTO, type CasePayload } from "../services/case-service";

interface CaseState {
  cases: CaseDTO[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  createCase: (payload: CasePayload) => Promise<void>;
  updateCase: (id: number, payload: CasePayload) => Promise<void>;
  deleteCase: (id: number) => Promise<void>;
}

export const useCaseStore = create<CaseState>((set) => ({
  cases: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const list = await CaseService.getAll();
      set({ cases: list, loading: false });
    } catch {
      set({ loading: false, error: "Erro ao carregar casos" });
    }
  },

  createCase: async (payload) => {
    set({ loading: true, error: null });
    try {
      const created = await CaseService.create(payload);
      set((state) => ({ cases: [created, ...state.cases], loading: false }));
    } catch {
      set({ loading: false, error:  "Erro ao criar caso" });
    }
  },

  updateCase: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      await CaseService.update(id, payload);
      set((state) => ({
        cases: state.cases.map((c) => (c.id === id ? { ...c, ...payload } : c)),
        loading: false,
      }));
    } catch {
      set({ loading: false, error: "Erro ao atualizar caso" });
    }
  },

  deleteCase: async (id) => {
    set({ loading: true, error: null });
    try {
      await CaseService.delete(id);
      set((state) => ({ cases: state.cases.filter((c) => c.id !== id), loading: false }));
    } catch {
      set({ loading: false, error: "Erro ao excluir caso" });
    }
  },
}));
