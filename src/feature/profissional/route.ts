import type { RouteObject } from "react-router-dom";
import { ProfessionalPage } from "./pages/professional-page";

export const ProfissionaisRoute: RouteObject[] = [
  {
    path: '/profissionais',
    Component: ProfessionalPage
  }
]
