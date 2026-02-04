import type { RouteObject } from "react-router-dom";
import { StockPage } from "./pages/stock-page";

export const StockRoute: RouteObject[] = [
  {
    path: "/estoque",
    Component: StockPage,
  },
];
