import type { RouteObject } from "react-router-dom";
import { StockMovementPage } from "./pages/stockmovement-page";

export const StockMovementRoute: RouteObject[] = [
  {
    path: "/estoque/movimentacoes",
    Component: StockMovementPage,
  }
]
