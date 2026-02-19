import type { RouteObject } from "react-router-dom";
import { ConfigPage } from "./pages/config-page";

export const ConfigRoute: RouteObject[] = [
  {
    path: "/config",
    Component: ConfigPage,
  },
];
