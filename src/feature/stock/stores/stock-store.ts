import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StockService, type StockDTO, type CreateStockRequest, type UpdateStockRequest } from "../services/stock-service";

interface StockState {
  stocks: StockDTO[];
  selected: StockDTO | null;
  loading: boolean;
  error: string | null;
  fetchByCompany: (companyId: number) => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  createStock: (payload: CreateStockRequest) => Promise<void>;
  updateStock: (id: number, payload: UpdateStockRequest) => Promise<void>;
  deleteStock: (id: number) => Promise<void>;
}

export const useStockStore = create<StockState>()(
  persist(
    (set) => ({
      stocks: [],
      selected: null,
      loading: false,
      error: null,

      fetchByCompany: async (companyId: number) => {
        set({ loading: true, error: null });
        try {
          const data = await StockService.getByCompany(companyId);
          set({ stocks: data, loading: false });
        } catch (err: any) {
          set({ loading: false, error: err?.response?.data?.message ?? "Erro ao carregar estoque" });
        }
      },

      fetchById: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const data = await StockService.getById(id);
          set({ selected: data, loading: false });
        } catch (err: any) {
          set({ loading: false, error: err?.response?.data?.message ?? "Erro ao carregar item de estoque" });
        }
      },

      createStock: async (payload: CreateStockRequest) => {
        set({ loading: true, error: null });
        try {
          const created = await StockService.create(payload);
          set((state) => ({ stocks: [...state.stocks, created], loading: false }));
        } catch (err: any) {
          set({ loading: false, error: err?.response?.data?.message ?? "Erro ao criar item de estoque" });
          throw err;
        }
      },

      updateStock: async (id: number, payload: UpdateStockRequest) => {
        set({ loading: true, error: null });
        try {
          const updated = await StockService.update(id, payload);
          set((state) => ({ stocks: state.stocks.map((s) => (s.id === id ? updated : s)), selected: state.selected?.id === id ? updated : state.selected, loading: false }));
        } catch (err: any) {
          set({ loading: false, error: err?.response?.data?.message ?? "Erro ao atualizar item de estoque" });
          throw err;
        }
      },

      deleteStock: async (id: number) => {
        set({ loading: true, error: null });
        try {
          await StockService.delete(id);
          set((state) => ({ stocks: state.stocks.filter((s) => s.id !== id), selected: state.selected?.id === id ? null : state.selected, loading: false }));
        } catch (err: any) {
          set({ loading: false, error: err?.response?.data?.message ?? "Erro ao excluir item de estoque" });
          throw err;
        }
      },
    }),
    { name: "stock-storage", storage: createJSONStorage(() => sessionStorage) }
  )
);
