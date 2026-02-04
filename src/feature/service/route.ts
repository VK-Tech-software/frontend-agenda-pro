import type { RouteObject } from "react-router-dom";
import { ServicePage } from "./pages/service-page";

export const ServiceRoute: RouteObject[] = [
  {
    path: '/servicos',
    Component: ServicePage
  }
];