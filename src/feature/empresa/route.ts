import type { RouteObject } from "react-router-dom";
import { EmpresaPage } from "./pages/empresa-page";
import { EmpresaListPage } from "./pages/empresa-list-page";

export const EmpresaRoute: RouteObject[] = [
  {
    path: '/empresa',
    Component: EmpresaListPage
  },
  {
    path: '/empresa/cadastro',
    Component: EmpresaPage
  }
]