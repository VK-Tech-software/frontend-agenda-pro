import type { RouteObject } from "react-router-dom";
import { PlanSelectionPage } from "./pages/plan-selection-page";

export const BillingRoutes: RouteObject[] = [
  {
    path: "/planos",
    Component: PlanSelectionPage,
  },
];
