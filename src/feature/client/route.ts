import type { RouteObject } from "react-router-dom";
import { ClientPage } from "./pages/client-page";

export const ClientRoutes: RouteObject[] = [
  {
    path: '/clientes',
    Component: ClientPage
  }
]
