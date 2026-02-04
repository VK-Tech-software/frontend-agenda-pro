import type { RouteObject } from "react-router-dom";
import { ProductPage } from "./pages/product-page";

export const ProductRoute: RouteObject[] = [
  {
    path: "/produtos",
    Component: ProductPage,
  },
];
