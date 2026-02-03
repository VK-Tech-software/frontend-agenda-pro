import { createBrowserRouter } from "react-router-dom";
import { DashboardRoute } from "../feature/dashboard/route";
import { EmpresaRoute } from "../feature/empresa/route";
import { AuthRoute } from "../feature/auth/route";
import { PrivateLayout } from "../layouts/private-layout";
import { ProfissionaisRoute } from "../feature/profissionais/route";
import { ServicosRoute } from "@/feature/servicos/routes";
import { ProductRoute } from "@/feature/product/route";
import { StockMovementRoute } from "@/feature/stockmovement/route";
import { ClientRoutes } from "@/feature/client/route";

export const router = createBrowserRouter([

  ...AuthRoute,

  {
    path: "/",
    Component: PrivateLayout,
    children: [
      ...DashboardRoute,
      ...EmpresaRoute,
      ...ProfissionaisRoute,
      ...ServicosRoute,
      ...ProductRoute,
      ...ClientRoutes,
      ...StockMovementRoute
    ],
  },
]);
