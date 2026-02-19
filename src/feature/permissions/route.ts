import type { RouteObject } from "react-router-dom";
import { PermissionsPage } from "./pages/permissions-page";

export const PermissionsRoute: RouteObject[] = [
  {
    path: "/permissoes",
    Component: PermissionsPage,
  },
];
