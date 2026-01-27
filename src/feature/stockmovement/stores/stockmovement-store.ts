import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StockMovementService, type StockMovementDTO, type CreateStockMovementRequest } from "../services/stockmovement-service";

interface StockMovementState {
  movements: StockMovementDTO[];
  loading: boolean;
  error: string | null;
  fetchByCompany: (companyId: number) => Promise<void>;
  fetchByStock: (stockId: number) => Promise<void>;
  createMovement: (payload: CreateStockMovementRequest) => Promise<void>;
  deleteMovement: (id: number) => Promise<void>;
}

export const useStockMovementStore = create<StockMovementState>()(
  persist(
    (set) => ({
      movements: [],
      loading: false,
      error: null,

      fetchByCompany: async (companyId: number) => {
        set({ loading: true, error: null });
        try {
          const data = await StockMovementService.getByCompany(companyId);
          set({ movements: data, loading: false });
        } catch (err: any) {
          set({ loading: false, error: err?.response?.data?.message ?? "Erro ao carregar movimentos" });
        }
      },

      fetchByStock: async (stockId: number) => {
        set({ loading: true, error: null });
        try {
          const data = await StockMovementService.getByStock(stockId);
          set({ movements: data, loading: false });
        } catch (err: any) {
          set({ loading: false, error: err?.response?.data?.message ?? "Erro ao carregar movimentos" });
        }
      },

      createMovement: async (payload: CreateStockMovementRequest) => {
        set({ loading: true, error: null });
        try {
          const created = await StockMovementService.create(payload);
          set((state) => ({ movements: [...state.movements, created], loading: false }));
        } catch (err: any) {
          set({ loading: false, error: err?.response?.data?.message ?? "Erro ao criar movimento" });
          throw err;
        }
      },

      deleteMovement: async (id: number) => {
        set({ loading: true, error: null });
        try {
          await StockMovementService.delete(id);
          set((state) => ({ movements: state.movements.filter((m) => m.id !== id), loading: false }));
        } catch (err: any) {
          set({ loading: false, error: err?.response?.data?.message ?? "Erro ao excluir movimento" });
          throw err;
        }
      },
    }),
    { name: "stockmovement-storage", storage: createJSONStorage(() => sessionStorage) }
  )
);
